import { StylePreset, AspectRatio } from '../types';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'no-style',
    name: 'No Style',
    camera: 'Auto',
    lighting: 'Auto',
    aesthetic: 'Natural',
    promptStructure: '{prompt}, high quality, detailed, professional, clean image without any text or letters'
  },
  {
    id: 'realistic-photo',
    name: 'Realistic',
    camera: '85mm f/4',
    lighting: '3-point 5000K',
    aesthetic: 'Natural, documentary',
    promptStructure: 'Professional photography of {prompt}, shot with 85mm lens at f/4, natural 3-point lighting at 5000K, documentary style, sharp focus, realistic details, high quality, no text, no letters, no words, clean image'
  },
  {
    id: 'professional-photoshoot',
    name: 'Model Pro',
    camera: '70-200mm f/2.8',
    lighting: 'Studio beauty dish',
    aesthetic: 'Magazine quality',
    promptStructure: 'Professional magazine photoshoot of {prompt}, shot with 70-200mm f/2.8, studio beauty dish lighting, editorial quality, fashion photography, bokeh background, high-end production, no text, no letters, clean image'
  },
  {
    id: '3d-rendering',
    name: '3D Rendering',
    camera: '50mm f/8',
    lighting: 'HDRI environment',
    aesthetic: 'Clean geometry',
    promptStructure: '3D rendered scene of {prompt}, 50mm focal length f/8, HDRI environment lighting, clean geometric forms, ray-traced, octane render, professional 3D visualization, 4K resolution, no text, no letters, clean render'
  },
  {
    id: 'minimalist-illustration',
    name: 'Illustration',
    camera: '50mm f/4',
    lighting: 'High-key shadow-free',
    aesthetic: 'Geometric precision',
    promptStructure: 'Minimalist illustration of {prompt}, 50mm perspective f/4, high-key lighting without shadows, geometric precision, clean lines, flat colors, modern design, vector-style aesthetic, no text, no letters, no words'
  },
  {
    id: 'abstract-modern',
    name: 'Abstract Modern',
    camera: '35mm f/5.6',
    lighting: 'Dynamic colored',
    aesthetic: 'Gallery quality',
    promptStructure: 'Abstract modern art of {prompt}, 35mm f/5.6, dynamic colored lighting, contemporary gallery aesthetic, artistic composition, bold colors, creative interpretation, fine art quality, no text, no letters, clean artwork'
  },
  {
    id: 'isometric-3d',
    name: 'Isometric 3D',
    camera: 'Isometric 30°',
    lighting: 'Top-down even',
    aesthetic: 'Infographic clarity',
    promptStructure: 'Isometric 3D illustration of {prompt}, 30-degree isometric angle, top-down even lighting, infographic style, clean and clear, game asset quality, technical illustration, precise geometry, no text, no labels, clean image'
  },
  {
    id: 'claymorphism',
    name: 'Claymorphism',
    camera: '50mm macro',
    lighting: 'Soft diffused',
    aesthetic: 'Playful matte',
    promptStructure: 'Claymorphism style of {prompt}, 50mm macro lens, soft diffused lighting, clay material texture, playful matte finish, 3D rendered, pastel colors, rounded shapes, tactile appearance, no text, no letters, clean render'
  },
  {
    id: 'futuristic-neon',
    name: 'Futuristic',
    camera: '35mm f/2.8',
    lighting: 'Cyberpunk neon',
    aesthetic: 'Sci-fi drama',
    promptStructure: 'Futuristic cyberpunk scene of {prompt}, 35mm f/2.8, neon lighting, vibrant colors, sci-fi atmosphere, dramatic mood, high contrast, cinematic composition, blade runner aesthetic, no text, no letters, no signs, clean image'
  },
  {
    id: 'midjourney-weighted',
    name: 'Midjourney ✨',
    camera: 'Variable f/2.8-f/8',
    lighting: 'Multi-concept weighted',
    aesthetic: 'Artifact-free precision',
    promptStructure: '{prompt} ::2 | professional photography ::1.5 | highly detailed ::1.5 | 8K resolution ::1 | sharp focus ::1 | cinematic lighting ::1.5 | no text ::2 | no letters ::2 | no words ::2 | clean image ::2 | artifact-free ::2 --style raw --quality 2'
  },
  {
    id: 'custom',
    name: 'Custom Style',
    camera: 'User-defined',
    lighting: 'User-defined',
    aesthetic: 'User-defined',
    promptStructure: '{prompt} in {customStyle}, high quality, professional, detailed, no text, no letters, no words, clean image'
  }
];

export const ASPECT_RATIOS: AspectRatio[] = [
  {
    id: '16:9',
    label: '16:9',
    value: '16:9',
    width: 1920,
    height: 1080
  },
  {
    id: '4:3',
    label: '4:3',
    value: '4:3',
    width: 1600,
    height: 1200
  },
  {
    id: '1:1',
    label: '1:1',
    value: '1:1',
    width: 1024,
    height: 1024
  },
  {
    id: '3:4',
    label: '3:4',
    value: '3:4',
    width: 1200,
    height: 1600
  },
  {
    id: '9:16',
    label: '9:16',
    value: '9:16',
    width: 1080,
    height: 1920
  },
  {
    id: 'custom',
    label: 'Custom',
    value: 'custom',
    width: 1024,
    height: 1024
  }
];

export const MAX_REFERENCE_IMAGES = 4;
export const MIN_IMAGE_COUNT = 1;
export const MAX_IMAGE_COUNT = 20;
export const DEFAULT_IMAGE_COUNT = 10;
export const MAX_CONCURRENT_REQUESTS = 3;
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAYS = [2000, 4000, 8000];
