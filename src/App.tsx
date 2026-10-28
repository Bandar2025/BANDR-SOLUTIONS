import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Language,
  PROJECTS_DATA,
  ProjectItem,
  UI_TRANSLATIONS,
} from './data/portfolioData';
import { Navbar, RoutePath } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProfilesSection } from './components/ProfilesSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { CommunitySection } from './components/CommunitySection';
import { Footer } from './components/Footer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ThemeSettingsCenter } from './components/ThemeSettingsCenter';
import { subscribePublicPublishedProjects } from './lib/portfolioService';
import {
  AppearancePreferences,
  applyAppearanceToDocument,
  clearPersonalAppearance,
  GlobalPublishedAppearance,
  loadCachedGlobalAppearance,
  loadPersonalAppearance,
  resolveEffectiveThemeId,
  savePersonalAppearance,
  subscribePublishedSiteAppearance,
} from './lib/themeSystem';
import {
  applyRouteSeoToDocument,
  loadCachedRouteSeoMap,
  RouteSeoMap,
  subscribeRouteSeoConfig,
} from './lib/seoService';
import {
  recordPageVisit,
  recordProjectInteraction,
} from './lib/analyticsService';

const LazyAdminDashboard = lazy(() => import('./components/AdminDashboard'));

const VALID_ROUTES: RoutePath[] = [
  '/',
  '/projects',
  '/services',
  '/community',
  '/about',
  '/contact',
  '/admin',
];

function resolveRoutePath(pathname: string): RoutePath {
  const clean = pathname === '' ? '/' : pathname.replace(/\/+$/, '') || '/';
  if ((VALID_ROUTES as string[]).includes(clean)) {
    return clean as RoutePath;
  }
  return '/404';
}

