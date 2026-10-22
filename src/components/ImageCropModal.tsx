import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Check, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { optimizeImageWithBrowserCompression } from '../lib/imageOptimizer';

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropped: (resultDataUrl: string, mimeType: 'image/webp' | 'image/jpeg', fileName: string) => void;
  lang: 'ar' | 'en';
  fileName: string;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropped,
  lang,
  fileName,
}) => {
  const isAr = lang === 'ar';
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  if (!isOpen) return null;

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImgAsFile = async (
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number }
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const file = new File([blob], fileName || 'cropped_image.webp', {
          type: 'image/webp',
        });
        resolve(file);
      }, 'image/webp', 0.92);
    });
  };

  const handleCompleteCrop = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const croppedFile = await getCroppedImgAsFile(imageSrc, croppedAreaPixels);
      // Run browser-image-compression with max width 1920px as requested
      const optimized = await optimizeImageWithBrowserCompression(croppedFile, 1920);
      onCropped(optimized.dataUrl, optimized.mimeType, optimized.safeFileName);
      onClose();
    } catch (err) {
      console.error('Cropping error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-lg font-bold text-white">
              {isAr ? 'أداة قص وتعديل الصورة (Crop & Fine-Tune)' : 'Image Cropping & Tuning'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'حدد نسبة العرض إلى الارتفاع وقم بضبط الإطار بدقة قبل الحفظ'
                : 'Select aspect ratio and adjust crop frame before saving'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2">
            {isAr ? 'نسبة الأبعاد:' : 'Aspect Ratio:'}
          </span>
          <button
            onClick={() => setAspect(16 / 9)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              aspect === 16 / 9
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            16:9 {isAr ? '(عرضي)' : '(Widescreen)'}
          </button>
          <button
            onClick={() => setAspect(4 / 3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              aspect === 4 / 3
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            4:3 {isAr ? '(قياسي)' : '(Standard)'}
          </button>
          <button
            onClick={() => setAspect(1 / 1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              aspect === 1 / 1
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            1:1 {isAr ? '(مربع)' : '(Square)'}
          </button>
          <button
            onClick={() => setAspect(undefined)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              aspect === undefined
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isAr ? 'حر (Free)' : 'Free'}
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[400px] bg-black/90">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom Controls & Footer Actions */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ZoomOut className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-40 accent-blue-600 cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-mono">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              disabled={processing}
              onClick={handleCompleteCrop}
              className="px-6 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isAr ? 'جاري الضغط والقص...' : 'Compressing & Cropping...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'اعتماد وحفظ الصورة' : 'Apply & Save Image'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
