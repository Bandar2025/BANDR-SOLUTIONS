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
    maxSizeMB: 0.38, // 380 KB max binary guarantees Base64 string < 510,000 chars (well within 650k rule and 1MB Firestore limit)
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
      maxSizeMB: 0.38,
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
      if (onProgress) onProgress(100);
      resolve({
        dataUrl,
        mimeType,
        safeFileName: file.name
          ? file.name.replace(/[^a-zA-Z0-9_\-\.]+/g, '_')
          : `optimized_${Date.now()}.webp`,
      });
    };
    reader.onerror = () => reject(new Error('Error reading compressed image file.'));
    reader.readAsDataURL(compressedFile);
  });
}
