import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Image as ImageIcon,
  Layers,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import {
  getBuiltInProjectGallery,
  Language,
  ProjectItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { fetchProjectGalleryItems } from '../lib/portfolioService';
import { standardizeImageAspectRatio, StandardAspectRatio } from '../lib/aspectRatio';

const DEFAULT_PREVIEW_ASPECT = standardizeImageAspectRatio('16:9', 'cover', 'top');

interface ProjectVisualPreviewProps {
  project: ProjectItem;
  lang: Language;
  overrideImageUrl?: string | null;
  heightClass?: string;
  aspectRatioClass?: string;
  aspectRatio?: StandardAspectRatio;
  priorityLoading?: boolean;
  enableSlideshow?: boolean;
  fitMode?: 'contain' | 'cover';
  activeSlideIndexProp?: number;
  onSlideChange?: (index: number) => void;
}

export interface PreviewSlideItem {
  url: string;
  label: string;
}

const AUTOPLAY_INTERVAL_MS = 3500;

function isValidImageUrl(url?: string | null): url is string {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Ignore legacy placeholder paths that do not exist in /public
  if (trimmed.startsWith('/screenshots/')) return false;
  return true;
}

export const ProjectVisualPreview: React.FC<ProjectVisualPreviewProps> =
  React.memo(
    ({
      project,
      lang,
      overrideImageUrl,
      heightClass,
      aspectRatioClass,
      aspectRatio = '16:9',
      priorityLoading = false,
      enableSlideshow = true,
      fitMode = 'cover',
      activeSlideIndexProp,
      onSlideChange,
    }) => {
      const isAr = lang === 'ar';
      const t = UI_TRANSLATIONS[lang].projects;

      const [loadedUrls, setLoadedUrls] = useState<Set<string>>(() => new Set());
      const [failedUrls, setFailedUrls] = useState<Set<string>>(() => new Set());
      const [firestoreGallery, setFirestoreGallery] = useState<PreviewSlideItem[]>([]);
      const [internalSlideIndex, setInternalSlideIndex] = useState(0);
      const [isManuallyPaused, setIsManuallyPaused] = useState(false);
      const [currentFit, setCurrentFit] = useState<'contain' | 'cover'>(fitMode);

      useEffect(() => {
        setCurrentFit(fitMode);
      }, [fitMode]);

      // Respect prefers-reduced-motion
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

      // Load gallery items from Firestore if project has galleryMediaIds
      useEffect(() => {
        if (project.galleryMediaIds && project.galleryMediaIds.length > 0) {
          let active = true;
          fetchProjectGalleryItems(project.galleryMediaIds, true).then((items) => {
            if (active && items.length > 0) {
              setFirestoreGallery(
                items
                  .filter((i) => isValidImageUrl(i.dataUrl))
                  .map((i, idx) => ({
                    url: i.dataUrl,
                    label: isAr
                      ? i.altAr || `${project.nameAr} (${idx + 1})`
                      : i.altEn || `${project.nameEn} (${idx + 1})`,
                  }))
              );
            }
          });
          return () => {
            active = false;
          };
        } else {
          setFirestoreGallery([]);
        }
      }, [project.galleryMediaIds, project.nameAr, project.nameEn, isAr]);

      // Built-in local gallery photos (e.g., AI Fire Detection & Tasour Digital Twin)
      const builtInGallery = useMemo(
        () => getBuiltInProjectGallery(project.id),
        [project.id]
      );

      // Aggregate all valid image slides (excluding any URL that failed to load)
      const allSlides = useMemo<PreviewSlideItem[]>(() => {
        if (isValidImageUrl(overrideImageUrl) && !failedUrls.has(overrideImageUrl)) {
          return [
            {
              url: overrideImageUrl,
              label: isAr ? project.nameAr : project.nameEn,
            },
          ];
        }

        const list: PreviewSlideItem[] = [];
        const seen = new Set<string>();

        const addCandidate = (url?: string | null, label?: string) => {
          if (!isValidImageUrl(url)) return;
          if (failedUrls.has(url) || seen.has(url)) return;
          seen.add(url);
          list.push({
            url,
            label:
              label ||
              (isAr
                ? project.thumbnailAltAr || project.screenshotCaptionAr || project.nameAr
                : project.thumbnailAltEn || project.screenshotCaptionEn || project.nameEn),
          });
        };

        // 1. Owner-uploaded thumbnail in Firestore
        addCandidate(
          project.thumbnailUrl,
          isAr ? 'الصورة الرئيسية للمشروع' : 'Main Project Image'
        );

        // 2. Genuine local screenshot path
        addCandidate(
          project.genuineScreenshotPath,
          isAr
            ? project.screenshotCaptionAr || 'واجهة المشروع الرئيسية'
            : project.screenshotCaptionEn || 'Primary Project Interface'
        );

        // 3. Firestore uploaded gallery items
        for (const item of firestoreGallery) {
          addCandidate(item.url, item.label);
        }

        // 4. Built-in project gallery photos
        for (const item of builtInGallery) {
          addCandidate(item.url, isAr ? item.ar : item.en);
        }

        return list;
      }, [
        overrideImageUrl,
        failedUrls,
        project.thumbnailUrl,
        project.genuineScreenshotPath,
        project.thumbnailAltAr,
        project.thumbnailAltEn,
        project.screenshotCaptionAr,
        project.screenshotCaptionEn,
        project.nameAr,
        project.nameEn,
        firestoreGallery,
        builtInGallery,
        isAr,
      ]);

      const hasRealImages = allSlides.length > 0;
      // When no real images exist yet, we cycle through 3 rich architectural showcase slides
      const totalSlideCount = hasRealImages ? allSlides.length : 3;

      const rawActiveIndex =
        typeof activeSlideIndexProp === 'number'
          ? activeSlideIndexProp
          : internalSlideIndex;

      const safeActiveIndex =
        totalSlideCount > 0
          ? ((rawActiveIndex % totalSlideCount) + totalSlideCount) % totalSlideCount
          : 0;

      const setSlideIndex = useCallback(
        (nextIndexOrUpdater: number | ((prev: number) => number)) => {
          const nextVal =
            typeof nextIndexOrUpdater === 'function'
              ? nextIndexOrUpdater(safeActiveIndex)
              : nextIndexOrUpdater;
          const normalized =
            totalSlideCount > 0
              ? ((nextVal % totalSlideCount) + totalSlideCount) % totalSlideCount
              : 0;
          setInternalSlideIndex(normalized);
          if (onSlideChange) {
            onSlideChange(normalized);
          }
        },
        [safeActiveIndex, totalSlideCount, onSlideChange]
      );

      // Reset index when project changes
      useEffect(() => {
        setInternalSlideIndex(0);
      }, [project.id]);

      // Automatic slideshow timer (runs smoothly every 3.5s unless manually paused)
      useEffect(() => {
        if (
          !enableSlideshow ||
          totalSlideCount <= 1 ||
          isManuallyPaused ||
          prefersReducedMotion
        ) {
          return;
        }

        const timer = setInterval(() => {
          setSlideIndex((prev) => (prev + 1) % totalSlideCount);
        }, AUTOPLAY_INTERVAL_MS);

        return () => clearInterval(timer);
      }, [
        enableSlideshow,
        totalSlideCount,
        isManuallyPaused,
        prefersReducedMotion,
        setSlideIndex,
      ]);

      const handlePrevSlide = useCallback(
        (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          setSlideIndex((prev) =>
            prev === 0 ? totalSlideCount - 1 : prev - 1
          );
        },
        [totalSlideCount, setSlideIndex]
      );

      const handleNextSlide = useCallback(
        (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          setSlideIndex((prev) => (prev + 1) % totalSlideCount);
        },
        [totalSlideCount, setSlideIndex]
      );

      const toggleManualPause = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsManuallyPaused((prev) => !prev);
      }, []);

      const toggleFitMode = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentFit((prev) => (prev === 'contain' ? 'cover' : 'contain'));
      }, []);

      const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          if (totalSlideCount <= 1) return;
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
        [totalSlideCount, isAr, handleNextSlide, handlePrevSlide]
      );

      const handleImageLoad = useCallback((url: string) => {
        setLoadedUrls((prev) => {
          if (prev.has(url)) return prev;
          const next = new Set(prev);
          next.add(url);
          return next;
        });
      }, []);

      const handleImageError = useCallback((url: string) => {
        setFailedUrls((prev) => {
          if (prev.has(url)) return prev;
          const next = new Set(prev);
          next.add(url);
          return next;
        });
      }, []);

      const { accentHex, secondaryHex, domainCode } = project.illustrativeTheme;

      const resolvedAltText = isAr
        ? project.thumbnailAltAr || project.screenshotCaptionAr || project.nameAr
        : project.thumbnailAltEn || project.screenshotCaptionEn || project.nameEn;

      const currentSlide = allSlides[safeActiveIndex] || allSlides[0] || null;
      const hasLoadedAnyRealSlide = useMemo(
        () => allSlides.some((s) => loadedUrls.has(s.url)),
        [allSlides, loadedUrls]
      );

      const standardizedAspect = useMemo(
        () => standardizeImageAspectRatio(aspectRatio, currentFit, 'top'),
        [aspectRatio, currentFit]
      );

      const dimensionClass = heightClass
        ? heightClass
        : aspectRatioClass || standardizedAspect.aspectRatioClass || DEFAULT_PREVIEW_ASPECT.aspectRatioClass;

      return (
        <div
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={
            totalSlideCount > 1
              ? isAr
                ? `عرض صور المشروع (${safeActiveIndex + 1} من ${totalSlideCount})`
                : `Project image slideshow (${safeActiveIndex + 1} of ${totalSlideCount})`
              : resolvedAltText
          }
          className={`relative w-full ${dimensionClass} theme-bg-elevated border-b theme-border overflow-hidden select-none group/preview focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-primary)]`}
        >
          {/* 1. REAL PROJECT IMAGES CAROUSEL (Smooth Multi-Layer Crossfade & Prominent Display) */}
          {hasRealImages && (
            <div className="w-full h-full relative overflow-hidden bg-slate-950">
              {/* Shimmer skeleton only before the very first image loads */}
              {!hasLoadedAnyRealSlide && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-20 animate-skeleton-shimmer pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-elevated) 50%, var(--bg-surface) 100%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              )}

              {/* Rich Ambient Blurred Backdrop for depth & zero empty bars */}
              {currentSlide && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-45 scale-125 saturate-150 pointer-events-none transition-all duration-700"
                  style={{ backgroundImage: `url("${currentSlide.url}")` }}
                />
              )}

              {/* Subtle radial spotlight overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none z-1"
                style={{
                  background: `radial-gradient(circle at 50% 45%, transparent 45%, rgba(2, 6, 23, 0.45) 100%)`,
                }}
              />

              {/* Stacked Crossfading Image Slides */}
              {allSlides.map((slide, idx) => {
                const isActive = idx === safeActiveIndex;
                // Only mount active, previous, and next slides for optimal memory & lazy loading
                const isAdjacent =
                  allSlides.length <= 3 ||
                  idx === safeActiveIndex ||
                  idx === (safeActiveIndex + 1) % allSlides.length ||
                  idx === (safeActiveIndex - 1 + allSlides.length) % allSlides.length;

                if (!isAdjacent) return null;

                return (
                  <div
                    key={slide.url}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                      isActive
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={`${resolvedAltText} - ${slide.label}`}
                      loading={priorityLoading && idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onLoad={() => handleImageLoad(slide.url)}
                      onError={() => handleImageError(slide.url)}
                      className={`${standardizedAspect.imageClass} transition-transform duration-[3500ms] ease-out ${
                        currentFit === 'contain'
                          ? 'p-2 sm:p-3 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]'
                          : ''
                      } ${isActive ? 'scale-[1.02]' : 'scale-100'}`}
                    />
                  </div>
                );
              })}

              {/* Top & Bottom subtle gradient scrims so controls and badges are always crisp */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/65 via-slate-950/25 to-transparent z-15 pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent z-15 pointer-events-none"
              />
            </div>
          )}

          {/* 2. MULTI-SLIDE ARCHITECTURAL SHOWCASE (When no screenshot is uploaded yet) */}
          {!hasRealImages && (
            <div
              className="relative w-full h-full overflow-hidden text-white"
              style={{
                background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
              }}
            >
              {/* Glowing Accent Orbs */}
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: accentHex }}
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: secondaryHex }}
              />

              {/* Subtle Architectural Grid Pattern */}
              <svg
                viewBox="0 0 400 220"
                className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id={`grid-${project.id}`}
                    width="28"
                    height="28"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 28 0 L 0 0 0 28"
                      fill="none"
                      stroke={accentHex}
                      strokeWidth="0.7"
                    />
                  </pattern>
                </defs>
                <rect width="400" height="220" fill={`url(#grid-${project.id})`} />
              </svg>

              {/* Slide 0: Prominent Brand & Interface Mockup Showcase */}
              <div
                className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between transition-all duration-700 ease-out ${
                  safeActiveIndex === 0
                    ? 'opacity-100 translate-y-0 scale-100 z-10'
                    : 'opacity-0 translate-y-2 scale-95 z-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono-tabular font-bold border shadow-xs"
                    style={{
                      backgroundColor: `${accentHex}25`,
                      borderColor: `${accentHex}60`,
                      color: '#f8fafc',
                    }}
                  >
                    {domainCode}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs border border-white/15 text-[10px] font-semibold text-slate-200">
                    {isAr ? project.categoryLabelAr : project.categoryLabelEn}
                  </span>
                </div>

                {/* Stylized Browser / System Window Mockup */}
                <div className="my-auto mx-auto w-full max-w-[92%] rounded-xl bg-slate-900/90 border border-white/15 shadow-2xl overflow-hidden backdrop-blur-md">
                  <div className="px-3 py-1.5 bg-slate-800/90 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-[10px] font-mono-tabular text-slate-300 truncate max-w-[180px]">
                      {project.url
                        ? project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                        : `${project.slug}.system`}
                    </span>
                    <Sparkles className="w-3 h-3 text-sky-400" />
                  </div>
                  <div className="p-3.5 space-y-2">
                    <div
                      className="text-xs sm:text-sm font-extrabold text-white line-clamp-1"
                    >
                      {isAr ? project.nameAr : project.nameEn}
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {isAr ? project.engineeringContributionAr : project.engineeringContributionEn}
                    </p>
                  </div>
                </div>

                <div className="h-4" />
              </div>

              {/* Slide 1: System Architecture & Tech Stack Blueprint */}
              <div
                className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between transition-all duration-700 ease-out ${
                  safeActiveIndex === 1
                    ? 'opacity-100 translate-y-0 scale-100 z-10'
                    : 'opacity-0 translate-y-2 scale-95 z-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-[10px] font-bold text-sky-300">
                    <Cpu className="w-3 h-3" />
                    <span>{isAr ? 'البنية التقنية والمعمارية' : 'Tech Stack & Architecture'}</span>
                  </span>
                  <span className="text-[10px] font-mono-tabular text-slate-300">
                    {domainCode}
                  </span>
                </div>

                <div className="my-auto mx-auto w-full max-w-[94%] rounded-xl bg-slate-900/85 border border-white/15 p-3.5 shadow-xl backdrop-blur-md space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {(project.technologies.length > 0
                      ? project.technologies.slice(0, 6)
                      : ['React', 'TypeScript', 'Tailwind CSS', 'Modular Architecture']
                    ).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] font-mono-tabular font-bold text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {isAr ? project.descriptionAr : project.descriptionEn}
                  </p>
                </div>

                <div className="h-4" />
              </div>

              {/* Slide 2: Verified Capabilities & Engineering Highlights */}
              <div
                className={`absolute inset-0 p-4 sm:p-5 flex flex-col justify-between transition-all duration-700 ease-out ${
                  safeActiveIndex === 2
                    ? 'opacity-100 translate-y-0 scale-100 z-10'
                    : 'opacity-0 translate-y-2 scale-95 z-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300">
                    <Layers className="w-3 h-3" />
                    <span>{isAr ? 'أبرز المرتكزات الهندسية' : 'Key Engineering Highlights'}</span>
                  </span>
                  <span className="text-[10px] font-mono-tabular text-slate-300">
                    {domainCode}
                  </span>
                </div>

                <div className="my-auto mx-auto w-full max-w-[94%] rounded-xl bg-slate-900/85 border border-white/15 p-3 shadow-xl backdrop-blur-md space-y-1.5">
                  {(isAr ? project.verifiedFactsAr : project.verifiedFactsEn)
                    .slice(0, 2)
                    .map((fact, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-snug">{fact}</span>
                      </div>
                    ))}
                </div>

                <div className="h-4" />
              </div>
            </div>
          )}

          {/* Top Controls Overlay (Slide Counter, Active Label, Fit Toggle, Play/Pause) */}
          {hasRealImages && (
            <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between gap-2 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white shadow-md max-w-[70%]">
                <ImageIcon className="w-3 h-3 text-sky-400 shrink-0" aria-hidden="true" />
                <span className="font-mono-tabular font-bold text-sky-300 shrink-0">
                  {safeActiveIndex + 1}/{allSlides.length}
                </span>
                <span className="truncate opacity-90">
                  {currentSlide?.label || t.genuineScreenshotBadge}
                </span>
              </span>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={toggleFitMode}
                  title={
                    currentFit === 'contain'
                      ? isAr
                        ? 'تبديل إلى ملء الإطار البارز (Cover)'
                        : 'Switch to prominent cover mode'
                      : isAr
                      ? 'تبديل إلى احتواء الصورة كاملة (Contain)'
                      : 'Switch to full contain mode'
                  }
                  className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white border border-white/15 transition-colors cursor-pointer text-[10px] shadow-md backdrop-blur-md"
                >
                  {currentFit === 'contain' ? (
                    <Maximize2 className="w-3 h-3" />
                  ) : (
                    <Minimize2 className="w-3 h-3" />
                  )}
                </button>

                {totalSlideCount > 1 && (
                  <button
                    type="button"
                    onClick={toggleManualPause}
                    title={
                      isManuallyPaused
                        ? isAr
                          ? 'تشغيل التمرير التلقائي بين الصور'
                          : 'Resume automatic image slideshow'
                        : isAr
                        ? 'إيقاف التمرير التلقائي مؤقتاً'
                        : 'Pause automatic image slideshow'
                    }
                    className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white border border-white/15 transition-colors cursor-pointer shadow-md backdrop-blur-md"
                  >
                    {isManuallyPaused ? (
                      <Play className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Pause className="w-3 h-3 text-sky-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Left / Right Navigation Chevrons */}
          {totalSlideCount > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label={isAr ? 'الصورة السابقة' : 'Previous slide'}
                className="absolute top-1/2 -translate-y-1/2 start-2 z-20 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-white/20 opacity-85 group-hover/preview:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-lg backdrop-blur-md min-w-[34px] min-h-[34px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label={isAr ? 'الصورة التالية' : 'Next slide'}
                className="absolute top-1/2 -translate-y-1/2 end-2 z-20 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-white/20 opacity-85 group-hover/preview:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-lg backdrop-blur-md min-w-[34px] min-h-[34px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </>
          )}

          {/* Bottom Interactive Pagination Dots */}
          {totalSlideCount > 1 && (
            <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
              <div className="px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/15 flex items-center gap-1.5 pointer-events-auto shadow-md">
                {Array.from({ length: totalSlideCount }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideIndex(idx);
                    }}
                    aria-label={
                      isAr
                        ? `الانتقال إلى الشريحة ${idx + 1}`
                        : `Go to slide ${idx + 1}`
                    }
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      safeActiveIndex === idx
                        ? 'w-5 h-1.5 bg-[var(--accent-primary)]'
                        : 'w-1.5 h-1.5 bg-white/45 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Animated Autoplay Progress Bar */}
          {enableSlideshow && totalSlideCount > 1 && !isManuallyPaused && !prefersReducedMotion && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-950/50 z-20 overflow-hidden pointer-events-none">
              <div
                key={`${project.id}-slide-${safeActiveIndex}`}
                className="h-full bg-[var(--accent-primary)] origin-left"
                style={{
                  animation: `slideProgress ${AUTOPLAY_INTERVAL_MS}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      );
    }
  );
