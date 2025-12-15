import React, { useState, useEffect } from 'react';
import APIKeySetup from './components/APIKeySetup';
import UpdateAPIKeyModal from './components/UpdateAPIKeyModal';
import AIGenerateTab from './components/AIGenerateTab';
import Gallery from './components/Gallery';
import { AIGenerateConfig, GeneratedImage } from './types';
import { generateBatchFromPrompt } from './services/nanoBananaService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoadingAPIKey, setIsLoadingAPIKey] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [showAPIModal, setShowAPIModal] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    console.log('ASSETO App: Mounted');
    
    // Force light theme always
    document.documentElement.classList.remove('dark');
    
    // Load API key from Figma storage
    parent.postMessage(
      { pluginMessage: { type: 'get-api-key' } },
      '*'
    );

    // Set timeout to stop loading after 2 seconds (in case no response)
    const timeout = setTimeout(() => {
      setIsLoadingAPIKey(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Listen for API key from plugin
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg?.type === 'api-key-loaded') {
        console.log('ASSETO App: API key loaded from storage');
        if (msg.apiKey) {
          setApiKey(msg.apiKey);
        }
        setIsLoadingAPIKey(false);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleAPIKeySet = (key: string) => {
    console.log('ASSETO App: Setting API key');
    
    // Validate API key format (basic check)
    if (!key || key.length < 20) {
      alert('Invalid API key. Please check and try again.');
      return;
    }

    setApiKey(key);
    setIsLoadingAPIKey(false);
    
    // Save to Figma storage
    parent.postMessage(
      { pluginMessage: { type: 'save-api-key', apiKey: key } },
      '*'
    );
  };

  const handleAPIKeyUpdate = (key: string) => {
    handleAPIKeySet(key);
    setShowAPIModal(false);
    setApiError('');
  };

  const handleGenerate = async (config: AIGenerateConfig) => {
    setIsGenerating(true);
    
    const newImages: GeneratedImage[] = Array.from({ length: config.count }, (_, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: '',
      status: 'generating' as const,
      timestamp: Date.now(),
      prompt: config.prompt,
      aspectRatio: config.aspectRatio
    }));

    setImages(newImages);

    try {
      let hasQuotaError = false;
      
      await generateBatchFromPrompt(apiKey, config, (index, result) => {
        setImages(prevImages => {
          const updated = [...prevImages];
          if (result.success && result.imageUrl) {
            updated[index] = {
              ...updated[index],
              url: result.imageUrl,
              status: 'completed',
              selected: false,
              prompt: config.prompt,
              aspectRatio: config.aspectRatio,
              customWidth: config.customWidth,
              customHeight: config.customHeight
            };
          } else {
            // Check for quota error
            if (result.error === 'API_QUOTA_EXCEEDED' && !hasQuotaError) {
              hasQuotaError = true;
              setApiError('Your Google AI API quota has been exceeded. Please update your API key.');
              setShowAPIModal(true);
            }
            
            updated[index] = {
              ...updated[index],
              status: 'failed',
              error: result.error === 'API_QUOTA_EXCEEDED' ? 'Quota exceeded' : (result.error || 'Generation failed')
            };
          }
          return updated;
        });
      });
    } catch (error) {
      console.error('Batch generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSelect = (id: string) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  const handleSelectAll = () => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.status === 'completed' ? { ...img, selected: true } : img
      )
    );
  };

  const handleDeselectAll = () => {
    setImages(prevImages =>
      prevImages.map(img => ({ ...img, selected: false }))
    );
  };

  const handleBulkInsert = () => {
    const selectedImages = images.filter(img => img.selected && img.url);
    
    if (selectedImages.length === 0) {
      alert('No images selected. Please select at least one image.');
      return;
    }
    
    console.log(`🚀 ASSETO UI: Bulk insert starting - ${selectedImages.length} images`);
    console.log(`📝 ASSETO UI: Prompt: "${selectedImages[0]?.prompt || 'Untitled'}"`);
    console.log(`📐 ASSETO UI: Aspect Ratio: ${selectedImages[0]?.aspectRatio || '1:1'}`);
    
    // Process each selected image
    selectedImages.forEach((img, index) => {
      try {
        console.log(`📸 ASSETO UI: Processing image ${index + 1}/${selectedImages.length}`);
        
        // Use same decode logic as single insert
        if (!img.url.startsWith('data:image/') || !img.url.includes('base64,')) {
          console.error(`❌ ASSETO UI: Invalid format for image ${index + 1}`);
          return;
        }
        
        const parts = img.url.split('base64,');
        if (parts.length !== 2) {
          console.error(`❌ ASSETO UI: Invalid base64 format for image ${index + 1}`);
          return;
        }
        
        const base64Data = parts[1];
        const binaryString = atob(base64Data);
        
        // Convert to Uint8Array
        const imageBytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          imageBytes[i] = binaryString.charCodeAt(i);
        }
        
        // Validate format
        const isPNG = imageBytes[0] === 137 && imageBytes[1] === 80;
        const isJPEG = imageBytes[0] === 255 && imageBytes[1] === 216;
        const isGIF = imageBytes[0] === 71 && imageBytes[1] === 73;
        
        if (!isPNG && !isJPEG && !isGIF) {
          console.error(`❌ ASSETO UI: Unsupported format for image ${index + 1}`);
          return;
        }
        
        // Send to plugin with small delay to avoid overwhelming
        setTimeout(() => {
          parent.postMessage(
            {
              pluginMessage: {
                type: 'insert-image',
                data: {
                  imageBytes: Array.from(imageBytes),
                  batchIndex: index,
                  batchTotal: selectedImages.length,
                  prompt: img.prompt || 'Untitled',
                  aspectRatio: img.aspectRatio || '1:1',
                  customWidth: img.customWidth,
                  customHeight: img.customHeight
                }
              }
            },
            '*'
          );
          console.log(`✅ ASSETO UI: Sent image ${index + 1}/${selectedImages.length}`);
        }, index * 100); // 100ms delay between each to avoid race conditions
        
      } catch (error) {
        console.error(`❌ ASSETO UI: Failed to process image ${index + 1}:`, error);
      }
    });
    
    console.log(`✅ ASSETO UI: Bulk insert queued for ${selectedImages.length} images`);
  };

  const handleInsertToCanvas = (image: GeneratedImage) => {
    console.log('🚀 ASSETO UI: Starting insert process');
    console.log('📸 ASSETO UI: Image URL length:', image.url.length);
    console.log('📝 ASSETO UI: Prompt:', image.prompt || 'Untitled');
    console.log('📐 ASSETO UI: Aspect Ratio:', image.aspectRatio || '1:1');
    
    try {
      const imageUrl = image.url;
      
      // Decode base64 in UI (browser environment) - more reliable
      if (!imageUrl.startsWith('data:image/')) {
        throw new Error('Invalid image URL format');
      }
      
      if (!imageUrl.includes('base64,')) {
        throw new Error('Not a base64 image');
      }
      
      const parts = imageUrl.split('base64,');
      if (parts.length !== 2) {
        throw new Error('Invalid base64 format');
      }
      
      const base64Data = parts[1];
      console.log('🔍 ASSETO UI: Base64 data length:', base64Data.length);
      
      // Decode base64 to binary string using browser's atob (more reliable than plugin sandbox)
      let binaryString: string;
      try {
        binaryString = atob(base64Data);
        console.log('✅ ASSETO UI: Base64 decoded, binary length:', binaryString.length);
      } catch (decodeError) {
        console.error('❌ ASSETO UI: atob failed:', decodeError);
        throw new Error('Failed to decode base64 - data may be corrupted');
      }
      
      // Convert to Uint8Array
      const imageBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        imageBytes[i] = binaryString.charCodeAt(i);
      }
      console.log('✅ ASSETO UI: Uint8Array created, length:', imageBytes.length);
      console.log('✅ ASSETO UI: First 10 bytes:', Array.from(imageBytes.slice(0, 10)));
      
      // Verify format by checking magic numbers
      const isPNG = imageBytes[0] === 137 && imageBytes[1] === 80 && imageBytes[2] === 78 && imageBytes[3] === 71;
      const isJPEG = imageBytes[0] === 255 && imageBytes[1] === 216 && imageBytes[2] === 255;
      const isGIF = imageBytes[0] === 71 && imageBytes[1] === 73 && imageBytes[2] === 70;
      
      console.log('🔍 ASSETO UI: Format check - PNG:', isPNG, 'JPEG:', isJPEG, 'GIF:', isGIF);
      
      if (!isPNG && !isJPEG && !isGIF) {
        throw new Error('Unsupported image format');
      }
      
      // Send Uint8Array to plugin (not base64 string!)
      parent.postMessage(
        {
          pluginMessage: {
            type: 'insert-image',
            data: {
              imageBytes: Array.from(imageBytes), // Convert to regular array for postMessage
              prompt: image.prompt || 'Untitled',
              aspectRatio: image.aspectRatio || '1:1',
              customWidth: image.customWidth,
              customHeight: image.customHeight
            }
          }
        },
        '*'
      );
      
      console.log('✅ ASSETO UI: Image bytes sent to plugin');
      
    } catch (error) {
      console.error('❌ ASSETO UI: Insert preparation failed:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert('Failed to prepare image: ' + errorMsg);
    }
  };

  // Show loading while checking for API key
  if (isLoadingAPIKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Show API key setup if no key exists
  if (!apiKey) {
    return <APIKeySetup onAPIKeySet={handleAPIKeySet} />;
  }

  const handleClosePlugin = () => {
    parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Main Content - Single Column */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {/* Generation Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Generate Images</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <AIGenerateTab onGenerate={handleGenerate} isGenerating={isGenerating} />
            </CardContent>
          </Card>

          {/* Gallery */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Gallery</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Gallery 
                images={images} 
                onInsertToCanvas={handleInsertToCanvas}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onBulkInsert={handleBulkInsert}
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-4 text-xs text-gray-500 space-y-2 border-t border-gray-200 bg-white">
            <div>
              <a 
                href="mailto:support.asseto@gmail.com" 
                className="text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Support
              </a>
              <span className="mx-2 text-gray-300">•</span>
              <a 
                href="https://github.com/yoseprendi/asseto-ai-generate" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Help
              </a>
              <span className="mx-2 text-gray-300">•</span>
              <a 
                href="https://github.com/yoseprendi/asseto-ai-generate/blob/main/PRIVACY_POLICY.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Privacy
              </a>
            </div>
            <div className="text-gray-400">
              ASSETO AI Generate v2.8.0 • Created by Yosep Rendi
            </div>
          </div>
        </div>
      </div>

      {/* API Key Update Modal */}
      <UpdateAPIKeyModal
        isOpen={showAPIModal}
        onClose={() => {
          setShowAPIModal(false);
          setApiError('');
        }}
        onUpdate={handleAPIKeyUpdate}
        errorMessage={apiError}
      />
    </div>
  );
}
