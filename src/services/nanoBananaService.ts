import { AIGenerateConfig, StyleExtraction } from '../types';
import { STYLE_PRESETS, RETRY_ATTEMPTS, RETRY_DELAYS, MAX_CONCURRENT_REQUESTS } from '../constants';

// Use gemini-2.5-flash-image for BOTH image generation AND style extraction
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export async function extractStyleFromImages(apiKey: string, referenceImages: string[]): Promise<StyleExtraction> {
  try {
    const imageParts = referenceImages.map(img => ({
      inlineData: {
        data: img.split(',')[1],
        mimeType: img.includes('png') ? 'image/png' : 'image/jpeg'
      }
    }));

    const response = await fetch(
      `${GEMINI_API}?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: 'Analyze these reference images and extract their visual style. Describe:\n1. Main colors and palette\n2. Lighting quality and direction\n3. Composition and framing\n4. Overall mood and atmosphere\nBe specific and concise.'
              },
              ...imageParts
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Style extraction API error:', errorData);
      throw new Error(`Style extraction failed: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return parseStyleExtraction(analysisText);
  } catch (error) {
    console.error('Style extraction error:', error);
    return {
      colorPalette: '',
      lighting: '',
      composition: '',
      mood: ''
    };
  }
}

function parseStyleExtraction(text: string): StyleExtraction {
  const sections = {
    colorPalette: extractSection(text, 'color'),
    lighting: extractSection(text, 'lighting'),
    composition: extractSection(text, 'composition'),
    mood: extractSection(text, 'mood')
  };
  return sections;
}

function extractSection(text: string, keyword: string): string {
  const regex = new RegExp(`${keyword}[^:]*:([^.]*\.)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

export function buildOptimizedPrompt(
  userPrompt: string,
  styleName: string,
  styleExtraction?: StyleExtraction
): string {
  const preset = STYLE_PRESETS.find(p => p.name === styleName) || STYLE_PRESETS[0];
  
  // Enhanced prompt structure with technical details
  let enhancedPrompt = userPrompt;
  
  // Add style-specific technical details
  const styleEnhancements = getStyleEnhancements(styleName);
  enhancedPrompt = `${userPrompt}, ${styleEnhancements}`;
  
  // Apply preset structure
  let prompt = preset.promptStructure.replace('{prompt}', enhancedPrompt);

  // If we have reference image style extraction, append it with clear structure
  if (styleExtraction && (styleExtraction.colorPalette || styleExtraction.lighting || styleExtraction.composition || styleExtraction.mood)) {
    prompt += '\n\n=== STYLE REFERENCE (from uploaded images) ===';
    if (styleExtraction.colorPalette) {
      prompt += `\n• COLOR PALETTE: ${styleExtraction.colorPalette}`;
    }
    if (styleExtraction.lighting) {
      prompt += `\n• LIGHTING: ${styleExtraction.lighting}`;
    }
    if (styleExtraction.composition) {
      prompt += `\n• COMPOSITION: ${styleExtraction.composition}`;
    }
    if (styleExtraction.mood) {
      prompt += `\n• MOOD: ${styleExtraction.mood}`;
    }
    prompt += '\n\n=== INSTRUCTION ===\nCreate an image that EXACTLY matches the subject description above while CAREFULLY replicating the visual style characteristics from the reference images. Pay special attention to matching the color scheme, lighting quality, compositional approach, and overall atmosphere.';
  }

  return prompt;
}

function getStyleEnhancements(styleName: string): string {
  const enhancements: Record<string, string> = {
    'Cinematic': 'shot with anamorphic lens, dramatic lighting with strong shadows and highlights, film grain texture, color graded with teal and orange tones, shallow depth of field, 35mm photography, professional composition',
    'Anime': 'Japanese anime art style, vibrant cel-shaded colors, clean line art, expressive character features, dynamic poses, studio ghibli quality, detailed background art',
    'Oil Painting': 'traditional oil painting on canvas, visible brush strokes, rich color blending, impasto texture, classical painting technique, museum quality, fine art style',
    'Pixel Art': '16-bit pixel art style, limited color palette, crisp pixels, retro game aesthetic, dithering effects, clean pixel-perfect edges, nostalgic gaming art',
    'Abstract': 'abstract art composition, non-representational forms, bold geometric shapes, experimental color combinations, contemporary art style, emotional expression through color and form',
    'Watercolor': 'delicate watercolor painting, soft color washes, paper texture visible, fluid paint bleeds, transparent layers, artistic brush work, hand-painted quality',
    'Digital Art': 'high-quality digital illustration, clean vector-like precision, modern graphic design, vibrant digital colors, smooth gradients, professional digital artwork',
    'Photorealistic': 'ultra-realistic photograph, professional DSLR camera, perfect focus and exposure, natural lighting, photographic detail, high-resolution quality, true-to-life rendering',
    'Comic': 'comic book illustration style, bold ink outlines, dynamic action poses, vibrant flat colors, speech bubble ready, graphic novel quality, sequential art aesthetic'
  };
  
  return enhancements[styleName] || 'highly detailed, professional quality, expert craftsmanship';
}

export function buildMidjourneyWeightedPrompt(
  userPrompt: string,
  styleExtraction?: StyleExtraction
): string {
  let prompt = `${userPrompt} ::2 | professional photography ::1.5 | highly detailed ::1.5 | 8K resolution ::1 | sharp focus ::1 | cinematic lighting ::1.5 | artifact-free ::2`;

  if (styleExtraction && styleExtraction.colorPalette) {
    prompt += ` | ${styleExtraction.colorPalette} ::1.2 | ${styleExtraction.lighting} ::1.3`;
  }

  return prompt + ' --style raw --quality 2';
}

function getDimensionsFromRatio(aspectRatio: string): { width: number; height: number } {
  const ratios: Record<string, { width: number; height: number }> = {
    '16:9': { width: 1024, height: 576 },
    '4:3': { width: 1024, height: 768 },
    '1:1': { width: 1024, height: 1024 },
    '3:4': { width: 768, height: 1024 },
    '9:16': { width: 576, height: 1024 }
  };
  return ratios[aspectRatio] || ratios['1:1'];
}

async function generateSingleImage(
  apiKey: string,
  prompt: string,
  aspectRatio: string,
  attemptNumber = 0
): Promise<GenerationResult> {
  try {
    const response = await fetch(
      `${GEMINI_API}?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            responseModalities: ['IMAGE'],
            temperature: 1.0,
            maxOutputTokens: 8192,
            imageConfig: {
              aspectRatio: aspectRatio
            }
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      
      console.error('❌ API Request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        errorMessage
      });

      if (errorMessage.includes('SAFETY') || errorMessage.includes('blocked') || errorMessage.includes('content_filtered')) {
        return { success: false, error: 'Content blocked by safety filter' };
      }

      if (errorMessage.includes('quota') || errorMessage.includes('QUOTA') || 
          errorMessage.includes('limit') || errorMessage.includes('exceeded') ||
          errorMessage.includes('insufficient') || response.status === 429) {
        return { success: false, error: 'API_QUOTA_EXCEEDED' };
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('🔍 API Response structure:', {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length,
      firstCandidate: data.candidates?.[0] ? 'exists' : 'missing'
    });

    if (!data.candidates || data.candidates.length === 0) {
      console.error('❌ No candidates in response:', data);
      throw new Error('No image generated - API returned no candidates');
    }

    const parts = data.candidates[0].content?.parts;
    console.log('🔍 Content parts:', {
      hasParts: !!parts,
      partsLength: parts?.length,
      partTypes: parts?.map((p: any) => Object.keys(p))
    });
    
    if (!parts || parts.length === 0) {
      console.error('❌ No parts in response:', data.candidates[0]);
      throw new Error('No content parts in response');
    }

    // Find the image part (Gemini returns inlineData with base64)
    const imagePart = parts.find((part: any) => part.inlineData?.data);
    
    if (!imagePart || !imagePart.inlineData?.data) {
      console.error('❌ No image data found in parts:', parts);
      console.error('❌ Available part keys:', parts.map((p: any) => Object.keys(p)));
      throw new Error('No image data in response - check API response structure');
    }

    const mimeType = imagePart.inlineData.mimeType || 'image/png';
    const imageData = imagePart.inlineData.data;
    
    // Validate base64 data before creating URL
    console.log('✅ Image data received:', {
      mimeType,
      dataLength: imageData.length,
      dataPrefix: imageData.substring(0, 50),
      dataIsString: typeof imageData === 'string',
      hasInvalidChars: /[^A-Za-z0-9+/=]/.test(imageData)
    });
    
    // Check if data looks like valid base64
    if (typeof imageData !== 'string' || imageData.length === 0) {
      throw new Error('Image data is not a valid string');
    }
    
    // Test if it's valid base64 by checking pattern
    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Pattern.test(imageData)) {
      console.error('❌ Invalid base64 pattern detected');
      console.error('First 100 chars:', imageData.substring(0, 100));
      throw new Error('Image data contains invalid base64 characters');
    }
    
    const imageUrl = `data:${mimeType};base64,${imageData}`;
    console.log('✅ Image URL created, total length:', imageUrl.length);

    return { success: true, imageUrl };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (attemptNumber < RETRY_ATTEMPTS - 1 && !errorMessage.includes('SAFETY')) {
      await delay(RETRY_DELAYS[attemptNumber]);
      return generateSingleImage(apiKey, prompt, aspectRatio, attemptNumber + 1);
    }

    return { success: false, error: errorMessage };
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateBatchFromPrompt(
  apiKey: string,
  config: AIGenerateConfig,
  onImageGenerated: (index: number, result: GenerationResult) => void
): Promise<void> {
  let styleExtraction: StyleExtraction | undefined;

  if (config.referenceImages.length > 0) {
    styleExtraction = await extractStyleFromImages(apiKey, config.referenceImages);
  }

  const prompts: string[] = [];
  for (let i = 0; i < config.count; i++) {
    const prompt = config.style === 'Midjourney Weighted ✨'
      ? buildMidjourneyWeightedPrompt(config.prompt, styleExtraction)
      : buildOptimizedPrompt(config.prompt, config.style, styleExtraction);
    prompts.push(prompt);
  }

  const results: Promise<void>[] = [];
  let activeRequests = 0;
  let completedCount = 0;

  for (let i = 0; i < prompts.length; i++) {
    while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
      await delay(100);
    }

    activeRequests++;
    const index = i;
    const prompt = prompts[i];

    const task = generateSingleImage(apiKey, prompt, config.aspectRatio)
      .then(result => {
        onImageGenerated(index, result);
        activeRequests--;
        completedCount++;
      })
      .catch(error => {
        console.error(`Error generating image ${index}:`, error);
        onImageGenerated(index, { success: false, error: error.message });
        activeRequests--;
        completedCount++;
      });

    results.push(task);
  }

  await Promise.all(results);
}
