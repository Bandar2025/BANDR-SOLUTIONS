import React, { useDeferredValue, useMemo, useState } from 'react';
import { Search, X, Sparkles, ShoppingBag, Globe, Cpu } from 'lucide-react';
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

    // Filtered list when searching or filtering by specific category
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

    // Grouping projects by category domain to guarantee 0 duplicates
    const eCommerceProjects = useMemo(
      () => publishedProjects.filter((p) => p.category === 'e-commerce'),
      [publishedProjects]
    );

    const webPlatformsProjects = useMemo(
      () =>
        publishedProjects.filter(
          (p) =>
            p.category === 'web-development' ||
            p.category === 'education-tech' ||
            p.category === 'healthcare-tech'
        ),
      [publishedProjects]
    );

    const systemsAndAiProjects = useMemo(
      () =>
        publishedProjects.filter(
          (p) =>
            p.category === 'enterprise-accounting' || p.category === 'ai-iot'
        ),
      [publishedProjects]
    );

    const isCategorizedView =
      selectedCategory === 'all' && !deferredSearch.trim();

    return (
      <div className="theme-bg-primary">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Section Header */}
          <div className="max-w-3xl space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold theme-accent-text tracking-wide">
              <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.sectionKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight theme-text-primary">
              {t.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base theme-text-secondary leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Category Filter Tabs & Search Control */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-5 border-b theme-border">
            <div
              role="tablist"
              aria-label={t.filterLabel}
              className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl tech-nav-dock"
            >
              {PROJECT_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      active ? 'tech-nav-btn-active' : 'tech-nav-btn'
                    }`}
                  >
                    <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                    {active && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] shrink-0"
                        aria-hidden="true"
                      />
                    )}
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

          {/* Single Filtered Grid View when searching or selecting specific category */}
          {!isCategorizedView && (
            <div>
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap py-2">
                  {filteredProjects.map((project, idx) => (
                    <div
                      key={`filtered-${project.id}`}
                      className="relative hover:z-10 h-full"
                    >
                      <ProjectCard
                        project={project}
                        lang={lang}
                        onSelectProject={onSelectProject}
                        priorityLoading={idx < 2}
                      />
                    </div>
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
            </div>
          )}

          {/* Categorized Non-Repeating Showcase when Viewing "All" Categories */}
          {isCategorizedView && (
            <div className="space-y-16">
              {/* Category Section 1: E-Commerce */}
              {eCommerceProjects.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b theme-border">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 text-xs font-mono-tabular theme-accent-text">
                        <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>01. {isAr ? 'المتاجر الإلكترونية والتجارة الرقمية' : 'E-Commerce & Digital Stores'}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold theme-text-primary">
                        {t.ecommerceTitle}
                      </h3>
                      <p className="text-xs sm:text-sm theme-text-secondary">
                        {t.ecommerceSubtitle}
                      </p>
                    </div>
                    <span className="text-xs font-mono-tabular px-3 py-1 rounded-full theme-card-elevated theme-text-muted">
                      {eCommerceProjects.length} {isAr ? 'مشاريع' : 'projects'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap py-2">
                    {eCommerceProjects.map((project, idx) => (
                      <div
                        key={`cat-ecom-${project.id}`}
                        className="relative hover:z-10 h-full"
                      >
                        <ProjectCard
                          project={project}
                          lang={lang}
                          onSelectProject={onSelectProject}
                          priorityLoading={idx < 2}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Category Section 2: Web, Education & Healthcare Platforms */}
              {webPlatformsProjects.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b theme-border">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 text-xs font-mono-tabular theme-accent-text">
                        <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>02. {isAr ? 'منصات الويب والتعليم والصحة' : 'Web, EdTech & Healthcare Platforms'}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold theme-text-primary">
                        {t.webAndPlatformsTitle}
                      </h3>
                      <p className="text-xs sm:text-sm theme-text-secondary">
                        {t.webAndPlatformsSubtitle}
                      </p>
                    </div>
                    <span className="text-xs font-mono-tabular px-3 py-1 rounded-full theme-card-elevated theme-text-muted">
                      {webPlatformsProjects.length} {isAr ? 'مشاريع' : 'projects'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap py-2">
                    {webPlatformsProjects.map((project, idx) => (
                      <div
                        key={`cat-web-${project.id}`}
                        className="relative hover:z-10 h-full"
                      >
                        <ProjectCard
                          project={project}
                          lang={lang}
                          onSelectProject={onSelectProject}
                          priorityLoading={idx < 2}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Category Section 3: Engineering Case Studies & AI/ERP Systems */}
              {systemsAndAiProjects.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b theme-border">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 text-xs font-mono-tabular theme-accent-text">
                        <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>03. {isAr ? 'الأنظمة المحاسبية والذكاء الاصطناعي' : 'ERP Accounting & AI Systems'}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold theme-text-primary">
                        {t.caseStudiesTitle}
                      </h3>
                      <p className="text-xs sm:text-sm theme-text-secondary">
                        {t.caseStudiesSubtitle}
                      </p>
                    </div>
                    <span className="text-xs font-mono-tabular px-3 py-1 rounded-full theme-card-elevated theme-text-muted">
                      {systemsAndAiProjects.length} {isAr ? 'مشاريع' : 'projects'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap py-2">
                    {systemsAndAiProjects.map((project, idx) => (
                      <div
                        key={`cat-sys-${project.id}`}
                        className="relative hover:z-10 h-full"
                      >
                        <ProjectCard
                          project={project}
                          lang={lang}
                          onSelectProject={onSelectProject}
                          priorityLoading={idx < 2}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </section>
      </div>
    );
  }
);
