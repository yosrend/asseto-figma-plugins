export interface AIGenerateConfig {
  prompt: string;
  referenceImages: string[];
  style: string;
  aspectRatio: string;
  count: number;
  customStyle?: string;
  customWidth?: number;
  customHeight?: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  status: 'generating' | 'completed' | 'failed';
  error?: string;
  timestamp: number;
  selected?: boolean;
  prompt?: string; // User's original prompt for naming
  aspectRatio?: string; // e.g., "16:9", "1:1", "custom", etc.
  customWidth?: number; // Custom width in px
  customHeight?: number; // Custom height in px
}

export interface StylePreset {
  id: string;
  name: string;
  camera: string;
  lighting: string;
  aesthetic: string;
  promptStructure: string;
}

export interface AspectRatio {
  id: string;
  label: string;
  value: string;
  width: number;
  height: number;
}

export interface StyleExtraction {
  colorPalette: string;
  lighting: string;
  composition: string;
  mood: string;
}

export type MessageType =
  | 'generate-images'
  | 'insert-image'
  | 'image-generated'
  | 'generation-complete'
  | 'generation-error'
  | 'get-api-key'
  | 'save-api-key'
  | 'api-key-loaded'
  | 'close-plugin';

export interface PluginMessage {
  type: MessageType;
  data?: unknown;
}