export default function App() {
  // Default to Arabic ('ar') for first-time visitors as specified
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('bandr_solutions_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      // Ignore storage access errors
    }
    return 'ar';
  });

  const [currentPath, setCurrentPath] = useState<RoutePath>(() =>
    resolveRoutePath(window.location.pathname)
  );

  // Appearance & Themes State (Strictly Admin-Controlled Global Theme + Admin Preview inside /admin)
  const [personalPrefs, setPersonalPrefs] =
    useState<AppearancePreferences | null>(() => loadPersonalAppearance());
  const [globalPublished, setGlobalPublished] =
    useState<GlobalPublishedAppearance>(() => loadCachedGlobalAppearance());

  // Live published portfolio projects (synced from Firestore with baseline fallback)
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECTS_DATA);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [preselectedService, setPreselectedService] = useState<string>('');

  // Dynamic Route SEO Metadata State (synced from Firestore /site_settings/seo_routes)
  const [routeSeoMap, setRouteSeoMap] = useState<RouteSeoMap>(() =>
    loadCachedRouteSeoMap()
  );

  // Subscribe to published projects in Firestore for public visitors
  useEffect(() => {
    const unsubscribe = subscribePublicPublishedProjects(
      (livePublishedProjects) => {
        setProjects(livePublishedProjects);
      }
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to globally published appearance settings in Firestore (/site_settings/appearance)
  useEffect(() => {
    const unsubscribe = subscribePublishedSiteAppearance((published) => {
      setGlobalPublished(published);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to dynamic route SEO metadata in Firestore (/site_settings/seo_routes)
  useEffect(() => {
    const unsubscribe = subscribeRouteSeoConfig((liveSeoMap) => {
      setRouteSeoMap(liveSeoMap);
    });
    return () => unsubscribe();
  }, []);

  // Only allow preview override while inside /admin; public routes strictly use globalPublished
  const isAdminRoute = currentPath === '/admin';
  const activeThemeMode = isAdminRoute
    ? personalPrefs?.themeMode ?? globalPublished.themeId
    : globalPublished.themeId;
  const activeDensity = isAdminRoute
    ? personalPrefs?.density ?? globalPublished.density
    : globalPublished.density;
  const activeReducedMotion = isAdminRoute
    ? personalPrefs?.reducedMotion ?? globalPublished.reducedMotion
    : globalPublished.reducedMotion;

  useEffect(() => {
    const applyCurrent = () => {
      const effectiveTheme = resolveEffectiveThemeId(activeThemeMode);
      applyAppearanceToDocument(
        effectiveTheme,
        activeDensity,
        activeReducedMotion
      );
    };

    applyCurrent();

    if (activeThemeMode === 'system' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      const handleSystemChange = () => applyCurrent();
      mq.addEventListener('change', handleSystemChange);
      return () => mq.removeEventListener('change', handleSystemChange);
    }
  }, [activeThemeMode, activeDensity, activeReducedMotion]);

  const handleApplyPersonalPrefs = useCallback(
    (prefs: AppearancePreferences) => {
      savePersonalAppearance(prefs);
      setPersonalPrefs(prefs);
    },
    []
  );

  const handleResetPersonalToGlobal = useCallback(() => {
    clearPersonalAppearance();
    setPersonalPrefs(null);
  }, []);

  // Synchronize document language, RTL/LTR direction, and dynamic Route SEO metadata
  useEffect(() => {
    const isAr = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    try {
      window.localStorage.setItem('bandr_solutions_lang', lang);
    } catch {
      // Ignore storage errors
    }

    applyRouteSeoToDocument(currentPath, lang, routeSeoMap);
  }, [lang, currentPath, routeSeoMap]);

  // Record real page visit telemetry when route changes
  useEffect(() => {
    recordPageVisit();
  }, [currentPath]);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(resolveRoutePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((path: RoutePath) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const handleInquireService = useCallback(
    (serviceName: string) => {
      setPreselectedService(serviceName);
      handleNavigate('/contact');
    },
    [handleNavigate]
  );

  const handleOpenProjectModal = useCallback((project: ProjectItem | null) => {
    if (project) {
      recordProjectInteraction(project.id, 'case_study');
    }
    setSelectedProject(project);
  }, []);

  const handleSelectProjectId = useCallback(
    (id: string) => {
      const found = projects.find((p) => p.id === id);
      if (found) handleOpenProjectModal(found);
    },
    [projects, handleOpenProjectModal]
  );

  const handleSelectTechFromModal = useCallback(
    (tech: string) => {
      setSelectedTech(tech);
      setSelectedProject(null);
      if (currentPath !== '/' && currentPath !== '/projects') {
        if (window.location.pathname !== '/projects') {
          window.history.pushState({}, '', '/projects');
        }
        setCurrentPath('/projects');
      }
      window.setTimeout(() => {
        const el = document.getElementById('projects-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    },
    [currentPath]
  );

  const notFoundT = UI_TRANSLATIONS[lang].notFound;
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen flex flex-col theme-bg-primary">
      {/* Top Navigation Bar (Public links only; /admin is never listed in navItems) */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      {/* Main Route Content */}
      <main className="flex-1">
        {currentPath === '/' && (
          <>
            <HeroSection
              lang={lang}
              onNavigate={handleNavigate}
              reducedMotionActive={activeReducedMotion}
              projects={projects}
              onSelectProject={handleOpenProjectModal}
            />
            <ProjectsSection
              lang={lang}
              projects={projects}
              onSelectProject={handleOpenProjectModal}
              showDedicatedDomainBreakdowns={true}
              selectedTech={selectedTech}
              onSelectTech={setSelectedTech}
            />
            <ProfilesSection lang={lang} />
            <ServicesSection
              lang={lang}
              onInquireService={handleInquireService}
            />
            <CommunitySection lang={lang} />
            <AboutSection lang={lang} />
            <ContactSection
              lang={lang}
              preselectedService={preselectedService}
            />
          </>
        )}

        {currentPath === '/community' && (
          <>
            <div className="theme-bg-surface py-12 border-b theme-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                <div className="text-xs font-semibold theme-accent-text">
                  {isAr ? 'منتدى التحديثات والرؤى التقنية' : 'Community Updates & Insights Forum'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold theme-text-primary">
                  {isAr ? 'تحديثات المنصة والمقالات الهندسية' : 'Platform Updates & Engineering Articles'}
                </h1>
              </div>
            </div>
            <CommunitySection lang={lang} />
          </>
        )}

        {currentPath === '/projects' && (
          <>
            <div className="theme-bg-surface py-12 border-b theme-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                <div className="text-xs font-semibold theme-accent-text">
                  {isAr
                    ? 'معرض المشاريع ودراسات الحالة'
                    : 'Portfolio Inventory & Case Studies'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold theme-text-primary">
                  {UI_TRANSLATIONS[lang].projects.sectionTitle}
                </h1>
              </div>
            </div>
            <ProjectsSection
              lang={lang}
              projects={projects}
              onSelectProject={handleOpenProjectModal}
              showDedicatedDomainBreakdowns={true}
              selectedTech={selectedTech}
              onSelectTech={setSelectedTech}
            />
            <ProfilesSection lang={lang} />
          </>
        )}

        {currentPath === '/services' && (
          <>
            <div className="theme-bg-surface py-12 border-b theme-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                <div className="text-xs font-semibold theme-accent-text">
                  {isAr
                    ? 'الخدمات والحلول البرمجية'
                    : 'Engineering & Digital Services'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold theme-text-primary">
                  {UI_TRANSLATIONS[lang].services.sectionTitle}
                </h1>
              </div>
            </div>
            <ServicesSection
              lang={lang}
              onInquireService={handleInquireService}
            />
            <ContactSection
              lang={lang}
              preselectedService={preselectedService}
            />
          </>
        )}

        {currentPath === '/about' && (
          <>
            <div className="theme-bg-surface py-12 border-b theme-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                <div className="text-xs font-semibold theme-accent-text">
                  {isAr
                    ? 'نبذة والسيرة الذاتية الموثقة'
                    : 'Profile & Verified CV Credentials'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold theme-text-primary">
                  {UI_TRANSLATIONS[lang].about.sectionTitle}
                </h1>
              </div>
            </div>
            <AboutSection lang={lang} />
            <ProfilesSection lang={lang} />
          </>
        )}

        {currentPath === '/contact' && (
          <>
            <div className="theme-bg-surface py-12 border-b theme-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                <div className="text-xs font-semibold theme-accent-text">
                  {isAr
                    ? 'قنوات التواصل المباشر'
                    : 'Direct Contact & Project Inquiry'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold theme-text-primary">
                  {UI_TRANSLATIONS[lang].contact.sectionTitle}
                </h1>
              </div>
            </div>
            <ContactSection
              lang={lang}
              preselectedService={preselectedService}
            />
          </>
        )}

        {currentPath === '/admin' && (
          <Suspense
            fallback={
              <div className="min-h-[70vh] flex items-center justify-center p-6">
                <Loader2 className="w-8 h-8 theme-accent-text animate-spin" />
              </div>
            }
          >
            <LazyAdminDashboard
              lang={lang}
              onPreviewProject={setSelectedProject}
              onNavigateHome={() => handleNavigate('/')}
              personalPrefs={personalPrefs}
              globalPublished={globalPublished}
              onApplyPersonalPrefs={handleApplyPersonalPrefs}
              onResetPersonalToGlobal={handleResetPersonalToGlobal}
            />
          </Suspense>
        )}

        {currentPath === '/404' && (
          <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-6">
            <div className="text-6xl font-extrabold font-mono-tabular theme-accent-text">
              {notFoundT.code}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold theme-text-primary">
              {notFoundT.title}
            </h1>
            <p className="text-base theme-text-secondary">
              {notFoundT.description}
            </p>
            <div>
              <button
                type="button"
                onClick={() => handleNavigate('/')}
                className="px-6 py-3 rounded-xl theme-btn-primary text-sm font-semibold cursor-pointer"
              >
                {notFoundT.backHome}
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        lang={lang}
        projects={projects}
        onNavigate={handleNavigate}
        onSelectProjectId={handleSelectProjectId}
      />

      {/* Accessible Project Details & Case Study Modal */}
      <ProjectDetailModal
        project={selectedProject}
        lang={lang}
        onClose={() => setSelectedProject(null)}
        isAdminPreview={currentPath === '/admin'}
        onInquireService={handleInquireService}
        onSelectTech={handleSelectTechFromModal}
        selectedTech={selectedTech}
        allProjects={projects}
      />
    </div>
  );
}
