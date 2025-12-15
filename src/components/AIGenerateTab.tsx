import React, { useState } from 'react';
import { STYLE_PRESETS, ASPECT_RATIOS, MAX_REFERENCE_IMAGES, MIN_IMAGE_COUNT, MAX_IMAGE_COUNT, DEFAULT_IMAGE_COUNT } from '../constants';
import { AIGenerateConfig } from '../types';
import ReferenceImageModal from './ReferenceImageModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AIGenerateTabProps {
  onGenerate: (config: AIGenerateConfig) => void;
  isGenerating: boolean;
}

export default function AIGenerateTab({ onGenerate, isGenerating }: AIGenerateTabProps) {
  const [prompt, setPrompt] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0].name);
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [imageCount, setImageCount] = useState(DEFAULT_IMAGE_COUNT);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customStyle, setCustomStyle] = useState('');
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);

  const handleGenerate = () => {
    // Check if online
    if (!navigator.onLine) {
      alert('You are offline. This plugin requires an internet connection to generate images. Please check your connection and try again.');
      return;
    }

    if (isGenerating) return;

    if (!prompt.trim()) {
      alert('Please enter a prompt to generate images.');
      return;
    }

    // Validate custom style if selected
    if (selectedStyle === 'Custom Style' && !customStyle.trim()) {
      alert('Please enter a custom style description (e.g., "Anime Style", "Retro 80s", "8 Bit").');
      return;
    }

    // Validate custom dimensions if selected
    if (selectedRatio === 'custom') {
      if (!customWidth || !customHeight) {
        alert('Please enter both width and height for custom dimensions.');
        return;
      }
      if (customWidth < 256 || customWidth > 2048 || customHeight < 256 || customHeight > 2048) {
        alert('Custom dimensions must be between 256 and 2048 pixels.');
        return;
      }
    }

    const config: AIGenerateConfig = {
      prompt: prompt.trim(),
      referenceImages,
      style: selectedStyle,
      aspectRatio: selectedRatio,
      count: imageCount,
      customStyle: selectedStyle === 'Custom Style' ? customStyle : undefined,
      customWidth: selectedRatio === 'custom' ? customWidth : undefined,
      customHeight: selectedRatio === 'custom' ? customHeight : undefined
    };

    onGenerate(config);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Prompt Input */}
        <div>
          <Label htmlFor="prompt" className="text-xs">
            Describe Your Images
          </Label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the images you want to generate..."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none mt-1.5"
            disabled={isGenerating}
          />
        </div>

        {/* Reference Images */}
        <div>
          <Label className="text-xs">
            Reference Images (Optional)
          </Label>
          
          {referenceImages.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {referenceImages.map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <img src={img} alt={`Reference ${index + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-gray-200" />
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="w-full gap-2"
                disabled={isGenerating}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Reference Images ({referenceImages.length}/{MAX_REFERENCE_IMAGES})
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="w-full py-8 h-auto border-2 border-dashed hover:bg-accent flex flex-col items-center justify-center gap-2"
              disabled={isGenerating}
            >
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Click to Add Reference Image</span>
              <span className="text-xs text-muted-foreground">Upload, paste, or drag & drop images to guide AI style</span>
            </Button>
          )}
        </div>

      {/* Style Selection */}
      <div>
        <Label className="text-xs">
          Style Preset
        </Label>
        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
          {STYLE_PRESETS.map((style) => (
            <Button
              key={style.id}
              onClick={() => setSelectedStyle(style.name)}
              variant="outline"
              size="sm"
              className={`text-xs h-auto py-2 ${
                selectedStyle === style.name 
                  ? 'bg-black text-white hover:bg-black hover:text-white border-black' 
                  : 'bg-white text-black hover:bg-gray-100 border-gray-300'
              }`}
              disabled={isGenerating}
            >
              {style.name}
            </Button>
          ))}
        </div>
        
        {/* Custom Style Input */}
        {selectedStyle === 'Custom Style' && (
          <div className="mt-2">
            <Label htmlFor="customStyle" className="text-xs">
              Custom Style Description
            </Label>
            <input
              id="customStyle"
              type="text"
              value={customStyle}
              onChange={(e) => setCustomStyle(e.target.value)}
              placeholder="e.g., Anime Style, Retro Style, 8 Bit, Watercolor, Oil Painting..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-1">Examples: Anime Style, Retro 80s, 8 Bit Pixel Art, Watercolor Painting, Comic Book Style</p>
          </div>
        )}
      </div>

      {/* Aspect Ratio */}
      <div>
        <Label className="text-xs">
          Aspect Ratio
        </Label>
        <div className="flex gap-1.5 mt-1.5">
          {ASPECT_RATIOS.map((ratio) => (
            <Button
              key={ratio.id}
              onClick={() => setSelectedRatio(ratio.value)}
              variant="outline"
              size="sm"
              className={`flex-1 text-xs h-auto py-1.5 ${
                selectedRatio === ratio.value 
                  ? 'bg-black text-white hover:bg-black hover:text-white border-black' 
                  : 'bg-white text-black hover:bg-gray-100 border-gray-300'
              }`}
              disabled={isGenerating}
            >
              {ratio.label}
            </Button>
          ))}
        </div>
        
        {/* Custom Size Input */}
        {selectedRatio === 'custom' && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="customWidth" className="text-xs">
                Width (px)
              </Label>
              <input
                id="customWidth"
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1024)}
                min="256"
                max="2048"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                disabled={isGenerating}
              />
            </div>
            <div>
              <Label htmlFor="customHeight" className="text-xs">
                Height (px)
              </Label>
              <input
                id="customHeight"
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1024)}
                min="256"
                max="2048"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                disabled={isGenerating}
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Count Slider */}
      <div>
        <Label className="text-xs">
          Number of Images: <span className="font-bold">{imageCount}</span>
        </Label>
        <input
          type="range"
          min={MIN_IMAGE_COUNT}
          max={MAX_IMAGE_COUNT}
          value={imageCount}
          onChange={(e) => setImageCount(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          disabled={isGenerating}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{MIN_IMAGE_COUNT}</span>
          <span>{MAX_IMAGE_COUNT}</span>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full h-auto py-4 px-6 text-base font-semibold bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
        size="lg"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            GENERATING {imageCount} IMAGES...
          </span>
        ) : (
          `GENERATE ${imageCount} IMAGES`
        )}
      </Button>
      </div>

      {/* Reference Image Modal */}
      <ReferenceImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImagesSelected={(images) => {
          setReferenceImages(images);
          setIsModalOpen(false);
        }}
        currentImages={referenceImages}
        maxImages={MAX_REFERENCE_IMAGES}
      />
    </>
  );
}
