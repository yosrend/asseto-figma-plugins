import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ImageViewerModal from './ImageViewerModal';

interface GalleryProps {
  images: GeneratedImage[];
  onInsertToCanvas: (image: GeneratedImage) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkInsert: () => void;
}

export default function Gallery({ 
  images, 
  onInsertToCanvas, 
  onToggleSelect, 
  onSelectAll, 
  onDeselectAll,
  onBulkInsert 
}: GalleryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState<GeneratedImage | null>(null);
  
  const completedImages = images.filter(img => img.status === 'completed');
  const selectedCount = completedImages.filter(img => img.selected).length;
  const allSelected = completedImages.length > 0 && selectedCount === completedImages.length;

  const handleCopy = async (imageUrl: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening viewer
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy image:', error);
      alert('Failed to copy image. Please try again.');
    }
  };

  const handleImageClick = (image: GeneratedImage) => {
    if (image.status === 'completed' && image.url) {
      setViewerImage(image);
      setViewerOpen(true);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${index + 1}.png`;
    link.click();
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No images generated yet</p>
          <p className="text-xs mt-1">Start by creating your first AI generation above</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800">AI Generated Images</h3>
            <span className="text-sm text-gray-500">({images.length})</span>
          </div>
          
          {completedImages.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={allSelected ? onDeselectAll : onSelectAll}
                variant="outline"
                size="sm"
                className="text-sm font-medium bg-white text-black hover:bg-gray-100 border-gray-300"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          )}
        </div>

        {selectedCount > 0 && (
          <Card className="mb-4">
            <CardContent className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCount} image{selectedCount > 1 ? 's' : ''} selected
              </span>
              <Button
                onClick={onBulkInsert}
                size="sm"
                className="gap-2 bg-black text-white hover:bg-gray-800"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add All to Design
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              {image.status === 'generating' && (
                <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}

              {image.status === 'failed' && (
                <div className="w-full aspect-video bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-xs text-red-600">{image.error || 'Generation failed'}</p>
                  </div>
                </div>
              )}

              {image.status === 'completed' && image.url && (
                <>
                  {/* Checkbox overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={image.selected || false}
                      onChange={() => onToggleSelect(image.id)}
                      className="w-4 h-4 cursor-pointer accent-indigo-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <img
                    src={image.url}
                    alt={`Generated ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(image)}
                    title="Click to view full size"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 p-3">
                    <button
                      onClick={() => onInsertToCanvas(image)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-3 rounded-lg transition-all shadow-lg text-xs flex items-center justify-center gap-1"
                      title="Add to Figma Canvas"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Project
                    </button>
                    <div className="flex gap-1 w-full">
                      <button
                        onClick={(e) => handleCopy(image.url, image.id, e)}
                        className="flex-1 bg-white text-gray-800 p-1.5 rounded hover:bg-gray-100 transition-colors"
                        title={copiedId === image.id ? "Copied!" : "Copy to clipboard"}
                      >
                        {copiedId === image.id ? (
                          <svg className="w-3 h-3 mx-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 2 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(image.url, index)}
                        className="flex-1 bg-white text-gray-800 p-1.5 rounded hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <svg className="w-3 h-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewerImage && (
        <ImageViewerModal
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setViewerImage(null);
          }}
          imageUrl={viewerImage.url}
          imageName={viewerImage.prompt || `Generated Image ${viewerImage.id}`}
        />
      )}
    </>
  );
}
