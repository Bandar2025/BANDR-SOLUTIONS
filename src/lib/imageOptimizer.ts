import imageCompression from 'browser-image-compression';

export async function optimizeImageWithBrowserCompression(
  file: File,
  maxWidth = 1920,
  onProgress?: (pct: number) => void
): Promise<{
  dataUrl: string;
  mimeType: 'image/webp' | 'image/jpeg';
  safeFileName: string;
}> {
  if (onProgress) onProgress(15);

  const options = {
    maxSizeMB: 0.32, // ~320 KB max binary guarantees Base64 string < 440,000 chars
    maxWidthOrHeight: maxWidth,
    useWebWorker: true,
    fileType: 'image/webp',
    onProgress: (p: number) => {
      if (onProgress) {
        onProgress(Math.round(15 + p * 0.75));
      }
    },
  };

  let compressedFile: File;
  try {
    compressedFile = await imageCompression(file, options);
  } catch {
    // Fallback to JPEG if WebP compression is unsupported
    const fallbackOptions = {
      maxSizeMB: 0.32,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };
    compressedFile = await imageCompression(file, fallbackOptions);
  }

  if (onProgress) onProgress(90);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed to read compressed image data URL.'));
        return;
      }
      const mimeType =
        compressedFile.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
      const safeFileName = file.name
        ? file.name.replace(/[^a-zA-Z0-9_\-\.]+/g, '_').slice(0, 160)
        : `optimized_${Date.now()}.webp`;

      if (dataUrl.length <= 680000) {
        if (onProgress) onProgress(100);
        resolve({
          dataUrl,
          mimeType,
          safeFileName,
        });
        return;
      }

      // Safety fallback if browser-image-compression returned >680k base64 string
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 1280 / Math.max(img.width, img.height, 1));
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const fallbackUrl = canvas.toDataURL('image/webp', 0.75);
          if (onProgress) onProgress(100);
          resolve({
            dataUrl: fallbackUrl,
            mimeType: 'image/webp',
            safeFileName,
          });
        } else {
          if (onProgress) onProgress(100);
          resolve({ dataUrl, mimeType, safeFileName });
        }
      };
      img.onerror = () => {
        if (onProgress) onProgress(100);
        resolve({ dataUrl, mimeType, safeFileName });
      };
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Error reading compressed image file.'));
    reader.readAsDataURL(compressedFile);
  });
}
