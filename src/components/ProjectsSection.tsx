import React, { useDeferredValue, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  Language,
  PROJECT_CATEGORIES,
  ProjectCategory,
  ProjectItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { ProjectCard } from './ProjectCard';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  lang: Language;
  onSelectProject: (project: ProjectItem) => void;
  showDedicatedDomainBreakdowns?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = React.memo(
  ({
    projects,
    lang,
    onSelectProject,
    showDedicatedDomainBreakdowns = true,
  }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].projects;
    const [selectedCategory, setSelectedCategory] =
      useState<ProjectCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const deferredSearch = useDeferredValue(searchQuery);

    const publishedProjects = useMemo(
      () =>
        projects
          .filter((p) => p.status !== 'draft')
          .sort((a, b) => a.displayOrder - b.displayOrder),
      [projects]
    );

    const filteredProjects = useMemo(() => {
      const q = deferredSearch.trim().toLowerCase();
      return publishedProjects.filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        if (q.length > 0) {
          const matchAr = p.nameAr.toLowerCase().includes(q);
          const matchEn = p.nameEn.toLowerCase().includes(q);
          const matchDescAr = p.descriptionAr.toLowerCase().includes(q);
          const matchDescEn = p.descriptionEn.toLowerCase().includes(q);
          const matchTech = p.technologies.some((tech) =>
            tech.toLowerCase().includes(q)
          );
          return matchAr || matchEn || matchDescAr || matchDescEn || matchTech;
        }
        return true;
      });
    }, [publishedProjects, selectedCategory, deferredSearch]);

    const ecommerceProjects = useMemo(
      () => publishedProjects.filter((p) => p.category === 'e-commerce'),
      [publishedProjects]
    );

    const webEdHealthProjects = useMemo(
      () =>
        publishedProjects.filter(
          (p) =>
            p.category === 'web-development' ||
            p.category === 'education-tech' ||
            p.category === 'healthcare-tech'
        ),
      [publishedProjects]
    );

    const engineeringCaseStudies = useMemo(
      () =>
        publishedProjects.filter(
          (p) =>
            p.category === 'enterprise-accounting' || p.category === 'ai-iot'
        ),
      [publishedProjects]
    );

    return (
      <div className="theme-bg-primary">
        {/* Main Filterable Portfolio Gallery */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 theme-section-spacing">
          <div className="max-w-3xl space-y-3 mb-10">
            <div className="text-xs font-semibold theme-accent-text tracking-wide">
              {t.sectionKicker}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight theme-text-primary">
              {t.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base theme-text-secondary leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Interactive Category Filter Controls & Deferred Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-5 border-b theme-border">
            <div
              role="tablist"
              aria-label={t.filterLabel}
              className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl theme-card-elevated"
            >
              {PROJECT_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'theme-btn-primary shadow-xs'
                        : 'theme-text-secondary hover:theme-text-primary'
                    }`}
                  >
                    {isAr ? cat.labelAr : cat.labelEn}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="w-4 h-4 theme-text-muted absolute top-1/2 -translate-y-1/2 start-3"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ابحث في المشاريع أو التقنيات...'
                      : 'Search projects or tech...'
                  }
                  aria-label={
                    isAr
                      ? 'بحث في المشاريع البرمجية'
                      : 'Search portfolio projects'
                  }
                  className="w-full ps-9 pe-8 py-2 rounded-xl theme-input text-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                    className="absolute top-1/2 -translate-y-1/2 end-2.5 theme-text-muted hover:theme-text-primary cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-xs theme-text-muted font-mono-tabular shrink-0">
                {t.showingCount} {filteredProjects.length} {t.ofCount}{' '}
                {publishedProjects.length} {t.projectsWord}
              </div>
            </div>
          </div>

          {/* Filtered Project Cards Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  lang={lang}
                  onSelectProject={onSelectProject}
                  priorityLoading={idx < 2}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl theme-card text-center py-12 space-y-3">
              <p className="text-sm font-semibold theme-text-primary">
                {isAr
                  ? 'لا توجد مشاريع مطابقة لمعايير البحث أو التصفية الحالية.'
                  : 'No projects match the current filter or search query.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
              >
                {isAr ? 'إعادة ضبط التصفية' : 'Reset Filters'}
              </button>
            </div>
          )}
        </section>

        {/* Dedicated Domain Breakdowns */}
        {showDedicatedDomainBreakdowns &&
          selectedCategory === 'all' &&
          !deferredSearch.trim() && (
            <div className="border-t theme-border theme-bg-surface">
              {/* C. Dedicated E-Commerce Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b theme-border">
                <div className="max-w-2xl space-y-2 mb-8">
                  <div className="text-xs font-mono-tabular theme-accent-text">
                    {isAr
                      ? '01. المتاجر الإلكترونية والتجارة الرقمية'
                      : '01. E-Commerce & Digital Stores'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold theme-text-primary">
                    {t.ecommerceTitle}
                  </h3>
                  <p className="text-sm theme-text-secondary">
                    {t.ecommerceSubtitle}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 theme-grid-gap">
                  {ecommerceProjects.map((project) => (
                    <ProjectCard
                      key={`ecom-${project.id}`}
                      project={project}
                      lang={lang}
                      onSelectProject={onSelectProject}
                    />
                  ))}
                </div>
              </section>

              {/* D. Dedicated Web, Education & Healthcare Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b theme-border">
                <div className="max-w-2xl space-y-2 mb-8">
                  <div className="text-xs font-mono-tabular theme-accent-text">
                    {isAr
                      ? '02. منصات الويب والتعليم والصحة'
                      : '02. Web, EdTech & Healthcare Platforms'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold theme-text-primary">
                    {t.webAndPlatformsTitle}
                  </h3>
                  <p className="text-sm theme-text-secondary">
                    {t.webAndPlatformsSubtitle}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 theme-grid-gap">
                  {webEdHealthProjects.map((project) => (
                    <ProjectCard
                      key={`web-${project.id}`}
                      project={project}
                      lang={lang}
                      onSelectProject={onSelectProject}
                    />
                  ))}
                </div>
              </section>

              {/* Documented Engineering Case Studies (From CV) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="max-w-2xl space-y-2 mb-8">
                  <div className="text-xs font-mono-tabular theme-accent-text">
                    {isAr
                      ? '03. دراسات الحالة الهندسية الموثقة'
                      : '03. Documented Engineering Case Studies'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold theme-text-primary">
                    {t.caseStudiesTitle}
                  </h3>
                  <p className="text-sm theme-text-secondary">
                    {t.caseStudiesSubtitle}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 theme-grid-gap">
                  {engineeringCaseStudies.map((project) => (
                    <ProjectCard
                      key={`cs-${project.id}`}
                      project={project}
                      lang={lang}
                      onSelectProject={onSelectProject}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
      </div>
    );
  }
);
