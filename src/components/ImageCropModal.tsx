import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Check, X, ZoomIn, ZoomOut, Sliders, Sparkles, ShieldCheck } from 'lucide-react';
import { enhanceAndCompressImage, EnhancementOptions, DEFAULT_ENHANCEMENT_OPTIONS } from '../lib/imageEnhancer';

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
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Manual Compression & Enhancement Settings State
  const [compressionQuality, setCompressionQuality] = useState<number>(0.90); // 90%
  const [showAdvancedTools, setShowAdvancedTools] = useState<boolean>(false);
  const [enhancements, setEnhancements] = useState<EnhancementOptions>(DEFAULT_ENHANCEMENT_OPTIONS);

  const onCropComplete = useCallback((_croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  if (!isOpen) return null;

  const handleCompleteCropAndEnhance = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    setProcessingError(null);
    try {
      const result = await enhanceAndCompressImage(
        imageSrc,
        croppedAreaPixels,
        enhancements,
        compressionQuality,
        fileName || 'enhanced_image.webp'
      );
      onCropped(result.dataUrl, result.mimeType, fileName || 'enhanced_image.webp');
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to enhance or compress image.';
      console.error('Enhancement & cropping error:', msg);
      setProcessingError(isAr ? `خطأ في المعالجة والتحسين: ${msg}` : `Enhancement error: ${msg}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>
                {isAr
                  ? 'أداة قص، ضغط، وتحسين دقة ووضوح الصورة'
                  : 'Image Crop, Compression & Clarity Suite'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'تحكم يدوي كامل في جودة الضغط وتصفية ووضوح الصورة قبل اعتمادها للمشروع'
                : 'Manual control over compression quality, sharpness, and resolution clarity'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio & Tool Bar */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400 mr-1">
              {isAr ? 'نسبة الأبعاد:' : 'Aspect Ratio:'}
            </span>
            <button
              onClick={() => setAspect(16 / 9)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                aspect === 16 / 9
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              16:9 {isAr ? '(عرضي)' : '(Widescreen)'}
            </button>
            <button
              onClick={() => setAspect(4 / 3)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                aspect === 4 / 3
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              4:3 {isAr ? '(قياسي)' : '(Standard)'}
            </button>
            <button
              onClick={() => setAspect(1 / 1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                aspect === 1 / 1
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              1:1 {isAr ? '(مربع)' : '(Square)'}
            </button>
            <button
              onClick={() => setAspect(undefined)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                aspect === undefined
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isAr ? 'حر (Free)' : 'Free'}
            </button>
          </div>

          <button
            onClick={() => setShowAdvancedTools((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              showAdvancedTools
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {isAr ? 'أدوات الضغط وتحسين الدقة اليدوية' : 'Compression & Clarity Tools'}
            </span>
          </button>
        </div>

        {/* Expandable Manual Compression & Clarity Panel */}
        {showAdvancedTools && (
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* Compression Settings */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'جودة وضغط الملف (Compression)' : 'Compression Quality'}</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {Math.round(compressionQuality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.0}
                step={0.05}
                value={compressionQuality}
                onChange={(e) => setCompressionQuality(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                {isAr
                  ? 'تقليل حجم الملف وبناء WebP عالي الكفاءة لضمان سرعة تحميل فائقة.'
                  : 'Reduce file size and optimize WebP encoding for blazing-fast load times.'}
              </p>
            </div>

            {/* Clarity & Resolution Enhancement Settings */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>{isAr ? 'تحسين الوضوح والدقة (Clarity & Upscale)' : 'Clarity & Resolution Upscale'}</span>
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enhancements.sharpen}
                      onChange={(e) =>
                        setEnhancements((prev) => ({ ...prev, sharpen: e.target.checked }))
                      }
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>{isAr ? 'تصفية وزيادة ححدة وضوح الحواف (Sharpening)' : 'Edge Sharpening Filter'}</span>
                  </span>
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enhancements.upscale2x}
                      onChange={(e) =>
                        setEnhancements((prev) => ({ ...prev, upscale2x: e.target.checked }))
                      }
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>{isAr ? 'مضاعفة الدقة والوضوح (2x Super-Resolution Upscale)' : '2x Super-Resolution Upscale'}</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Cropper Container */}
        <div className="relative w-full h-[380px] bg-black/90">
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
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col gap-4">
          {processingError && (
            <div className="px-4 py-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-center justify-between">
              <span>{processingError}</span>
              <button onClick={() => setProcessingError(null)} className="text-red-300 hover:text-white font-bold ml-2">×</button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
              className="w-40 accent-indigo-600 cursor-pointer"
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
              onClick={handleCompleteCropAndEnhance}
              className="px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isAr ? 'جاري المعالجة، الضغط والتحسين...' : 'Processing, Compressing & Enhancing...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'اعتماد، ضغط وتحسين الصورة' : 'Apply Compression & Enhancement'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
