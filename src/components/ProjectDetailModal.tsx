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
} from 'lucide-react';
import {
  Language,
  ProjectGalleryItem,
  ProjectItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { ProjectVisualPreview } from './ProjectVisualPreview';
import { fetchProjectGalleryItems } from '../lib/portfolioService';

export interface ProjectDetailModalProps {
  project: ProjectItem | null;
  lang: Language;
  onClose: () => void;
  isAdminPreview?: boolean;
  preloadedGallery?: ProjectGalleryItem[];
  onInquireService?: (serviceTitle: string) => void;
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
}) => {
  const isAr = lang === 'ar';
  const t = UI_TRANSLATIONS[lang].projects;
  const [galleryItems, setGalleryItems] = useState<ProjectGalleryItem[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  // Fullscreen Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);

  useEffect(() => {
    if (!project) return;
    setSelectedGalleryImage(null);
    setLightboxOpen(false);
    setActiveLightboxIndex(0);

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

    const mainUrl =
      project.genuineScreenshotPath ||
      project.thumbnailUrl ||
      '';
    if (mainUrl && !seen.has(mainUrl)) {
      seen.add(mainUrl);
      list.push({
        url: mainUrl,
        alt: isAr
          ? project.thumbnailAltAr || project.nameAr
          : project.thumbnailAltEn || project.nameEn,
        label: isAr ? 'الصورة الرئيسية' : 'Main Thumbnail',
      });
    }

    galleryItems.forEach((item, index) => {
      if (item.dataUrl && !seen.has(item.dataUrl)) {
        seen.add(item.dataUrl);
        list.push({
          url: item.dataUrl,
          alt: isAr
            ? item.altAr || `${project.nameAr} - ${index + 1}`
            : item.altEn || `${project.nameEn} - ${index + 1}`,
          label: isAr ? `لقطة شاشة ${index + 1}` : `Screenshot ${index + 1}`,
        });
      }
    });

    return list;
  }, [project, galleryItems, isAr]);

  const activeDisplayImage = allDisplayImages[activeLightboxIndex] || allDisplayImages[0];

  const handleLightboxPrev = () => {
    if (allDisplayImages.length <= 1) return;
    setActiveLightboxIndex((prev) => (prev > 0 ? prev - 1 : allDisplayImages.length - 1));
  };

  const handleLightboxNext = () => {
    if (allDisplayImages.length <= 1) return;
    setActiveLightboxIndex((prev) => (prev < allDisplayImages.length - 1 ? prev + 1 : 0));
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
      {/* Primary Project Detail Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-3xl theme-bg-surface theme-text-primary rounded-2xl border theme-border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Modal Header */}
          <div className="flex items-start justify-between gap-4 px-6 py-5 theme-bg-elevated border-b theme-border shrink-0">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs theme-accent-text font-semibold leading-normal">
                <span>{isAr ? project.categoryLabelAr : project.categoryLabelEn}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{project.illustrativeTheme.domainCode}</span>
                {isAdminPreview && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 font-semibold">
                      {project.status === 'draft'
                        ? isAr
                          ? 'معاينة مسودة (غير منشور للعامة)'
                          : 'DRAFT PREVIEW'
                        : isAr
                        ? 'معاينة منشور'
                        : 'PUBLISHED PREVIEW'}
                    </span>
                  </>
                )}
              </div>

              <h2
                id="modal-project-title"
                className="font-display"
              >
                <span className="block text-xl sm:text-2xl font-extrabold theme-text-primary leading-[1.28] tracking-tight">
                  {primaryTitle}
                </span>
                {subtitle && (
                  <span className="block text-xs sm:text-sm font-medium theme-text-secondary mt-1 leading-[1.45]">
                    {subtitle}
                  </span>
                )}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.modalClose}
              className="p-2 rounded-lg theme-btn-secondary cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Visual Preview Container with Fullscreen Zoom Trigger */}
            <div className="relative group rounded-xl overflow-hidden border theme-border">
              <ProjectVisualPreview
                project={project}
                lang={lang}
                overrideImageUrl={selectedGalleryImage}
                heightClass="h-64 sm:h-80"
                priorityLoading={true}
              />

              {allDisplayImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => openLightboxWithImage(selectedGalleryImage || allDisplayImages[0].url)}
                  className="absolute top-3 end-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-semibold shadow-lg backdrop-blur-sm transition-all cursor-pointer border border-white/20"
                  aria-label={isAr ? 'عرض في المعاينة المكبرة' : 'View in full-screen Lightbox'}
                >
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isAr ? 'تكبير كامل' : 'Expand / Zoom'}</span>
                </button>
              )}
            </div>

            {/* Project Gallery Thumbnails Strip (When Multiple Images Exist) */}
            {allDisplayImages.length > 1 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold theme-text-primary">
                  <span className="flex items-center gap-1.5">
                    <Images className="w-4 h-4 theme-accent-text" aria-hidden="true" />
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
                      className="theme-accent-text hover:underline cursor-pointer"
                    >
                      {isAr ? 'العودة للصورة الرئيسية' : 'Reset to Main Thumbnail'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {allDisplayImages.map((imgItem, idx) => {
                    const isSelected =
                      (selectedGalleryImage === imgItem.url) ||
                      (!selectedGalleryImage && idx === 0);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedGalleryImage(imgItem.url);
                          setActiveLightboxIndex(idx);
                        }}
                        className={`group relative rounded-lg overflow-hidden border-2 text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/30'
                            : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                        }`}
                      >
                        <img
                          src={imgItem.url}
                          alt={imgItem.alt}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-20 object-cover"
                        />
                        <div className="px-2 py-1 theme-bg-elevated text-[10px] theme-text-secondary truncate flex items-center justify-between">
                          <span className="truncate">{imgItem.label}</span>
                          {idx === 0 && (
                            <span className="text-[9px] font-semibold theme-accent-text shrink-0">
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

            {/* Structured Multi-Paragraph Description & Engineering Role */}
            <div className="space-y-4">
              <div className="space-y-3">
                {descriptionParagraphs.map((para, idx) => {
                  const isCallout =
                    para.startsWith('الهدف:') ||
                    para.startsWith('حالة المشروع:') ||
                    para.startsWith('Project Objective:') ||
                    para.startsWith('Project Status:');

                  if (isCallout) {
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl theme-bg-elevated border theme-border text-xs sm:text-sm font-medium theme-text-primary leading-[1.72]"
                      >
                        {para}
                      </div>
                    );
                  }

                  return (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? 'text-base sm:text-[16.5px] font-medium theme-text-primary leading-[1.78]'
                          : 'text-sm sm:text-[15px] font-normal theme-text-secondary leading-[1.78]'
                      }
                    >
                      {para}
                    </p>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl theme-card-elevated space-y-1.5">
                <h3 className="text-xs font-semibold theme-accent-text tracking-wide">
                  {t.modalEngineeringRole}
                </h3>
                <p className="text-sm sm:text-[14.5px] font-normal theme-text-primary leading-[1.7]">
                  {isAr
                    ? project.engineeringContributionAr
                    : project.engineeringContributionEn}
                </p>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-sm font-bold theme-text-primary mb-2.5 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 theme-accent-text shrink-0" />
                <span>{t.modalTechStack}</span>
              </h3>
              {project.technologies.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium leading-relaxed">
                  {project.technologies.map((tech, idx) => (
                    <React.Fragment key={tech}>
                      {idx > 0 && <span className="theme-text-muted">·</span>}
                      <span className="font-mono-tabular theme-accent-text">{tech}</span>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-xs theme-text-muted leading-relaxed">{t.modalTechNotClaimed}</p>
              )}
            </div>

            {/* Engineering Case Study Deep Dive */}
            {project.caseStudy && (
              <div className="p-5 rounded-xl theme-card-elevated space-y-4">
                <div className="flex items-center justify-between gap-2 border-b theme-border pb-3">
                  <h3 className="text-base font-bold theme-text-primary leading-snug">
                    {isAr
                      ? 'تفاصيل دراسة الحالة والمعمارية الهندسية'
                      : 'Engineering Case Study & System Architecture'}
                  </h3>
                  <span className="text-xs font-mono-tabular theme-accent-text font-semibold">
                    ARCHITECTURE
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold theme-accent-text mb-1.5">
                    {isAr
                      ? 'التحدي الهندسي ونطاق النظام'
                      : 'Engineering Problem & System Scope'}
                  </h4>
                  <p className="text-sm font-normal theme-text-secondary leading-[1.75]">
                    {isAr
                      ? project.caseStudy.problemStatementAr
                      : project.caseStudy.problemStatementEn}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold theme-accent-text mb-2">
                    {isAr ? 'الطبقات المعمارية للنظام' : 'System Architecture Layers'}
                  </h4>
                  <ul className="space-y-2 text-sm font-normal theme-text-secondary leading-[1.72]">
                    {(isAr
                      ? project.caseStudy.architectureLayersAr
                      : project.caseStudy.architectureLayersEn
                    ).map((layer, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono-tabular theme-accent-text text-xs font-semibold mt-1 shrink-0">
                          0{idx + 1}.
                        </span>
                        <span>{layer}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold theme-accent-text mb-2">
                    {isAr
                      ? 'المساهمات الهندسية'
                      : 'Key Engineering Contributions'}
                  </h4>
                  <ul className="space-y-2 text-sm font-normal theme-text-secondary leading-[1.72]">
                    {(isAr
                      ? project.caseStudy.keyEngineeringContributionsAr
                      : project.caseStudy.keyEngineeringContributionsEn
                    ).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 theme-accent-text shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 5-Point Link Verification Matrix */}
            <div className="p-5 rounded-xl theme-card-elevated space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold theme-text-primary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 theme-accent-text shrink-0" />
                  <span>{t.modalVerificationHeading}</span>
                </h3>
                <span className="text-xs font-medium theme-text-secondary">
                  {isAr ? v.statusSummaryAr : v.statusSummaryEn}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg theme-bg-surface border theme-border">
                  <div className="theme-text-muted mb-1">{t.modalUrlSupplied}</div>
                  <div className="font-medium theme-text-primary break-all font-mono-tabular leading-snug">
                    {v.suppliedUrl ||
                      (isAr ? 'غير مزود (دراسة حالة)' : 'None supplied (Case Study)')}
                  </div>
                </div>

                <div className="p-3 rounded-lg theme-bg-surface border theme-border">
                  <div className="theme-text-muted mb-1">{t.modalUrlOpened}</div>
                  <div className="font-medium theme-text-primary leading-snug">{formatUrlOpened()}</div>
                </div>

                <div className="p-3 rounded-lg theme-bg-surface border theme-border">
                  <div className="theme-text-muted mb-1">{t.modalInterfaceObserved}</div>
                  <div className="font-medium theme-text-primary leading-snug">
                    {formatInterfaceObserved()}
                  </div>
                </div>

                <div className="p-3 rounded-lg theme-bg-surface border theme-border">
                  <div className="theme-text-muted mb-1">{t.modalWorkflowsTested}</div>
                  <div className="font-medium theme-text-primary leading-snug">
                    {v.workflowsTested
                      ? isAr
                        ? 'تم الاختبار'
                        : 'Tested'
                      : isAr
                      ? 'لم يتم اختبار المسارات الداخلية بعد'
                      : 'Core workflows not yet tested'}
                  </div>
                </div>

                <div className="p-3 rounded-lg theme-bg-surface border theme-border sm:col-span-2">
                  <div className="theme-text-muted mb-1">{t.modalPublicAccess}</div>
                  <div className="font-medium theme-text-primary leading-snug">
                    {formatPublicAccess()}
                  </div>
                </div>
              </div>

              {v.alternativeUrl && (
                <div className="p-3 rounded-lg theme-bg-surface border theme-border text-xs space-y-1">
                  <div className="font-semibold theme-accent-text">
                    {t.modalAltUrlLabel}
                  </div>
                  <div className="font-mono-tabular break-all theme-text-primary">
                    {v.alternativeUrl}
                  </div>
                  <div className="theme-text-secondary">
                    {isAr ? v.alternativeUrlStatusAr : v.alternativeUrlStatusEn}
                  </div>
                </div>
              )}

              <p className="text-xs theme-text-muted leading-[1.7]">
                {isAr ? v.verificationNotesAr : v.verificationNotesEn}
              </p>
            </div>

            {/* Epistemic Separation: Verified Facts vs Unverified Boundaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl theme-card-elevated space-y-2.5">
                <h4 className="text-xs font-bold theme-text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 theme-accent-text shrink-0" />
                  <span>{t.modalVerifiedFacts}</span>
                </h4>
                <ul className="space-y-1.5 text-xs theme-text-secondary">
                  {(isAr ? project.verifiedFactsAr : project.verifiedFactsEn).map(
                    (fact, i) => (
                      <li key={i} className="leading-[1.7]">
                        • {fact}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="p-4 rounded-xl theme-card-elevated space-y-2.5">
                <h4 className="text-xs font-bold theme-text-primary flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 theme-text-muted shrink-0" />
                  <span>{t.modalUnverifiedScope}</span>
                </h4>
                <p className="text-xs theme-text-muted leading-[1.7]">
                  {isAr
                    ? project.unverifiedBoundariesAr
                    : project.unverifiedBoundariesEn}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Modal Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 theme-bg-elevated border-t theme-border shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer"
              >
                {t.modalClose}
              </button>

              <button
                type="button"
                onClick={handleInquireProject}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer hover:border-[var(--accent-primary)]"
              >
                <MessageSquare className="w-3.5 h-3.5 theme-accent-text" />
                <span>{isAr ? 'طلب مشروع مماثل' : 'Inquire Similar Project'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {project.sourceUrl && project.sourceUrl.trim().length > 0 && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg theme-btn-secondary text-xs font-semibold"
                >
                  <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.modalSourceCodeBtn}</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg theme-btn-primary text-xs font-semibold"
                >
                  <span>{t.visitProject}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
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
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/10 z-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-xs font-semibold shrink-0">
                {activeLightboxIndex + 1} / {allDisplayImages.length}
              </span>
              <span className="text-sm font-medium text-white/90 truncate max-w-[55vw]">
                {activeDisplayImage.alt}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label={isAr ? 'إغلاق المعاينة' : 'Close full-screen'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage with Prev / Image / Next */}
          <div
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {allDisplayImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxPrev();
                }}
                className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
                aria-label={isAr ? 'الصورة السابقة' : 'Previous image'}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative max-h-full max-w-full flex items-center justify-center">
              <img
                src={activeDisplayImage.url}
                alt={activeDisplayImage.alt}
                className="max-h-[75vh] sm:max-h-[82vh] max-w-[92vw] object-contain rounded-lg shadow-2xl transition-all"
              />
            </div>

            {allDisplayImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxNext();
                }}
                className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
                aria-label={isAr ? 'الصورة التالية' : 'Next image'}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Lightbox Bar: Thumbnails & Navigation Hint */}
          <div
            className="px-4 py-3 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] text-white/60">
              {isAr
                ? 'استخدم مفاتيح الأسهم ← → للتنقل · Esc للإغلاق'
                : 'Use arrow keys ← → to navigate · Esc to close'}
            </div>

            {allDisplayImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
                {allDisplayImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveLightboxIndex(idx)}
                    className={`relative rounded-md overflow-hidden border-2 transition-all cursor-pointer shrink-0 w-12 h-10 ${
                      activeLightboxIndex === idx
                        ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/50 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
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
