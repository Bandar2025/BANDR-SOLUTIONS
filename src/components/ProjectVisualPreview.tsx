import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
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
  aspectRatioClass?: string;
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
      heightClass,
      aspectRatioClass = 'aspect-[16/10]',
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
        (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          setActiveSlideIndex((prev) =>
            prev === 0 ? allSlides.length - 1 : prev - 1
          );
        },
        [allSlides.length]
      );

      const handleNextSlide = useCallback(
        (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
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

      // Keyboard arrow navigation when container is focused
      const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          if (allSlides.length <= 1) return;
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            e.stopPropagation();
            if (isAr) {
              handleNextSlide();
            } else {
              handlePrevSlide();
            }
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            e.stopPropagation();
            if (isAr) {
              handlePrevSlide();
            } else {
              handleNextSlide();
            }
          }
        },
        [allSlides.length, isAr, handleNextSlide, handlePrevSlide]
      );

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
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.06" />
                  </linearGradient>
                </defs>
                <rect width="360" height="180" fill={`url(#grad-${project.id})`} />
                <g stroke={accentHex} strokeOpacity="0.4" strokeWidth="1.2" fill="none">
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
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.06" />
                  </linearGradient>
                </defs>
                <rect width="360" height="180" fill={`url(#grad-${project.id})`} />
                <g stroke={accentHex} strokeOpacity="0.4" strokeWidth="1.2" fill="none">
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
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.06" />
                  </linearGradient>
                </defs>
                <rect width="360" height="180" fill={`url(#grad-${project.id})`} />
                <g stroke={accentHex} strokeOpacity="0.45" strokeWidth="1.3" fill="none">
                  <polygon points="180,30 235,62 235,118 180,150 125,118 125,62" />
                  <polyline points="48,132 105,94 152,112 215,64 268,88 314,48" />
                </g>
              </svg>
            );
        }
      };

      const showGenuineImage = Boolean(currentSlideSrc && !imgError);
      const dimensionClass = heightClass ? heightClass : aspectRatioClass;

      return (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={
            allSlides.length > 1
              ? isAr
                ? `عرض صور المشروع (${activeSlideIndex + 1} من ${allSlides.length})`
                : `Project image slideshow (${activeSlideIndex + 1} of ${allSlides.length})`
              : resolvedAltText
          }
          className={`relative w-full ${dimensionClass} theme-bg-elevated border-b theme-border overflow-hidden select-none group focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-primary)]`}
        >
          {/* Real Project Screenshot with readable letterbox or cover presentation */}
          {showGenuineImage && (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden theme-bg-elevated">
              {/* Subtle skeleton shimmer overlay cycling theme CSS variables while image loads */}
              {!imgLoaded && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 animate-skeleton-shimmer pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-elevated) 50%, var(--bg-surface) 100%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              )}

              {/* Subtle blurred backdrop for contain mode to give rich visual depth */}
              {currentFit === 'contain' && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-15 scale-110 pointer-events-none transition-all duration-500"
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
                style={{ objectFit: currentFit === 'cover' ? 'cover' : 'contain' }}
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
            <div className="absolute inset-0 flex flex-col justify-between p-4 theme-bg-elevated theme-text-primary">
              {renderDiagramSvg()}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular theme-text-secondary">
                  <span className="px-2 py-0.5 rounded theme-bg-surface border theme-border font-semibold">
                    {domainCode}
                  </span>
                  <span className="px-2 py-0.5 rounded theme-bg-surface border theme-border theme-text-secondary truncate max-w-[72%]">
                    {t.illustrativeNotice}
                  </span>
                </div>

                <div className="space-y-0.5 theme-bg-surface/90 backdrop-blur-xs p-2.5 rounded-lg border theme-border shadow-xs">
                  <div className="text-[11px] theme-accent-text font-semibold">
                    {isAr ? project.categoryLabelAr : project.categoryLabelEn}
                  </div>
                  <div className="text-xs font-bold theme-text-primary truncate">
                    {isAr ? project.nameAr : project.nameEn}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Badges & Controls */}
          {showGenuineImage && imgLoaded && (
            <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md theme-bg-surface/90 backdrop-blur-xs border theme-border text-[10px] font-semibold theme-text-primary shadow-xs">
                <ImageIcon className="w-3 h-3 theme-accent-text" aria-hidden="true" />
                <span>
                  {allSlides.length > 1
                    ? `${t.genuineScreenshotBadge} (${activeSlideIndex + 1}/${allSlides.length})`
                    : t.genuineScreenshotBadge}
                </span>
              </span>

              {/* Fit Mode Toggle & Play/Pause */}
              <div className="flex items-center gap-1.5 pointer-events-auto">
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
                  className="p-1.5 rounded-md theme-bg-surface/90 hover:theme-bg-surface theme-text-secondary hover:theme-text-primary border theme-border transition-colors cursor-pointer text-[10px] shadow-xs"
                >
                  {currentFit === 'contain' ? (
                    <Maximize2 className="w-3 h-3" />
                  ) : (
                    <Minimize2 className="w-3 h-3" />
                  )}
                </button>

                {allSlides.length > 1 && (
                  <button
                    type="button"
                    onClick={toggleManualPause}
                    title={
                      isManuallyPaused
                        ? isAr
                          ? 'استئناف الشرائح التلقائية (كل 5 ثوانٍ)'
                          : 'Resume automated 5s slideshow'
                        : isAr
                        ? 'إيقاف مؤقت للشرائح'
                        : 'Pause automated slideshow'
                    }
                    className="p-1.5 rounded-md theme-bg-surface/90 hover:theme-bg-surface theme-text-secondary hover:theme-text-primary border theme-border transition-colors cursor-pointer shadow-xs"
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
                className="absolute top-1/2 -translate-y-1/2 start-2 z-10 p-2 rounded-full theme-bg-surface/90 hover:theme-bg-surface theme-text-primary border theme-border opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity cursor-pointer shadow-md min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label={isAr ? 'الصورة التالية' : 'Next slide'}
                className="absolute top-1/2 -translate-y-1/2 end-2 z-10 p-2 rounded-full theme-bg-surface/90 hover:theme-bg-surface theme-text-primary border theme-border opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity cursor-pointer shadow-md min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots (Only when multiple slides exist) */}
          {allSlides.length > 1 && showGenuineImage && (
            <div className="absolute bottom-2.5 inset-x-0 z-10 flex items-center justify-center gap-1.5 pointer-events-none">
              <div className="px-2.5 py-1 rounded-full theme-bg-surface/90 backdrop-blur-xs border theme-border flex items-center gap-1.5 pointer-events-auto shadow-xs">
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
                        ? 'w-4 h-1.5 bg-[var(--accent-primary)]'
                        : 'w-1.5 h-1.5 bg-slate-400 hover:bg-slate-600'
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
