import React, { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  ShieldCheck,
  Code2,
  Images,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Layers,
  Compass,
} from 'lucide-react';
import {
  getBuiltInProjectGallery,
  Language,
  ProjectGalleryItem,
  ProjectItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { ProjectVisualPreview } from './ProjectVisualPreview';
import { fetchProjectGalleryItems } from '../lib/portfolioService';
import { standardizeImageAspectRatio } from '../lib/aspectRatio';

const MODAL_GALLERY_ASPECT = standardizeImageAspectRatio('16:9', 'cover', 'top');

export interface ProjectDetailModalProps {
  project: ProjectItem | null;
  lang: Language;
  onClose: () => void;
  isAdminPreview?: boolean;
  preloadedGallery?: ProjectGalleryItem[];
  onInquireService?: (serviceTitle: string) => void;
  onSelectTech?: (tech: string) => void;
  selectedTech?: string | null;
  allProjects?: ProjectItem[];
}

/**
 * Splits a project title on ' — ' into a primary brand identity and a descriptive subtitle.
 */
function parseModalProjectTitle(rawTitle: string): {
  primaryTitle: string;
  subtitle: string | null;
} {
  const parts = rawTitle.split(/\s+—\s+/);
  if (parts.length >= 2) {
    return {
      primaryTitle: parts[0].trim(),
      subtitle: parts.slice(1).join(' — ').trim(),
    };
  }
  return {
    primaryTitle: rawTitle.trim(),
    subtitle: null,
  };
}

/**
 * Splits a multi-paragraph project description into structured paragraphs,
 * removing any redundant first line that merely duplicates the project title.
 */
function parseDescriptionParagraphs(
  rawDesc: string,
  rawTitle: string
): string[] {
  const paragraphs = rawDesc
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return [rawDesc];

  const normalizedTitle = rawTitle.toLowerCase().trim();
  const firstPara = paragraphs[0];

  if (
    paragraphs.length > 1 &&
    (firstPara.toLowerCase() === normalizedTitle ||
      (firstPara.includes(' — ') && firstPara.length < 95))
  ) {
    return paragraphs.slice(1);
  }

  return paragraphs;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  lang,
  onClose,
  isAdminPreview = false,
  preloadedGallery,
  onInquireService,
  onSelectTech,
  selectedTech,
  allProjects = [],
}) => {
  const isAr = lang === 'ar';
  const t = UI_TRANSLATIONS[lang].projects;
  const [galleryItems, setGalleryItems] = useState<ProjectGalleryItem[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  // Fullscreen Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
  const [specFilter, setSpecFilter] = useState<'all' | 'implemented' | 'extensible'>('all');

  useEffect(() => {
    if (!project) return;
    setSelectedGalleryImage(null);
    setLightboxOpen(false);
    setActiveLightboxIndex(0);
    setSpecFilter('all');

    if (preloadedGallery) {
      setGalleryItems(preloadedGallery);
      return;
    }

    if (project.galleryMediaIds && project.galleryMediaIds.length > 0) {
      let active = true;
      fetchProjectGalleryItems(project.galleryMediaIds, !isAdminPreview).then((items) => {
        if (active) setGalleryItems(items);
      });
      return () => {
        active = false;
      };
    } else {
      setGalleryItems([]);
    }
  }, [project, isAdminPreview, preloadedGallery]);

  // Aggregated list of all available images for this project
  const allDisplayImages = useMemo(() => {
    if (!project) return [];
    const list: { url: string; alt: string; label: string }[] = [];
    const seen = new Set<string>();

    const addImg = (url?: string | null, alt?: string, label?: string) => {
      if (!url) return;
      const trimmed = url.trim();
      if (!trimmed || trimmed.startsWith('/screenshots/') || seen.has(trimmed)) return;
      seen.add(trimmed);
      list.push({
        url: trimmed,
        alt: alt || (isAr ? project.nameAr : project.nameEn),
        label: label || (isAr ? 'الصورة الرئيسية' : 'Main Image'),
      });
    };

    // 1. Uploaded main thumbnail in Firestore
    addImg(
      project.thumbnailUrl,
      isAr ? project.thumbnailAltAr || project.nameAr : project.thumbnailAltEn || project.nameEn,
      isAr ? 'الصورة الرئيسية' : 'Main Thumbnail'
    );

    // 2. Genuine local screenshot path
    addImg(
      project.genuineScreenshotPath,
      isAr ? project.thumbnailAltAr || project.nameAr : project.thumbnailAltEn || project.nameEn,
      isAr
        ? project.screenshotCaptionAr || 'واجهة المشروع الرئيسية'
        : project.screenshotCaptionEn || 'Primary Interface'
    );

    // 3. Firestore uploaded gallery items
    galleryItems.forEach((item, index) => {
      addImg(
        item.dataUrl,
        isAr
          ? item.altAr || `${project.nameAr} - ${index + 1}`
          : item.altEn || `${project.nameEn} - ${index + 1}`,
        isAr
          ? item.altAr || `لقطة شاشة ${index + 1}`
          : item.altEn || `Screenshot ${index + 1}`
      );
    });

    // 4. Built-in project gallery items
    const builtIn = getBuiltInProjectGallery(project.id);
    builtIn.forEach((p) => {
      addImg(p.url, isAr ? p.ar : p.en, isAr ? p.ar : p.en);
    });

    return list;
  }, [project, galleryItems, isAr]);

  const activeDisplayImage = allDisplayImages[activeLightboxIndex] || allDisplayImages[0];

  const currentModalSlideIndex = useMemo(() => {
    if (allDisplayImages.length === 0) return 0;
    return ((activeLightboxIndex % allDisplayImages.length) + allDisplayImages.length) % allDisplayImages.length;
  }, [activeLightboxIndex, allDisplayImages.length]);

  const handleSelectModalSlide = (idx: number) => {
    if (allDisplayImages.length === 0) return;
    const normalizedIdx = ((idx % allDisplayImages.length) + allDisplayImages.length) % allDisplayImages.length;
    const target = allDisplayImages[normalizedIdx];
    if (!target) return;
    setSelectedGalleryImage(target.url);
    setActiveLightboxIndex(normalizedIdx);
  };

  const handleLightboxPrev = () => {
    if (allDisplayImages.length <= 1) return;
    const nextIdx = activeLightboxIndex > 0 ? activeLightboxIndex - 1 : allDisplayImages.length - 1;
    setActiveLightboxIndex(nextIdx);
    if (allDisplayImages[nextIdx]) {
      setSelectedGalleryImage(allDisplayImages[nextIdx].url);
    }
  };

  const handleLightboxNext = () => {
    if (allDisplayImages.length <= 1) return;
    const nextIdx = activeLightboxIndex < allDisplayImages.length - 1 ? activeLightboxIndex + 1 : 0;
    setActiveLightboxIndex(nextIdx);
    if (allDisplayImages[nextIdx]) {
      setSelectedGalleryImage(allDisplayImages[nextIdx].url);
    }
  };

  // Keyboard navigation for Lightbox and Modal
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') {
          e.stopPropagation();
          setLightboxOpen(false);
        } else if (e.key === 'ArrowLeft') {
          e.stopPropagation();
          if (isAr) {
            handleLightboxNext();
          } else {
            handleLightboxPrev();
          }
        } else if (e.key === 'ArrowRight') {
          e.stopPropagation();
          if (isAr) {
            handleLightboxPrev();
          } else {
            handleLightboxNext();
          }
        }
      } else {
        if (e.key === 'Escape') {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, lightboxOpen, allDisplayImages.length, onClose, isAr]);

  if (!project) return null;

  const rawTitle = isAr ? project.nameAr : project.nameEn;
  const rawDescription = isAr ? project.descriptionAr : project.descriptionEn;
  const { primaryTitle, subtitle } = parseModalProjectTitle(rawTitle);
  const descriptionParagraphs = parseDescriptionParagraphs(rawDescription, rawTitle);

  const v = project.verification;

  const formatUrlOpened = () => {
    if (v.urlOpened === 'not_applicable') {
      return isAr
        ? 'غير منطبق (دراسة حالة هندسية بدون رابط عام)'
        : 'N/A (Engineering Case Study — no public URL)';
    }
    if (v.urlOpened === 'opened_with_branding_note') {
      return isAr
        ? 'تم فحص الاستجابة الأولية — توجد ملاحظة لمراجعة اسم المتجر مع المالك'
        : 'Initial response checked — storefront title flagged for owner branding review';
    }
    return isAr ? 'لم يتم التحقق التفاعلي بعد' : 'Not yet verified in interactive browser';
  };

  const formatInterfaceObserved = () => {
    if (v.interfaceObserved === 'owner_screenshot_supplied') {
      return isAr
        ? 'تم تزويد لقطة شاشة حقيقية للواجهة العربية من قِبل المالك'
        : 'Genuine Arabic landing page screenshot supplied by owner';
    }
    if (v.interfaceObserved === 'storefront_title_differs_flagged') {
      return isAr
        ? 'عنوان الواجهة الظاهر يختلف عن اسم NOVARO — بانتظار تأكيد المالك'
        : 'Observed storefront title differed from NOVARO — awaiting owner confirmation';
    }
    if (v.interfaceObserved === 'not_applicable') {
      return isAr ? 'موثق معمارياً' : 'Documented architecturally';
    }
    return isAr ? 'بانتظار المعاينة المباشرة' : 'Pending live browser inspection';
  };

  const formatPublicAccess = () => {
    if (v.publiclyAccessible === 'ai_studio_applet_requires_session_check') {
      return isAr
        ? 'تطبيق Google AI Studio (قد يتطلب جلسة متصفح أو إعادة توجيه أو تسجيل دخول)'
        : 'Google AI Studio Applet (may require browser session, redirect, or sign-in)';
    }
    if (v.publiclyAccessible === 'case_study_no_public_url') {
      return isAr
        ? 'دراسة حالة هندسية (لا يوجد رابط عام)'
        : 'Engineering Case Study (No public demo URL)';
    }
    return isAr
      ? 'رابط خارجي متاح — بانتظار التحقق الكامل'
      : 'External URL provided — pending full check';
  };

  const openLightboxWithImage = (url: string) => {
    const idx = allDisplayImages.findIndex((img) => img.url === url);
    setActiveLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  const handleInquireProject = () => {
    const serviceName = isAr ? project.nameAr : project.nameEn;
    onClose();
    if (onInquireService) {
      onInquireService(serviceName);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Primary Project Detail Modal — Ultra-Modern Wide Layout */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl theme-bg-surface theme-text-primary rounded-3xl border theme-border shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Modal Header — Sleek Widescreen Header */}
          <div className="flex items-start justify-between gap-6 px-8 py-6 theme-bg-elevated border-b theme-border shrink-0">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs theme-accent-text font-bold tracking-wide">
                <span className="px-3 py-1 rounded-full theme-bg-surface border theme-border">
                  {isAr ? project.categoryLabelAr : project.categoryLabelEn}
                </span>
                <span className="font-mono-tabular opacity-80">{project.illustrativeTheme.domainCode}</span>
                {isAdminPreview && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                    {project.status === 'draft'
                      ? isAr
                        ? 'معاينة مسودة (غير منشور)'
                        : 'DRAFT PREVIEW'
                      : isAr
                      ? 'معاينة منشور'
                      : 'PUBLISHED PREVIEW'}
                  </span>
                )}
              </div>

              <h2
                id="modal-project-title"
                className="font-display"
              >
                <span className="block text-2xl sm:text-4xl font-black theme-text-primary leading-[1.2] tracking-tight">
                  {primaryTitle}
                </span>
                {subtitle && (
                  <span className="block text-sm sm:text-base font-semibold theme-text-secondary mt-2 leading-[1.5]">
                    {subtitle}
                  </span>
                )}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.modalClose}
              className="p-2.5 rounded-xl theme-btn-secondary cursor-pointer shrink-0 hover:scale-105 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Modal Widescreen Body */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-8">
            {/* Quick Concept / Executive Summary Card (For Instant Comprehension) */}
            <div className="p-6 sm:p-7 rounded-2xl theme-bg-elevated border theme-border relative overflow-hidden shadow-lg space-y-3">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-primary)]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-2 text-xs font-bold theme-accent-text uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>{isAr ? 'نظرة عامة سريعة على المشروع' : 'Instant Project Overview'}</span>
              </div>
              <p className="text-base sm:text-lg font-medium theme-text-primary leading-[1.85]">
                {descriptionParagraphs[0] || (isAr ? project.descriptionAr : project.descriptionEn)}
              </p>
            </div>

            {/* Visual Preview Container with Fullscreen Zoom Trigger & Pagination Dots */}
            <div className="space-y-3">
              <div className="relative group rounded-2xl overflow-hidden border theme-border shadow-2xl">
                <ProjectVisualPreview
                  project={project}
                  lang={lang}
                  aspectRatio="16:9"
                  aspectRatioClass={MODAL_GALLERY_ASPECT.aspectRatioClass}
                  priorityLoading={true}
                  enableSlideshow={!lightboxOpen}
                  fitMode="cover"
                  activeSlideIndexProp={currentModalSlideIndex}
                  onSlideChange={(idx) => {
                    setActiveLightboxIndex(idx);
                    if (allDisplayImages[idx]) {
                      setSelectedGalleryImage(allDisplayImages[idx].url);
                    }
                  }}
                />

                {allDisplayImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      openLightboxWithImage(
                        allDisplayImages[currentModalSlideIndex]?.url || allDisplayImages[0].url
                      )
                    }
                    className="absolute bottom-3.5 end-3.5 z-30 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold shadow-xl backdrop-blur-md transition-all cursor-pointer border border-white/20 hover:scale-105"
                    aria-label={isAr ? 'عرض في المعاينة المكبرة' : 'View in full-screen Lightbox'}
                  >
                    <Maximize2 className="w-4 h-4" aria-hidden="true" />
                    <span>{isAr ? 'تكبير الصورة بالكامل' : 'Fullscreen Zoom'}</span>
                  </button>
                )}
              </div>

              {/* Interactive Pagination Dots Bar Directly Below Image */}
              {allDisplayImages.length > 0 && (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl theme-bg-elevated border theme-border"
                  role="region"
                  aria-label={isAr ? 'التنقل بين صور المشروع' : 'Project images pagination'}
                >
                  <div className="flex items-center gap-2 text-xs font-medium theme-text-secondary min-w-0">
                    <span className="px-2 py-0.5 rounded-md theme-bg-surface border theme-border font-mono-tabular font-bold theme-accent-text shrink-0">
                      {currentModalSlideIndex + 1} / {allDisplayImages.length}
                    </span>
                    <span className="truncate">
                      {allDisplayImages[currentModalSlideIndex]?.label ||
                        (isAr ? 'معاينة المشروع' : 'Project Preview')}
                    </span>
                  </div>

                  {allDisplayImages.length > 1 && (
                    <div className="flex items-center gap-2 mx-auto sm:mx-0">
                      <button
                        type="button"
                        onClick={() => handleSelectModalSlide(currentModalSlideIndex - 1)}
                        aria-label={isAr ? 'الصورة السابقة' : 'Previous image'}
                        className="p-1.5 rounded-lg theme-bg-surface hover:border-[var(--accent-primary)] border theme-border theme-text-secondary hover:theme-text-primary transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>

                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full theme-bg-surface border theme-border"
                        role="tablist"
                        aria-label={isAr ? 'مؤشرات صور المشروع' : 'Image pagination dots'}
                      >
                        {allDisplayImages.map((imgItem, idx) => {
                          const isActive = currentModalSlideIndex === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              aria-label={
                                isAr
                                  ? `الانتقال إلى الصورة ${idx + 1}: ${imgItem.label}`
                                  : `Go to image ${idx + 1}: ${imgItem.label}`
                              }
                              title={imgItem.label}
                              onClick={() => handleSelectModalSlide(idx)}
                              className={`rounded-full transition-all duration-300 cursor-pointer ${
                                isActive
                                  ? 'w-6 h-2 bg-[var(--accent-primary)] shadow-xs'
                                  : 'w-2 h-2 bg-slate-400/50 hover:bg-slate-400'
                              }`}
                            />
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectModalSlide(currentModalSlideIndex + 1)}
                        aria-label={isAr ? 'الصورة التالية' : 'Next image'}
                        className="p-1.5 rounded-lg theme-bg-surface hover:border-[var(--accent-primary)] border theme-border theme-text-secondary hover:theme-text-primary transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Project Gallery Thumbnails Strip (When Multiple Images Exist) */}
            {allDisplayImages.length > 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold theme-text-primary">
                  <span className="flex items-center gap-2">
                    <Images className="w-5 h-5 theme-accent-text" aria-hidden="true" />
                    <span>
                      {t.modalGalleryHeading} ({allDisplayImages.length})
                    </span>
                  </span>
                  {selectedGalleryImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGalleryImage(null);
                        setActiveLightboxIndex(0);
                      }}
                      className="text-xs theme-accent-text hover:underline cursor-pointer font-semibold"
                    >
                      {isAr ? 'العودة للصورة الرئيسية' : 'Reset to Main Thumbnail'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {allDisplayImages.map((imgItem, idx) => {
                    const isSelected = currentModalSlideIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectModalSlide(idx)}
                        className={`group relative rounded-xl overflow-hidden border-2 text-start transition-all cursor-pointer shadow-md hover:scale-[1.02] ${
                          isSelected
                            ? 'border-[var(--accent-primary)] ring-4 ring-[var(--accent-primary)]/20'
                            : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                        }`}
                      >
                        <div className={`${MODAL_GALLERY_ASPECT.containerClass} bg-slate-950`}>
                          <img
                            src={imgItem.url}
                            alt={imgItem.alt}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className={`${MODAL_GALLERY_ASPECT.imageClass} transition-transform duration-300 group-hover:scale-105`}
                          />
                        </div>
                        <div className="px-3 py-1.5 theme-bg-elevated text-xs theme-text-secondary truncate flex items-center justify-between">
                          <span className="truncate font-medium">{imgItem.label}</span>
                          {idx === 0 && (
                            <span className="text-xs font-bold theme-accent-text shrink-0">
                              ★
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Detailed Description Paragraphs & Engineering Contribution */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-extrabold theme-text-primary flex items-center gap-3 border-b theme-border pb-3">
                <Sparkles className="w-6 h-6 theme-accent-text shrink-0" />
                <span>{isAr ? 'التفاصيل الشاملة وفكرة المشروع' : 'Detailed Concept & Scope'}</span>
              </h3>

              <div className="space-y-4">
                {descriptionParagraphs.slice(1).map((para, idx) => {
                  const isCallout =
                    para.startsWith('الهدف:') ||
                    para.startsWith('حالة المشروع:') ||
                    para.startsWith('Project Objective:') ||
                    para.startsWith('Project Status:');

                  if (isCallout) {
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl theme-bg-elevated border theme-border text-sm sm:text-base font-semibold theme-text-primary leading-[1.8]"
                      >
                        {para}
                      </div>
                    );
                  }

                  return (
                    <p
                      key={idx}
                      className="text-base sm:text-lg font-normal theme-text-secondary leading-[1.9]"
                    >
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Engineering Contribution Card */}
              <div className="p-6 rounded-2xl theme-card-elevated space-y-2 border theme-border">
                <h4 className="text-xs font-extrabold theme-accent-text uppercase tracking-wider">
                  {t.modalEngineeringRole}
                </h4>
                <p className="text-base sm:text-lg font-semibold theme-text-primary leading-[1.8]">
                  {isAr
                    ? project.engineeringContributionAr
                    : project.engineeringContributionEn}
                </p>
              </div>
            </div>

            {/* Clickable Technologies Grid (Tech Stack Filter Badges) */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b theme-border pb-3">
                <h3 className="text-lg sm:text-xl font-bold theme-text-primary flex items-center gap-2.5">
                  <FileCode2 className="w-5 h-5 theme-accent-text shrink-0" />
                  <span>{t.modalTechStack}</span>
                </h3>
                {project.technologies.length > 0 && onSelectTech && (
                  <span className="text-xs font-medium theme-text-muted">
                    {isAr
                      ? 'اضغط على أي تقنية لتصفية المشاريع المطابقة'
                      : 'Click any badge to filter projects by technology'}
                  </span>
                )}
              </div>
              {project.technologies.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label={t.modalTechStack}>
                  {project.technologies.map((tech) => {
                    const isActiveTech =
                      Boolean(selectedTech) &&
                      selectedTech!.toLowerCase() === tech.toLowerCase();
                    const matchingCount =
                      allProjects.length > 0
                        ? allProjects.filter(
                            (p) =>
                              p.status !== 'draft' &&
                              p.technologies.some(
                                (tItem) => tItem.toLowerCase() === tech.toLowerCase()
                              )
                          ).length
                        : 0;

                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => {
                          if (onSelectTech) {
                            onSelectTech(tech);
                          }
                        }}
                        title={
                          isAr
                            ? `تصفية المشاريع التي تستخدم ${tech}`
                            : `Filter projects built with ${tech}`
                        }
                        aria-pressed={isActiveTech}
                        className={`group/tech inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold font-mono-tabular transition-all duration-200 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
                          isActiveTech
                            ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-md'
                            : 'theme-bg-elevated theme-border theme-accent-text hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10'
                        }`}
                      >
                        <Code2
                          className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover/tech:rotate-12 ${
                            isActiveTech ? 'text-white' : 'theme-accent-text'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{tech}</span>
                        {matchingCount > 0 && (
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold leading-none ${
                              isActiveTech
                                ? 'bg-white/20 text-white'
                                : 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                            }`}
                          >
                            {matchingCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm theme-text-muted leading-relaxed">{t.modalTechNotClaimed}</p>
              )}
            </div>

            {/* Smart Specification & Capabilities Matrix (For Projects with Structured Pillars) */}
            {project.specificationPillars && project.specificationPillars.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl theme-card-elevated space-y-6 border theme-border">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b theme-border pb-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 text-xs font-extrabold theme-accent-text uppercase tracking-wider">
                      <Layers className="w-4 h-4" />
                      <span>
                        {isAr
                          ? 'المواصفات الوظيفية والمعمارية المقسمة بذكاء'
                          : 'Smart Functional & Architectural Specification'}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold theme-text-primary leading-snug">
                      {isAr
                        ? `منظومة القدرات والمميزات الرئيسية (${project.specificationPillars.length} محاور)`
                        : `Core Platform Capabilities & Pillars (${project.specificationPillars.length} Modules)`}
                    </h3>
                  </div>

                  {/* Interactive Filter Tabs for Specification Pillars */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl theme-bg-surface border theme-border">
                    <button
                      type="button"
                      onClick={() => setSpecFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        specFilter === 'all'
                          ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                          : 'theme-text-secondary hover:theme-text-primary'
                      }`}
                    >
                      {isAr
                        ? `الكل (${project.specificationPillars.length})`
                        : `All (${project.specificationPillars.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecFilter('implemented')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        specFilter === 'implemented'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'theme-text-secondary hover:theme-text-primary'
                      }`}
                    >
                      {isAr
                        ? `منشور وموثق (${
                            project.specificationPillars.filter((p) => p.statusType === 'implemented')
                              .length
                          })`
                        : `Live Storefront (${
                            project.specificationPillars.filter((p) => p.statusType === 'implemented')
                              .length
                          })`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecFilter('extensible')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        specFilter === 'extensible'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'theme-text-secondary hover:theme-text-primary'
                      }`}
                    >
                      {isAr
                        ? `قابل للتوسع والتكامل (${
                            project.specificationPillars.filter((p) => p.statusType === 'extensible')
                              .length
                          })`
                        : `Extensible / Planned (${
                            project.specificationPillars.filter((p) => p.statusType === 'extensible')
                              .length
                          })`}
                    </button>
                  </div>
                </div>

                {/* Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.specificationPillars
                    .filter((pillar) => specFilter === 'all' || pillar.statusType === specFilter)
                    .map((pillar) => {
                      const isImplemented = pillar.statusType === 'implemented';
                      return (
                        <div
                          key={pillar.id}
                          className="p-5 rounded-2xl theme-bg-surface border theme-border hover:border-[var(--accent-primary)]/50 transition-all flex flex-col justify-between gap-4 shadow-sm"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="px-2.5 py-1 rounded-lg theme-bg-elevated border theme-border font-mono-tabular text-xs font-black theme-accent-text shrink-0">
                                  {pillar.index}
                                </span>
                                <h4 className="text-base font-extrabold theme-text-primary leading-snug">
                                  {isAr ? pillar.titleAr : pillar.titleEn}
                                </h4>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 border ${
                                  isImplemented
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                {isAr ? pillar.badgeAr : pillar.badgeEn}
                              </span>
                            </div>

                            <ul className="space-y-2 pt-1">
                              {(isAr ? pillar.itemsAr : pillar.itemsEn).map((bullet, bIdx) => (
                                <li
                                  key={bIdx}
                                  className="flex items-start gap-2.5 text-sm theme-text-secondary leading-[1.7]"
                                >
                                  <CheckCircle2
                                    className={`w-4 h-4 shrink-0 mt-1 ${
                                      isImplemented ? 'text-emerald-400' : 'theme-accent-text'
                                    }`}
                                  />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Target Audience & Value Proposition Footer inside Specification Matrix */}
                {((project.targetAudienceAr && project.targetAudienceAr.length > 0) ||
                  project.valuePropositionAr) && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
                    {project.targetAudienceAr && project.targetAudienceAr.length > 0 && (
                      <div className="lg:col-span-6 p-5 rounded-2xl theme-bg-surface border theme-border space-y-3">
                        <h4 className="text-sm font-extrabold theme-accent-text uppercase tracking-wider">
                          {isAr ? 'الفئات المستهدفة للمنصة' : 'Target Audience & Segments'}
                        </h4>
                        <ul className="space-y-2">
                          {(isAr ? project.targetAudienceAr : project.targetAudienceEn || []).map(
                            (aud, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-sm font-medium theme-text-primary leading-relaxed"
                              >
                                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shrink-0 mt-2" />
                                <span>{aud}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {(project.valuePropositionAr || project.valuePropositionEn) && (
                      <div className="lg:col-span-6 p-5 rounded-2xl theme-bg-surface border theme-border flex flex-col justify-between space-y-3">
                        <h4 className="text-sm font-extrabold theme-accent-text uppercase tracking-wider">
                          {isAr ? 'القيمة المضافة للمشروع' : 'Core Project Value Proposition'}
                        </h4>
                        <p className="text-sm sm:text-base font-semibold theme-text-primary leading-[1.85]">
                          {isAr ? project.valuePropositionAr : project.valuePropositionEn}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Engineering Case Study Deep Dive */}
            {project.caseStudy && (
              <div className="p-7 rounded-2xl theme-card-elevated space-y-6 border theme-border">
                <div className="flex items-center justify-between gap-4 border-b theme-border pb-4">
                  <h3 className="text-xl font-extrabold theme-text-primary leading-snug flex items-center gap-2.5">
                    <Layers className="w-6 h-6 theme-accent-text" />
                    <span>
                      {isAr
                        ? 'دراسة الحالة والمعمارية الهندسية المتقدمة'
                        : 'Advanced Engineering Case Study & Architecture'}
                    </span>
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-mono-tabular text-xs font-bold">
                    SYSTEM ARCHITECTURE
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold theme-accent-text">
                    {isAr
                      ? 'التحدي الهندسي ونطاق النظام'
                      : 'Engineering Problem & System Scope'}
                  </h4>
                  <p className="text-base font-normal theme-text-secondary leading-[1.85]">
                    {isAr
                      ? project.caseStudy.problemStatementAr
                      : project.caseStudy.problemStatementEn}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold theme-accent-text">
                    {isAr ? 'الطبقات المعمارية للنظام' : 'System Architecture Layers'}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {(isAr
                      ? project.caseStudy.architectureLayersAr
                      : project.caseStudy.architectureLayersEn
                    ).map((layer, idx) => (
                      <div key={idx} className="p-4 rounded-xl theme-bg-surface border theme-border flex items-start gap-3">
                        <span className="px-2.5 py-1 rounded-lg theme-bg-elevated font-mono-tabular theme-accent-text text-xs font-extrabold shrink-0">
                          0{idx + 1}
                        </span>
                        <span className="text-sm font-medium theme-text-primary leading-[1.7]">{layer}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold theme-accent-text">
                    {isAr
                      ? 'المساهمات الهندسية الأساسية'
                      : 'Key Engineering Contributions'}
                  </h4>
                  <ul className="space-y-2.5">
                    {(isAr
                      ? project.caseStudy.keyEngineeringContributionsAr
                      : project.caseStudy.keyEngineeringContributionsEn
                    ).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl theme-bg-surface border theme-border">
                        <CheckCircle2 className="w-5 h-5 theme-accent-text shrink-0 mt-0.5" />
                        <span className="text-sm font-medium theme-text-primary leading-[1.7]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 5-Point Link Verification Matrix */}
            <div className="p-7 rounded-2xl theme-card-elevated space-y-5 border theme-border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b theme-border pb-4">
                <h3 className="text-lg font-extrabold theme-text-primary flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 theme-accent-text shrink-0" />
                  <span>{t.modalVerificationHeading}</span>
                </h3>
                <span className="text-xs font-bold theme-text-secondary px-3 py-1 rounded-full theme-bg-surface border theme-border">
                  {isAr ? v.statusSummaryAr : v.statusSummaryEn}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl theme-bg-surface border theme-border space-y-1.5">
                  <div className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">{t.modalUrlSupplied}</div>
                  <div className="font-semibold theme-text-primary break-all font-mono-tabular leading-relaxed text-sm">
                    {v.suppliedUrl ||
                      (isAr ? 'غير مزود (دراسة حالة)' : 'None supplied (Case Study)')}
                  </div>
                </div>

                <div className="p-4 rounded-xl theme-bg-surface border theme-border space-y-1.5">
                  <div className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">{t.modalUrlOpened}</div>
                  <div className="font-semibold theme-text-primary leading-relaxed text-sm">{formatUrlOpened()}</div>
                </div>

                <div className="p-4 rounded-xl theme-bg-surface border theme-border space-y-1.5">
                  <div className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">{t.modalInterfaceObserved}</div>
                  <div className="font-semibold theme-text-primary leading-relaxed text-sm">
                    {formatInterfaceObserved()}
                  </div>
                </div>

                <div className="p-4 rounded-xl theme-bg-surface border theme-border space-y-1.5">
                  <div className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">{t.modalWorkflowsTested}</div>
                  <div className="font-semibold theme-text-primary leading-relaxed text-sm">
                    {v.workflowsTested
                      ? isAr
                        ? 'تم الاختبار'
                        : 'Tested'
                      : isAr
                      ? 'لم يتم اختبار المسارات الداخلية بعد'
                      : 'Core workflows not yet tested'}
                  </div>
                </div>

                <div className="p-4 rounded-xl theme-bg-surface border theme-border sm:col-span-2 space-y-1.5">
                  <div className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">{t.modalPublicAccess}</div>
                  <div className="font-semibold theme-text-primary leading-relaxed text-sm">
                    {formatPublicAccess()}
                  </div>
                </div>
              </div>

              {v.alternativeUrl && (
                <div className="p-4 rounded-xl theme-bg-surface border theme-border text-xs space-y-1.5">
                  <div className="font-bold theme-accent-text text-sm">
                    {t.modalAltUrlLabel}
                  </div>
                  <div className="font-mono-tabular break-all theme-text-primary text-sm font-semibold">
                    {v.alternativeUrl}
                  </div>
                  <div className="theme-text-secondary">
                    {isAr ? v.alternativeUrlStatusAr : v.alternativeUrlStatusEn}
                  </div>
                </div>
              )}

              <p className="text-sm theme-text-muted leading-[1.8]">
                {isAr ? v.verificationNotesAr : v.verificationNotesEn}
              </p>
            </div>

            {/* Epistemic Separation: Verified Facts vs Unverified Boundaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl theme-card-elevated space-y-3 border theme-border">
                <h4 className="text-sm font-extrabold theme-text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 theme-accent-text shrink-0" />
                  <span>{t.modalVerifiedFacts}</span>
                </h4>
                <ul className="space-y-2 text-sm theme-text-secondary">
                  {(isAr ? project.verifiedFactsAr : project.verifiedFactsEn).map(
                    (fact, i) => (
                      <li key={i} className="leading-[1.75] flex items-start gap-2">
                        <span className="text-[var(--accent-primary)] font-bold">•</span>
                        <span>{fact}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="p-6 rounded-2xl theme-card-elevated space-y-3 border theme-border">
                <h4 className="text-sm font-extrabold theme-text-primary flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 theme-text-muted shrink-0" />
                  <span>{t.modalUnverifiedScope}</span>
                </h4>
                <p className="text-sm theme-text-muted leading-[1.8]">
                  {isAr
                    ? project.unverifiedBoundariesAr
                    : project.unverifiedBoundariesEn}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Modal Footer Actions — Generous Padding & Distinct CTA Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6 theme-bg-elevated border-t theme-border shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl theme-btn-secondary text-sm font-bold cursor-pointer"
              >
                {t.modalClose}
              </button>

              <button
                type="button"
                onClick={handleInquireProject}
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl theme-btn-secondary text-sm font-bold cursor-pointer hover:border-[var(--accent-primary)]"
              >
                <MessageSquare className="w-4 h-4 theme-accent-text" />
                <span>{isAr ? 'طلب مشروع مماثل' : 'Inquire Similar Project'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {project.sourceUrl && project.sourceUrl.trim().length > 0 && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl theme-btn-secondary text-sm font-bold shadow-md"
                >
                  <Code2 className="w-4 h-4" aria-hidden="true" />
                  <span>{t.modalSourceCodeBtn}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl theme-btn-primary text-sm font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  <span>{t.visitProject}</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* High-Resolution Fullscreen Lightbox Overlay */}
      {lightboxOpen && activeDisplayImage && (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md select-none"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'معاينة الصورة بالحجم الكامل' : 'Full-Screen Image Lightbox'}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Lightbox Navigation Bar */}
          <div
            className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10 z-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-mono text-xs font-bold shrink-0">
                {activeLightboxIndex + 1} / {allDisplayImages.length}
              </span>
              <span className="text-base font-semibold text-white/95 truncate max-w-[55vw]">
                {activeDisplayImage.alt}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label={isAr ? 'إغلاق المعاينة' : 'Close full-screen'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Center Stage with Prev / Image / Next */}
          <div
            className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {allDisplayImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxPrev();
                }}
                className="absolute left-4 sm:left-8 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md"
                aria-label={isAr ? 'الصورة السابقة' : 'Previous image'}
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            <div className="relative max-h-full max-w-full flex flex-col items-center justify-center gap-4">
              <img
                src={activeDisplayImage.url}
                alt={activeDisplayImage.alt}
                className="max-h-[75vh] sm:max-h-[80vh] max-w-[94vw] object-contain rounded-xl shadow-2xl transition-all"
              />

              {/* Lightbox Pagination Dots */}
              {allDisplayImages.length > 1 && (
                <div
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/70 border border-white/15 backdrop-blur-md"
                  role="tablist"
                  aria-label={isAr ? 'مؤشرات الصور في العرض المكبر' : 'Lightbox pagination dots'}
                >
                  {allDisplayImages.map((img, idx) => {
                    const isActive = activeLightboxIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={
                          isAr
                            ? `الصورة ${idx + 1} من ${allDisplayImages.length}`
                            : `Image ${idx + 1} of ${allDisplayImages.length}`
                        }
                        title={img.label}
                        onClick={() => handleSelectModalSlide(idx)}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'w-6 h-2 bg-[var(--accent-primary)]'
                            : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {allDisplayImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxNext();
                }}
                className="absolute right-4 sm:right-8 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md"
                aria-label={isAr ? 'الصورة التالية' : 'Next image'}
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>

          {/* Bottom Lightbox Bar: Thumbnails & Navigation Hint */}
          <div
            className="px-6 py-4 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-white/70">
              {isAr
                ? 'استخدم مفاتيح الأسهم ← → للتنقل · Esc للإغلاق'
                : 'Use arrow keys ← → to navigate · Esc to close'}
            </div>

            {allDisplayImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto max-w-full py-1">
                {allDisplayImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveLightboxIndex(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 w-20 ${MODAL_GALLERY_ASPECT.aspectRatioClass} ${
                      activeLightboxIndex === idx
                        ? 'border-[var(--accent-primary)] ring-4 ring-[var(--accent-primary)]/50 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className={MODAL_GALLERY_ASPECT.imageClass}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
