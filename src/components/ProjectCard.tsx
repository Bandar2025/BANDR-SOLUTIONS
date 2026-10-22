import React from 'react';
import { ExternalLink, ArrowUpRight, BookOpen } from 'lucide-react';
import { Language, ProjectItem, UI_TRANSLATIONS } from '../data/portfolioData';
import { ProjectVisualPreview } from './ProjectVisualPreview';

interface ProjectCardProps {
  project: ProjectItem;
  lang: Language;
  onSelectProject: (project: ProjectItem) => void;
  priorityLoading?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ project, lang, onSelectProject, priorityLoading = false }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].projects;

    return (
      <article className="group flex flex-col rounded-2xl theme-bg-surface border theme-border hover:border-[var(--accent-primary)] transition-colors overflow-hidden shadow-xs">
        {/* Visual Preview / Genuine Screenshot */}
        <ProjectVisualPreview
          project={project}
          lang={lang}
          priorityLoading={priorityLoading}
        />

        {/* Card Content */}
        <div
          className="flex-1 flex flex-col justify-between space-y-5"
          style={{ padding: 'var(--card-pad)' }}
        >
          <div className="space-y-2.5">
            {/* Unboxed Metadata with typographic separators (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs theme-text-muted">
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
                    {project.technologies.slice(0, 4).join(' / ')}
                  </span>
                </>
              )}
            </div>

            {/* Project Title */}
            <h3 className="text-lg font-bold theme-text-primary group-hover:theme-accent-text transition-colors">
              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="text-start cursor-pointer"
              >
                {isAr ? project.nameAr : project.nameEn}
              </button>
            </h3>

            {/* Accurate Description */}
            <p className="text-sm theme-text-secondary leading-relaxed line-clamp-3">
              {isAr ? project.descriptionAr : project.descriptionEn}
            </p>
          </div>

          <div className="space-y-4 pt-3 border-t theme-border">
            {/* Neutral Link Verification Summary */}
            <div className="text-xs theme-text-muted leading-snug">
              {isAr
                ? project.verification.statusSummaryAr
                : project.verification.statusSummaryEn}
            </div>

            {/* Card Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold theme-text-primary hover:theme-accent-text transition-colors cursor-pointer whitespace-nowrap min-h-[36px]"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg theme-btn-primary text-xs font-semibold whitespace-nowrap shrink-0 min-h-[36px]"
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 min-h-[36px]"
                >
                  <span>{isAr ? 'توثيق هندسي' : 'Case Study'}</span>
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
