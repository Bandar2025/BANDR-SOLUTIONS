import React, { useEffect, useState } from 'react';
import {
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  ShieldCheck,
  Code2,
  Images,
} from 'lucide-react';
import {
  Language,
  ProjectGalleryItem,
  ProjectItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { ProjectVisualPreview } from './ProjectVisualPreview';
import { fetchProjectGalleryItems } from '../lib/portfolioService';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  lang: Language;
  onClose: () => void;
  isAdminPreview?: boolean;
  preloadedGallery?: ProjectGalleryItem[];
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  lang,
  onClose,
  isAdminPreview = false,
  preloadedGallery,
}) => {
  const isAr = lang === 'ar';
  const t = UI_TRANSLATIONS[lang].projects;
  const [galleryItems, setGalleryItems] = useState<ProjectGalleryItem[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;
    setSelectedGalleryImage(null);

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

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

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
      return isAr ? 'موثق معمارياً في السيرة الذاتية' : 'Documented architecturally in CV';
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl theme-bg-surface theme-text-primary rounded-2xl border theme-border shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 theme-bg-elevated border-b theme-border shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs theme-accent-text font-medium">
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
              className="text-lg sm:text-xl font-bold theme-text-primary truncate mt-0.5"
            >
              {isAr ? project.nameAr : project.nameEn}
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
          {/* Visual Preview or Genuine Screenshot */}
          <div className="rounded-xl overflow-hidden border theme-border">
            <ProjectVisualPreview
              project={project}
              lang={lang}
              overrideImageUrl={selectedGalleryImage}
              heightClass="h-60 sm:h-72"
              priorityLoading={true}
            />
          </div>

          {/* Project Gallery Thumbnails (When Gallery Images Exist) */}
          {galleryItems.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold theme-text-primary">
                <span className="flex items-center gap-1.5">
                  <Images className="w-4 h-4 theme-accent-text" aria-hidden="true" />
                  <span>{t.modalGalleryHeading}</span>
                </span>
                {selectedGalleryImage && (
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryImage(null)}
                    className="theme-accent-text hover:underline cursor-pointer"
                  >
                    {isAr ? 'العودة للصورة الرئيسية' : 'Reset to Main Thumbnail'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {galleryItems.map((item) => {
                  const active = selectedGalleryImage === item.dataUrl;
                  const itemAlt = isAr
                    ? item.altAr || project.nameAr
                    : item.altEn || project.nameEn;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedGalleryImage(item.dataUrl)}
                      className={`group relative rounded-lg overflow-hidden border-2 text-start transition-all cursor-pointer ${
                        active
                          ? 'border-[var(--accent-primary)]'
                          : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                      }`}
                    >
                      <img
                        src={item.dataUrl}
                        alt={itemAlt}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-20 object-cover"
                      />
                      <div className="px-2 py-1 theme-bg-elevated text-[10px] theme-text-secondary truncate">
                        {itemAlt}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Primary Description & Engineering Role */}
          <div className="space-y-3">
            <p className="text-base theme-text-secondary leading-relaxed">
              {isAr ? project.descriptionAr : project.descriptionEn}
            </p>
            <div className="p-4 rounded-xl theme-card-elevated">
              <h3 className="text-xs font-semibold theme-text-muted mb-1">
                {t.modalEngineeringRole}
              </h3>
              <p className="text-sm theme-text-primary">
                {isAr
                  ? project.engineeringContributionAr
                  : project.engineeringContributionEn}
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-sm font-bold theme-text-primary mb-2 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 theme-accent-text shrink-0" />
              <span>{t.modalTechStack}</span>
            </h3>
            {project.technologies.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {project.technologies.map((tech, idx) => (
                  <React.Fragment key={tech}>
                    {idx > 0 && <span className="theme-text-muted">·</span>}
                    <span className="font-mono-tabular theme-accent-text">{tech}</span>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-xs theme-text-muted">{t.modalTechNotClaimed}</p>
            )}
          </div>

          {/* Engineering Case Study Deep Dive (For Projects #8 and #9) */}
          {project.caseStudy && (
            <div className="p-5 rounded-xl theme-card-elevated space-y-4">
              <div className="flex items-center justify-between gap-2 border-b theme-border pb-3">
                <h3 className="text-base font-bold theme-text-primary">
                  {isAr
                    ? 'تفاصيل دراسة الحالة الهندسية (من السيرة الذاتية)'
                    : 'Engineering Case Study Architecture (CV)'}
                </h3>
                <span className="text-xs font-mono-tabular theme-accent-text">
                  CV-VERIFIED
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold theme-accent-text mb-1">
                  {isAr
                    ? 'التحدي الهندسي ونطاق النظام'
                    : 'Engineering Problem & System Scope'}
                </h4>
                <p className="text-sm theme-text-secondary leading-relaxed">
                  {isAr
                    ? project.caseStudy.problemStatementAr
                    : project.caseStudy.problemStatementEn}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold theme-accent-text mb-2">
                  {isAr ? 'الطبقات المعمارية للنظام' : 'System Architecture Layers'}
                </h4>
                <ul className="space-y-1.5 text-sm theme-text-secondary">
                  {(isAr
                    ? project.caseStudy.architectureLayersAr
                    : project.caseStudy.architectureLayersEn
                  ).map((layer, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono-tabular theme-accent-text text-xs mt-1">
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
                    ? 'المساهمات الهندسية الموثقة'
                    : 'Documented Engineering Contributions'}
                </h4>
                <ul className="space-y-1.5 text-sm theme-text-secondary">
                  {(isAr
                    ? project.caseStudy.keyEngineeringContributionsAr
                    : project.caseStudy.keyEngineeringContributionsEn
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 theme-accent-text shrink-0 mt-0.5" />
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
                <div className="theme-text-muted mb-0.5">{t.modalUrlSupplied}</div>
                <div className="font-medium theme-text-primary break-all font-mono-tabular">
                  {v.suppliedUrl ||
                    (isAr ? 'غير مزود (دراسة حالة)' : 'None supplied (Case Study)')}
                </div>
              </div>

              <div className="p-3 rounded-lg theme-bg-surface border theme-border">
                <div className="theme-text-muted mb-0.5">{t.modalUrlOpened}</div>
                <div className="font-medium theme-text-primary">{formatUrlOpened()}</div>
              </div>

              <div className="p-3 rounded-lg theme-bg-surface border theme-border">
                <div className="theme-text-muted mb-0.5">{t.modalInterfaceObserved}</div>
                <div className="font-medium theme-text-primary">
                  {formatInterfaceObserved()}
                </div>
              </div>

              <div className="p-3 rounded-lg theme-bg-surface border theme-border">
                <div className="theme-text-muted mb-0.5">{t.modalWorkflowsTested}</div>
                <div className="font-medium theme-text-primary">
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
                <div className="theme-text-muted mb-0.5">{t.modalPublicAccess}</div>
                <div className="font-medium theme-text-primary">
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

            <p className="text-xs theme-text-muted leading-relaxed">
              {isAr ? v.verificationNotesAr : v.verificationNotesEn}
            </p>
          </div>

          {/* Epistemic Separation: Verified Facts vs Unverified Boundaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl theme-card-elevated space-y-2">
              <h4 className="text-xs font-bold theme-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 theme-accent-text shrink-0" />
                <span>{t.modalVerifiedFacts}</span>
              </h4>
              <ul className="space-y-1.5 text-xs theme-text-secondary">
                {(isAr ? project.verifiedFactsAr : project.verifiedFactsEn).map(
                  (fact, i) => (
                    <li key={i} className="leading-relaxed">
                      • {fact}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="p-4 rounded-xl theme-card-elevated space-y-2">
              <h4 className="text-xs font-bold theme-text-primary flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 theme-text-muted shrink-0" />
                <span>{t.modalUnverifiedScope}</span>
              </h4>
              <p className="text-xs theme-text-muted leading-relaxed">
                {isAr
                  ? project.unverifiedBoundariesAr
                  : project.unverifiedBoundariesEn}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 theme-bg-elevated border-t theme-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer"
          >
            {t.modalClose}
          </button>

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
  );
};
