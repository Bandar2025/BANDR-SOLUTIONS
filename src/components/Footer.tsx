import React from 'react';
import { ArrowUp, ExternalLink, Palette } from 'lucide-react';
import {
  Language,
  OWNER_PROFILE,
  PROFESSIONAL_PROFILES,
  ProjectItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { RoutePath } from './Navbar';

interface FooterProps {
  projects: ProjectItem[];
  lang: Language;
  onNavigate: (path: RoutePath) => void;
  onSelectProjectId: (id: string) => void;
  onOpenAppearance?: () => void;
}

export const Footer: React.FC<FooterProps> = React.memo(
  ({ projects, lang, onNavigate, onSelectProjectId, onOpenAppearance }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].footer;
    const navT = UI_TRANSLATIONS[lang].nav;
    const currentYear = new Date().getFullYear();

    const publishedProjects = projects.filter((p) => p.status !== 'draft');

    const handleNavClick = (
      e: React.MouseEvent<HTMLAnchorElement>,
      path: RoutePath
    ) => {
      e.preventDefault();
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <footer className="theme-footer border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Brand Identity & Bilingual Tagline */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg theme-btn-primary font-extrabold text-sm flex items-center justify-center font-display">
                  {OWNER_PROFILE.monogram}
                </span>
                <span className="text-lg font-bold theme-text-primary tracking-tight">
                  {OWNER_PROFILE.brandName}
                </span>
              </div>
              <p className="text-sm theme-text-secondary font-medium">
                {isAr ? OWNER_PROFILE.taglineAr : OWNER_PROFILE.taglineEn}
              </p>
              <p className="text-xs theme-text-muted">
                {isAr ? OWNER_PROFILE.taglineEn : OWNER_PROFILE.taglineAr}
              </p>
              <div className="pt-2 text-xs theme-text-muted space-y-1">
                <div>
                  {isAr ? OWNER_PROFILE.fullNameAr : OWNER_PROFILE.fullNameEn}
                </div>
                <div>
                  {isAr ? OWNER_PROFILE.locationAr : OWNER_PROFILE.locationEn}
                </div>
                <a
                  href={`mailto:${OWNER_PROFILE.email}`}
                  className="theme-accent-text hover:underline font-mono-tabular block"
                >
                  {OWNER_PROFILE.email}
                </a>
              </div>
            </div>

            {/* Column 2: Internal Navigation */}
            <div>
              <h3 className="text-xs font-semibold theme-text-primary tracking-wider mb-4">
                {t.navigation}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {(
                  [
                    { path: '/', label: navT.home },
                    { path: '/projects', label: navT.projects },
                    { path: '/services', label: navT.services },
                    { path: '/about', label: navT.about },
                    { path: '/contact', label: navT.contact },
                    { path: '/admin', label: isAr ? 'إدارة معرض الأعمال' : 'Portfolio Admin' },
                  ] as { path: RoutePath; label: string }[]
                ).map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      onClick={(e) => handleNavClick(e, item.path)}
                      className="theme-text-muted hover:theme-text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Published Portfolio Projects */}
            <div>
              <h3 className="text-xs font-semibold theme-text-primary tracking-wider mb-4">
                {t.verifiedProjects}
              </h3>
              <ul className="space-y-2 text-xs">
                {publishedProjects.map((proj) => (
                  <li key={proj.id}>
                    {proj.url ? (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 theme-text-muted hover:theme-accent-text transition-colors"
                      >
                        <span>{isAr ? proj.nameAr : proj.nameEn}</span>
                        <ExternalLink
                          className="w-3 h-3 shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectProjectId(proj.id)}
                        className="text-start theme-text-muted hover:theme-accent-text transition-colors cursor-pointer"
                      >
                        {isAr ? proj.nameAr : proj.nameEn}{' '}
                        <span className="opacity-75">
                          ({isAr ? 'دراسة حالة' : 'Case Study'})
                        </span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Professional Profiles */}
            <div>
              <h3 className="text-xs font-semibold theme-text-primary tracking-wider mb-4">
                {t.professionalProfiles}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {PROFESSIONAL_PROFILES.map((profile) => (
                  <li key={profile.id}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 theme-text-muted hover:theme-accent-text transition-colors"
                    >
                      <span>
                        {isAr ? profile.platformNameAr : profile.platformNameEn}
                      </span>
                      <ExternalLink
                        className="w-3.5 h-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Back to Top */}
          <div className="mt-12 pt-8 border-t theme-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs theme-text-muted">
            <div className="space-y-1 text-center sm:text-start">
              <div>
                © <span className="font-mono-tabular">{currentYear}</span>{' '}
                {OWNER_PROFILE.brandName} ·{' '}
                {isAr ? OWNER_PROFILE.fullNameAr : OWNER_PROFILE.fullNameEn}.{' '}
                {t.rights}
              </div>
              <div className="opacity-80">{t.transparencyNote}</div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl tech-nav-btn text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{t.backToTop}</span>
                <ArrowUp className="w-3.5 h-3.5 theme-accent-text" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);
