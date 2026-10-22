import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  Pause,
  Play,
} from 'lucide-react';
import { Language, ProjectItem, UI_TRANSLATIONS } from '../data/portfolioData';
import { fetchProjectGalleryItems } from '../lib/portfolioService';

interface ProjectVisualPreviewProps {
  project: ProjectItem;
  lang: Language;
  overrideImageUrl?: string | null;
  heightClass?: string;
  priorityLoading?: boolean;
  enableSlideshow?: boolean;
  fitMode?: 'contain' | 'cover';
}

export const ProjectVisualPreview: React.FC<ProjectVisualPreviewProps> =
  React.memo(
    ({
      project,
      lang,
      overrideImageUrl,
      heightClass = 'h-52',
      priorityLoading = false,
      enableSlideshow = true,
      fitMode = 'contain',
    }) => {
      const isAr = lang === 'ar';
      const t = UI_TRANSLATIONS[lang].projects;

      const [imgLoaded, setImgLoaded] = useState(false);
      const [imgError, setImgError] = useState(false);
      const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
      const [activeSlideIndex, setActiveSlideIndex] = useState(0);
      const [isHovered, setIsHovered] = useState(false);
      const [isFocused, setIsFocused] = useState(false);
      const [isManuallyPaused, setIsManuallyPaused] = useState(false);
      const [currentFit, setCurrentFit] = useState<'contain' | 'cover'>(fitMode);

      // Check prefers-reduced-motion
      const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
      useEffect(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
          const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
          setPrefersReducedMotion(mq.matches);
          const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
          mq.addEventListener('change', handler);
          return () => mq.removeEventListener('change', handler);
        }
      }, []);

      // Primary screenshot or thumbnail
      const primaryThumb =
        overrideImageUrl ||
        (project.thumbnailUrl && project.thumbnailUrl.trim().length > 0
          ? project.thumbnailUrl
          : project.genuineScreenshotPath || null);

      // Load gallery items if project has galleryMediaIds
      useEffect(() => {
        if (
          !overrideImageUrl &&
          enableSlideshow &&
          project.galleryMediaIds &&
          project.galleryMediaIds.length > 0
        ) {
          let active = true;
          fetchProjectGalleryItems(project.galleryMediaIds, true).then((items) => {
            if (active && items.length > 0) {
              setGalleryUrls(items.map((i) => i.dataUrl));
            }
          });
          return () => {
            active = false;
          };
        } else {
          setGalleryUrls([]);
        }
      }, [project.galleryMediaIds, overrideImageUrl, enableSlideshow]);

      // All candidate slides (primary first, then unique gallery URLs)
      const allSlides = useMemo(() => {
        if (overrideImageUrl) return [overrideImageUrl];
        const list: string[] = [];
        if (primaryThumb) list.push(primaryThumb);
        for (const url of galleryUrls) {
          if (url && !list.includes(url)) {
            list.push(url);
          }
        }
        return list;
      }, [overrideImageUrl, primaryThumb, galleryUrls]);

      // Active slide source
      const currentSlideSrc = allSlides[activeSlideIndex] || primaryThumb || null;

      useEffect(() => {
        setImgLoaded(false);
        setImgError(false);
      }, [currentSlideSrc]);

      // 5-second slideshow interval timer
      useEffect(() => {
        if (
          !enableSlideshow ||
          allSlides.length <= 1 ||
          isHovered ||
          isFocused ||
          isManuallyPaused ||
          prefersReducedMotion
        ) {
          return;
        }

        const timer = setInterval(() => {
          setActiveSlideIndex((prev) => (prev + 1) % allSlides.length);
        }, 5000);

        return () => clearInterval(timer);
      }, [
        enableSlideshow,
        allSlides.length,
        isHovered,
        isFocused,
        isManuallyPaused,
        prefersReducedMotion,
      ]);

      const handlePrevSlide = useCallback(
        (e: React.MouseEvent) => {
          e.stopPropagation();
          setActiveSlideIndex((prev) =>
            prev === 0 ? allSlides.length - 1 : prev - 1
          );
        },
        [allSlides.length]
      );

      const handleNextSlide = useCallback(
        (e: React.MouseEvent) => {
          e.stopPropagation();
          setActiveSlideIndex((prev) => (prev + 1) % allSlides.length);
        },
        [allSlides.length]
      );

      const toggleManualPause = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsManuallyPaused((prev) => !prev);
      }, []);

      const toggleFitMode = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentFit((prev) => (prev === 'contain' ? 'cover' : 'contain'));
      }, []);

      const { accentHex, secondaryHex, domainCode, diagramType } =
        project.illustrativeTheme;

      const resolvedAltText = isAr
        ? project.thumbnailAltAr || project.screenshotCaptionAr || project.nameAr
        : project.thumbnailAltEn || project.screenshotCaptionEn || project.nameEn;

      const renderDiagramSvg = () => {
        switch (diagramType) {
          case 'ecommerce_storefront':
          case 'digital_commerce':
          case 'global_catalog':
            return (
              <svg viewBox="0 0 360 180" className="w-full h-full" aria-hidden="true">
                <defs>
                  <linearGradient
                    id={`grad-${project.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.24" />
                    <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.08" />
                  </linearGradient>
                </defs>
                <rect width="360" height="180" fill={`url(#grad-${project.id})`} />
                <g stroke={accentHex} strokeOpacity="0.35" strokeWidth="1.2" fill="none">
                  <rect x="34" y="32" width="90" height="110" rx="8" />
                  <rect x="135" y="32" width="90" height="110" rx="8" />
                  <rect x="236" y="32" width="90" height="110" rx="8" />
                  <line x1="46" y1="115" x2="112" y2="115" />
                  <line x1="147" y1="115" x2="213" y2="115" />
                  <line x1="248" y1="115" x2="314" y2="115" />
                </g>
              </svg>
            );

          case 'school_platform':
          case 'healthcare_portal':
          case 'corporate_web':
            return (
              <svg viewBox="0 0 360 180" className="w-full h-full" aria-hidden="true">
                <defs>
                  <linearGradient
                    id={`grad-${project.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <rect width="360" height="180" fill={`url(#grad-${project.id})`} />
                <g stroke={accentHex} strokeOpacity="0.35" strokeWidth="1.2" fill="none">
                  <circle cx="180" cy="90" r="46" />
                  <circle cx="180" cy="90" r="68" strokeDasharray="6 6" />
                  <line x1="60" y1="90" x2="300" y2="90" />
                  <line x1="180" y1="22" x2="180" y2="158" />
                </g>
              </svg>
            );

          case 'accounting_ledger':
          case 'ai_web_platform':
          case 'fire_cv_iot':
          default:
            return (
              <svg viewBox="0 0 360 180" className="w-full h-full" aria-hidden="true">
                <defs>
                  <linearGradient
                    id={`grad-${project.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.08" />
                  </linearGradient>
                </defs>
                <rect width="360" height="180" fill={`url(#grad-${project.id})`} />
                <g stroke={accentHex} strokeOpacity="0.4" strokeWidth="1.3" fill="none">
                  <polygon points="180,30 235,62 235,118 180,150 125,118 125,62" />
                  <polyline points="48,132 105,94 152,112 215,64 268,88 314,48" />
                </g>
              </svg>
            );
        }
      };

      const showGenuineImage = Boolean(currentSlideSrc && !imgError);

      return (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          tabIndex={0}
          role="region"
          aria-label={
            allSlides.length > 1
              ? isAr
                ? `عرض صور المشروع (${activeSlideIndex + 1} من ${allSlides.length})`
                : `Project image slideshow (${activeSlideIndex + 1} of ${allSlides.length})`
              : resolvedAltText
          }
          className={`relative w-full ${heightClass} bg-[#070B14] border-b theme-border overflow-hidden select-none group focus:outline-hidden focus:ring-1 focus:ring-blue-500`}
        >
          {/* Real Project Screenshot with readable letterbox or cover presentation */}
          {showGenuineImage && (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-[#070B14]">
              {/* Subtle blurred backdrop for contain mode */}
              {currentFit === 'contain' && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-20 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${currentSlideSrc})` }}
                />
              )}

              <img
                src={currentSlideSrc!}
                alt={`${resolvedAltText} - ${activeSlideIndex + 1}`}
                loading={priorityLoading ? 'eager' : 'lazy'}
                decoding="async"
                referrerPolicy="no-referrer"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`relative z-1 max-w-full max-h-full transition-opacity duration-300 ${
                  currentFit === 'contain'
                    ? 'object-contain'
                    : 'w-full h-full object-cover object-top'
                } ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          )}

          {/* Illustrative Category Graphic when no screenshot is available */}
          {(!showGenuineImage || !imgLoaded) && (
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-[#0B1020] text-slate-200">
              {renderDiagramSvg()}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/80">
                    {domainCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 text-slate-300 truncate max-w-[72%]">
                    {t.illustrativeNotice}
                  </span>
                </div>

                <div className="space-y-0.5 bg-slate-950/80 backdrop-blur-xs p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-[11px] text-blue-400 font-medium">
                    {isAr ? project.categoryLabelAr : project.categoryLabelEn}
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {isAr ? project.nameAr : project.nameEn}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Badges & Controls */}
          {showGenuineImage && imgLoaded && (
            <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-xs border border-blue-500/40 text-[10px] font-medium text-blue-200 shadow-xs">
                <ImageIcon className="w-3 h-3 text-blue-400" aria-hidden="true" />
                <span>
                  {allSlides.length > 1
                    ? `${t.genuineScreenshotBadge} (${activeSlideIndex + 1}/${allSlides.length})`
                    : t.genuineScreenshotBadge}
                </span>
              </span>

              {/* Fit Mode Toggle & Play/Pause (pointer-events restored) */}
              <div className="flex items-center gap-1 pointer-events-auto">
                <button
                  type="button"
                  onClick={toggleFitMode}
                  title={
                    currentFit === 'contain'
                      ? isAr
                        ? 'تبديل إلى ملء الإطار (Cover)'
                        : 'Switch to cover mode'
                      : isAr
                      ? 'تبديل إلى احتواء الواجهة كاملة (Contain)'
                      : 'Switch to full contain mode'
                  }
                  className="p-1 rounded-md bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-slate-800 cursor-pointer text-[10px]"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>

                {allSlides.length > 1 && (
                  <button
                    type="button"
                    onClick={toggleManualPause}
                    title={
                      isManuallyPaused
                        ? isAr
                          ? 'استئناف الشرائح التلقائية'
                          : 'Resume slideshow'
                        : isAr
                        ? 'إيقاف مؤقت للشرائح'
                        : 'Pause slideshow'
                    }
                    className="p-1 rounded-md bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-slate-800 cursor-pointer"
                  >
                    {isManuallyPaused ? (
                      <Play className="w-3 h-3" />
                    ) : (
                      <Pause className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Chevrons (Only when multiple slides exist) */}
          {allSlides.length > 1 && showGenuineImage && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label={isAr ? 'الصورة السابقة' : 'Previous slide'}
                className="absolute top-1/2 -translate-y-1/2 start-1.5 z-10 p-1.5 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-slate-700/60 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label={isAr ? 'الصورة التالية' : 'Next slide'}
                className="absolute top-1/2 -translate-y-1/2 end-1.5 z-10 p-1.5 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-slate-700/60 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity cursor-pointer shadow-md"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots (Only when multiple slides exist) */}
          {allSlides.length > 1 && showGenuineImage && (
            <div className="absolute bottom-2.5 inset-x-0 z-10 flex items-center justify-center gap-1.5 pointer-events-none">
              <div className="px-2 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs border border-slate-800 flex items-center gap-1.5 pointer-events-auto">
                {allSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIndex(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`rounded-full transition-all cursor-pointer ${
                      activeSlideIndex === idx
                        ? 'w-4 h-1.5 bg-blue-500'
                        : 'w-1.5 h-1.5 bg-slate-600 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  );
