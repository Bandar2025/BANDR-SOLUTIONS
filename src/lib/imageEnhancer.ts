/**
 * Image Enhancer & Compression Utility
 * Provides manual enhancement tools (Clarity, Sharpening, Contrast Boost, 2x Resolution Upscale)
 * and adjustable compression controls.
 */

export interface EnhancementOptions {
  sharpen: boolean;       // Apply unsharp mask sharpening filter
  sharpenAmount: number;  // 0.0 to 1.0
  contrastBoost: number;  // 1.0 to 1.3
  upscale2x: boolean;     // 2x resolution upscaling with high-quality bicubic smoothing
}

export const DEFAULT_ENHANCEMENT_OPTIONS: EnhancementOptions = {
  sharpen: false,
  sharpenAmount: 0.3,
  contrastBoost: 1.05,
  upscale2x: false,
};

/**
 * Applies manual enhancement (sharpening, contrast, 2x upscale) and compression to an image source.
 */
export async function enhanceAndCompressImage(
  imageSrc: string,
  cropPixel: { x: number; y: number; width: number; height: number },
  enhancements: EnhancementOptions,
  compressionQuality: number = 0.90, // 0.5 to 1.0
  fileName: string = 'enhanced_image.webp'
): Promise<{ dataUrl: string; mimeType: 'image/webp' | 'image/jpeg'; file: File; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Only set crossOrigin for remote URLs to avoid issues with data/blob URLs
    if (imageSrc && !imageSrc.startsWith('data:') && !imageSrc.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }

        const sw = Math.max(1, cropPixel.width);
        const sh = Math.max(1, cropPixel.height);
        const requestedScale = enhancements.upscale2x ? 2 : 1;
        const maxAllowedDim = 1920;
        const rawW = sw * requestedScale;
        const rawH = sh * requestedScale;
        const clampRatio =
          Math.max(rawW, rawH) > maxAllowedDim
            ? maxAllowedDim / Math.max(rawW, rawH)
            : 1;

        canvas.width = Math.max(1, Math.round(rawW * clampRatio));
        canvas.height = Math.max(1, Math.round(rawH * clampRatio));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw cropped region (with upscale/clamp applied)
        ctx.drawImage(
          img,
          cropPixel.x,
          cropPixel.y,
          cropPixel.width,
          cropPixel.height,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Apply contrast boost if specified and canvas is not tainted
        if (enhancements.contrastBoost > 1.0) {
          try {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            const factor = (259 * (enhancements.contrastBoost * 100 - 100)) / (100 * (259 - (enhancements.contrastBoost * 100 - 100)));
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
              data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
              data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
            }
            ctx.putImageData(imgData, 0, 0);
          } catch {
            // Ignore canvas taint or pixel manipulation errors and continue
          }
        }

        // Apply Unsharp Mask Sharpening Filter if requested
        if (enhancements.sharpen && enhancements.sharpenAmount > 0) {
          try {
            applySharpenFilter(ctx, canvas.width, canvas.height, enhancements.sharpenAmount);
          } catch {
            // Ignore sharpening errors and continue
          }
        }

        const mimeType: 'image/webp' | 'image/jpeg' = 'image/webp';
        const MAX_SAFE_DATA_URL_LENGTH = 680000;
        let currentQuality = Math.min(0.92, Math.max(0.4, compressionQuality));
        let dataUrl = canvas.toDataURL(mimeType, currentQuality);

        // Step down quality if base64 string is still too large for Firestore document limits
        while (dataUrl.length > MAX_SAFE_DATA_URL_LENGTH && currentQuality > 0.45) {
          currentQuality = Math.max(0.42, currentQuality - 0.12);
          dataUrl = canvas.toDataURL(mimeType, currentQuality);
        }

        // If still above limit on ultra-detailed images, scale down dimensions to 1280px max
        if (dataUrl.length > MAX_SAFE_DATA_URL_LENGTH) {
          const downscaleRatio = 1280 / Math.max(canvas.width, canvas.height, 1280);
          if (downscaleRatio < 1) {
            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = Math.max(1, Math.round(canvas.width * downscaleRatio));
            smallCanvas.height = Math.max(1, Math.round(canvas.height * downscaleRatio));
            const sCtx = smallCanvas.getContext('2d');
            if (sCtx) {
              sCtx.imageSmoothingEnabled = true;
              sCtx.imageSmoothingQuality = 'high';
              sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
              dataUrl = smallCanvas.toDataURL(mimeType, 0.78);
            }
          }
        }

        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const safeName = (fileName || 'enhanced_image.webp').replace(/[^a-zA-Z0-9_\-\.]+/g, '_');
            const file = new File([blob], safeName, { type: mimeType });
            resolve({
              dataUrl,
              mimeType,
              file,
              width: canvas.width,
              height: canvas.height,
            });
          })
          .catch((err) => reject(new Error(err?.message || 'Blob conversion error during compression')));
      } catch (err: any) {
        reject(new Error(err?.message || 'Canvas processing error during enhancement'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for cropping and enhancement. Please check the image format or upload another file.'));
    };

    img.src = imageSrc;
  });
}

/**
 * Simple convolution-based unsharp mask sharpening filter for clarity and resolution enhancement
 */
function applySharpenField(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number
) {
  const weights = [
    0, -1, 0,
    -1, 4 + 1 / amount, -1,
    0, -1, 0
  ];
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  const src = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sy = y;
      const sx = x;
      const dstOff = (y * width + x) * 4;
      let r = 0, g = 0, b = 0;

      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = Math.min(height - 1, Math.max(0, sy + cy - halfSide));
          const scx = Math.min(width - 1, Math.max(0, sx + cx - halfSide));
          const srcOff = (scy * width + scx) * 4;
          const wt = weights[cy * side + cx];
          r += src[srcOff] * wt;
          g += src[srcOff + 1] * wt;
          b += src[srcOff + 2] * wt;
        }
      }

      data[dstOff] = Math.min(255, Math.max(0, r));
      data[dstOff + 1] = Math.min(255, Math.max(0, g));
      data[dstOff + 2] = Math.min(255, Math.max(0, b));
    }
  }
}

function applySharpenFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    applySharpenField(imgData.data, width, height, amount);
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Fallback if CORS or taint happens
  }
}
