import React, { useMemo } from 'react';
import { ExternalLink, ArrowUpRight, BookOpen, ShieldCheck } from 'lucide-react';
import { Language, ProjectItem, UI_TRANSLATIONS } from '../data/portfolioData';
import { ProjectVisualPreview } from './ProjectVisualPreview';

interface ProjectCardProps {
  project: ProjectItem;
  lang: Language;
  onSelectProject: (project: ProjectItem) => void;
  priorityLoading?: boolean;
}

/**
 * Splits a project title on ' — ' into a primary brand identity and a descriptive subtitle
 * so cards maintain a clean, scannable typographic hierarchy.
 */
function parseProjectTitle(rawTitle: string): {
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
 * Extracts the first substantive summary paragraph from a multi-paragraph description,
 * skipping any leading line that merely repeats the project title.
 */
function extractLeadDescription(rawDesc: string, rawTitle: string): string {
  const paragraphs = rawDesc
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return rawDesc;

  const normalizedTitle = rawTitle.toLowerCase().trim();
  const firstPara = paragraphs[0];

  if (
    paragraphs.length > 1 &&
    (firstPara.toLowerCase() === normalizedTitle ||
      firstPara.includes(' — ') && firstPara.length < 95)
  ) {
    return paragraphs[1];
  }

  return firstPara;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ project, lang, onSelectProject, priorityLoading = false }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].projects;

    const rawTitle = isAr ? project.nameAr : project.nameEn;
    const rawDescription = isAr ? project.descriptionAr : project.descriptionEn;

    const { primaryTitle, subtitle } = useMemo(
      () => parseProjectTitle(rawTitle),
      [rawTitle]
    );

    const summaryText = useMemo(
      () => extractLeadDescription(rawDescription, rawTitle),
      [rawDescription, rawTitle]
    );

    return (
      <article className="group flex flex-col rounded-2xl theme-bg-surface border theme-border hover:border-[var(--accent-primary)] transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md">
        {/* Visual Preview / Genuine Screenshot (Fixed 16:10 Aspect Ratio with Shimmer Skeleton) */}
        <div
          className="w-full aspect-[16/10] overflow-hidden relative theme-bg-surface animate-skeleton-shimmer"
          style={{ aspectRatio: '16 / 10' }}
        >
          <ProjectVisualPreview
            project={project}
            lang={lang}
            priorityLoading={priorityLoading}
            aspectRatioClass="aspect-[16/10]"
            fitMode="contain"
          />
        </div>

        {/* Card Content */}
        <div
          className="flex-1 flex flex-col justify-between space-y-5"
          style={{ padding: 'var(--card-pad)' }}
        >
          <div className="space-y-3">
            {/* Unboxed Metadata with typographic separators (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs leading-normal theme-text-muted">
              <span className="font-semibold theme-accent-text">
                {isAr ? project.categoryLabelAr : project.categoryLabelEn}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                {String(project.displayOrder).padStart(2, '0')}
              </span>
              {project.technologies.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular theme-text-secondary">
                    {project.technologies.slice(0, 3).join(' / ')}
                  </span>
                </>
              )}
            </div>

            {/* Cohesive Project Brand Title & Subtitle Hierarchy */}
            <h3 className="font-display">
              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="text-start cursor-pointer w-full focus:outline-hidden group/title block"
              >
                <span className="block text-lg sm:text-[19px] font-bold theme-text-primary group-hover:theme-accent-text group-focus/title:underline leading-[1.32] tracking-tight transition-colors">
                  {primaryTitle}
                </span>
                {subtitle && (
                  <span className="block text-xs sm:text-[13px] font-medium theme-text-muted mt-1 leading-[1.45]">
                    {subtitle}
                  </span>
                )}
              </button>
            </h3>

            {/* Lead Summary Description with Balanced Line Height */}
            <p className="text-sm sm:text-[14.5px] font-normal theme-text-secondary leading-[1.72] line-clamp-3">
              {summaryText}
            </p>
          </div>

          <div className="space-y-3.5 pt-3.5 border-t theme-border">
            {/* Professional Verification Status Indicator (Semantic & Accessible) */}
            <div className="flex items-center gap-2 text-xs theme-text-muted leading-snug">
              <ShieldCheck
                className={`w-3.5 h-3.5 shrink-0 ${
                  project.isCaseStudyOnly
                    ? 'text-blue-400'
                    : project.genuineScreenshotPath
                    ? 'text-emerald-400'
                    : 'text-teal-400'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">
                {project.isCaseStudyOnly
                  ? isAr
                    ? 'دراسة حالة هندسية موثقة بالمعمارية'
                    : 'Documented Architectural Case Study'
                  : project.genuineScreenshotPath
                  ? isAr
                    ? 'واجهة حقيقية موثقة بلقطات الشاشة'
                    : 'Verified Interface with Screenshots'
                  : isAr
                  ? project.verification.statusSummaryAr
                  : project.verification.statusSummaryEn}
              </span>
            </div>

            {/* Card Actions with WCAG AA >= 40px touch targets */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap min-h-[40px] transition-colors"
              >
                <BookOpen
                  className="w-3.5 h-3.5 theme-accent-text shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {project.isCaseStudyOnly ? t.viewCaseStudy : t.viewDetails}
                </span>
              </button>

              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg theme-btn-primary text-xs font-semibold whitespace-nowrap shrink-0 min-h-[40px] transition-transform active:scale-95"
                >
                  <span>{t.visitProject}</span>
                  <ExternalLink
                    className="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                >
                  <span>{isAr ? 'عرض دراسة الحالة' : 'Case Study Details'}</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }
);
