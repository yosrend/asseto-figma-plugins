figma.showUI(__html__, { 
  width: 420,   // Compact width - allows canvas visibility
  height: 720,  // Tall for vertical scrolling
  themeColors: true 
});

figma.ui.onmessage = async (msg: { type: string; data?: any; apiKey?: string }) => {
  if (msg.type === 'get-api-key') {
    const apiKey = await figma.clientStorage.getAsync('gemini_api_key');
    figma.ui.postMessage({ type: 'api-key-loaded', apiKey: apiKey || '' });
    return;
  }
  
  if (msg.type === 'save-api-key') {
    await figma.clientStorage.setAsync('gemini_api_key', msg.apiKey);
    return;
  }
  
  if (msg.type === 'close-plugin') {
    console.log('👋 ASSETO: Closing plugin');
    figma.closePlugin();
    return;
  }
  
  if (msg.type === 'insert-image') {
    console.log('🎯 ASSETO: INSERT-IMAGE message received');
    console.log('📦 ASSETO: Message type:', msg.type);
    console.log('📦 ASSETO: Message data exists:', !!msg.data);
    
    try {
      // Validate message structure
      if (!msg.data || typeof msg.data !== 'object') {
        throw new Error('Invalid message data structure');
      }

      const { imageBytes: imageBytesArray } = msg.data;
      
      if (!imageBytesArray || !Array.isArray(imageBytesArray)) {
        throw new Error('No valid imageBytes array provided in message data');
      }
      
      console.log('📦 ASSETO: Image bytes array length:', imageBytesArray.length);
      
      if (imageBytesArray.length === 0) {
        throw new Error('Image bytes array is empty');
      }
      
      // Convert regular array back to Uint8Array
      const imageBytes = new Uint8Array(imageBytesArray);
      console.log('✅ ASSETO: Uint8Array recreated, length:', imageBytes.length);
      console.log('✅ ASSETO: First 10 bytes:', Array.from(imageBytes.slice(0, 10)));
      
      // Validate image format by checking magic numbers
      const firstByte = imageBytes[0];
      const secondByte = imageBytes[1];
      const thirdByte = imageBytes[2];
      const fourthByte = imageBytes[3];
      
      const isPNG = firstByte === 137 && secondByte === 80 && thirdByte === 78 && fourthByte === 71;
      const isJPEG = firstByte === 255 && secondByte === 216 && thirdByte === 255;
      const isGIF = firstByte === 71 && secondByte === 73 && thirdByte === 70;
      
      console.log('🔍 ASSETO: Format check - PNG:', isPNG, 'JPEG:', isJPEG, 'GIF:', isGIF);
      console.log('🔍 ASSETO: First 4 bytes:', [firstByte, secondByte, thirdByte, fourthByte]);
      
      if (!isPNG && !isJPEG && !isGIF) {
        throw new Error(`Unsupported image format. First bytes: ${firstByte}, ${secondByte}, ${thirdByte}, ${fourthByte}`);
      }
      
      // Check size constraints (max 4096x4096)
      if (imageBytes.length > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('Image file too large (>50MB)');
      }
      
      // Create image object in Figma - this validates the image data
      let image: Image;
      try {
        image = figma.createImage(imageBytes);
        console.log('✅ ASSETO: createImage() successful, hash:', image.hash);
      } catch (createError) {
        console.error('❌ ASSETO: createImage() failed:', createError);
        throw new Error('Failed to create image from data - ' + (createError instanceof Error ? createError.message : 'Unknown error'));
      }
      
      // Verify image hash
      if (!image || !image.hash) {
        throw new Error('Image object created but hash is missing');
      }
      
      // CRITICAL FIX: Get image size to force Figma to fully decode the image
      // This ensures image data is properly processed and embedded in document
      let imageWidth = 1024;
      let imageHeight = 1024;
      try {
        const size = await image.getSizeAsync();
        if (!size || size.width === 0 || size.height === 0) {
          throw new Error('Image size invalid - image may be corrupted');
        }
        imageWidth = size.width;
        imageHeight = size.height;
        console.log('✅ ASSETO: Image decoded successfully, actual size:', imageWidth, 'x', imageHeight);
      } catch (sizeError) {
        console.error('❌ ASSETO: Failed to get image size:', sizeError);
        throw new Error('Failed to decode image - ' + (sizeError instanceof Error ? sizeError.message : 'Unknown error'));
      }
      
      // Get metadata from message
      const { batchIndex, batchTotal, prompt, aspectRatio, customWidth, customHeight } = msg.data;
      const isBatchInsert = typeof batchIndex === 'number' && typeof batchTotal === 'number';
      
      // Generate clean name from prompt
      const cleanName = (prompt || 'Untitled')
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .substring(0, 50); // Limit length
      
      const imageName = isBatchInsert 
        ? `${cleanName} ${String(batchIndex + 1).padStart(2, '0')}`
        : cleanName;
      
      // Calculate dimensions based on aspect ratio or custom size
      const BASE_SIZE = 1024; // Base width for 1:1
      let width = BASE_SIZE;
      let height = BASE_SIZE;
      
      // Check if custom dimensions are provided
      if (customWidth && customHeight) {
        width = customWidth;
        height = customHeight;
        console.log(`📐 ASSETO: Custom size: ${width}x${height}`);
      } else if (aspectRatio && aspectRatio !== 'custom') {
        const [w, h] = aspectRatio.split(':').map(Number);
        if (w && h) {
          // Calculate dimensions maintaining aspect ratio
          if (w > h) {
            // Landscape (e.g., 16:9)
            width = BASE_SIZE;
            height = Math.round(BASE_SIZE * (h / w));
          } else if (h > w) {
            // Portrait (e.g., 9:16)
            height = BASE_SIZE;
            width = Math.round(BASE_SIZE * (w / h));
          }
          // else: square (1:1) - already set
        }
        console.log(`📐 ASSETO: Aspect ratio ${aspectRatio}: ${width}x${height}`);
      } else {
        console.log(`📐 ASSETO: Default size: ${width}x${height}`);
      }
      
      // Create rectangle node to hold the image
      const rect = figma.createRectangle();
      rect.name = imageName;
      
      // Resize to match aspect ratio
      const SPACING = 50; // Gap between images in batch
      rect.resize(width, height);
      console.log(`✅ ASSETO: Rectangle "${imageName}" created, size: ${width}x${height}`);
      
      // Set image as fill - CRITICAL: Must be done AFTER resize
      try {
        rect.fills = [{
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageHash: image.hash
        }];
        console.log('✅ ASSETO: Image fill applied to rectangle');
      } catch (fillError) {
        console.error('❌ ASSETO: Failed to set fills:', fillError);
        throw new Error('Failed to apply image fill - ' + (fillError instanceof Error ? fillError.message : 'Unknown error'));
      }
      
      // CRITICAL FIX: Force Figma to render and cache the image by exporting it
      // This ensures image is properly embedded in document for cross-project copy
      try {
        await rect.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.1 } });
        console.log('✅ ASSETO: Image rendering forced via export - embedded in document');
      } catch (exportError) {
        // Export failure is not critical, just log it
        console.warn('⚠️ ASSETO: Export verification failed (non-critical):', exportError);
      }
      
      // Position based on whether it's batch or single
      const viewport = figma.viewport.center;
      
      if (isBatchInsert) {
        // Horizontal layout: 10 images per row
        const COLUMNS = 10;
        const col = batchIndex % COLUMNS;
        const row = Math.floor(batchIndex / COLUMNS);
        
        // Start from left side of viewport, horizontal arrangement
        rect.x = Math.round(viewport.x - (COLUMNS * (width + SPACING)) / 2 + col * (width + SPACING));
        rect.y = Math.round(viewport.y - height / 2 + row * (height + SPACING));
        
        console.log(`📍 ASSETO: Batch position (${batchIndex + 1}/${batchTotal}) - Row ${row}, Col ${col}:`, rect.x, rect.y);
        
        // Add to current page
        figma.currentPage.appendChild(rect);
        console.log('✅ ASSETO: Added to page');
        
        // For batch: add to selection (multi-select)
        const currentSelection = figma.currentPage.selection;
        figma.currentPage.selection = [...currentSelection, rect];
        console.log(`✅ ASSETO: Added to selection (${batchIndex + 1}/${batchTotal})`);
        
        // Zoom to all at the end
        if (batchIndex === batchTotal - 1) {
          figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
          figma.notify(`✅ Inserted ${batchTotal} images to canvas!`);
          console.log('🎉 ASSETO: Batch insert completed successfully');
        }
      } else {
        // Single insert: center on canvas
        rect.x = Math.round(viewport.x - width / 2);
        rect.y = Math.round(viewport.y - height / 2);
        console.log('📍 ASSETO: Single insert position:', rect.x, rect.y);
        
        // Add to current page
        figma.currentPage.appendChild(rect);
        console.log('✅ ASSETO: Added to page');
        
        // Select and zoom immediately
        figma.currentPage.selection = [rect];
        figma.viewport.scrollAndZoomIntoView([rect]);
        figma.notify('✅ Image inserted successfully!');
        console.log('🎉 ASSETO: Insert completed successfully');
      }
      
    } catch (error) {
      console.error('❌ ASSETO: Insert error:', error);
      console.error('❌ ASSETO: Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ ASSETO: Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      const errorMsg = error instanceof Error ? error.message : String(error);
      figma.notify('❌ Failed: ' + errorMsg, { error: true });
    }
  }
};
