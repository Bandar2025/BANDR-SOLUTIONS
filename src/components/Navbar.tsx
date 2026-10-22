import React, { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { Language, OWNER_PROFILE, UI_TRANSLATIONS } from '../data/portfolioData';

export type RoutePath =
  | '/'
  | '/projects'
  | '/services'
  | '/about'
  | '/contact'
  | '/admin'
  | '/404';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
}

export const Navbar: React.FC<NavbarProps> = React.memo(
  ({ lang, onToggleLang, currentPath, onNavigate }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const t = UI_TRANSLATIONS[lang].nav;

    const navItems: { path: RoutePath; label: string }[] = [
      { path: '/', label: t.home },
      { path: '/projects', label: t.projects },
      { path: '/services', label: t.services },
      { path: '/about', label: t.about },
      { path: '/contact', label: t.contact },
    ];

    const handleNavClick = (
      e: React.MouseEvent<HTMLAnchorElement>,
      path: RoutePath
    ) => {
      e.preventDefault();
      onNavigate(path);
      setMobileMenuOpen(false);
    };

    return (
      <header className="sticky top-0 z-40 theme-header backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
          {/* Zone 1: Single Text Element Wordmark ("BS — Bandr Solutions") */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="text-base sm:text-lg font-extrabold tracking-tight theme-text-primary hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 font-display"
          >
            BS — {OWNER_PROFILE.brandName}
          </a>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
            className="hidden md:flex items-center gap-7 text-sm font-medium theme-text-secondary"
          >
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'theme-text-primary border-[var(--accent-primary)] font-semibold'
                      : 'border-transparent hover:theme-text-primary'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary Language Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleLang}
              aria-label={t.switchLangAria}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg theme-btn-primary text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 min-h-[38px]"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.switchLang}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={
                lang === 'ar' ? 'فتح القائمة' : 'Toggle navigation menu'
              }
              className="md:hidden p-2 rounded-lg theme-btn-secondary cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}
            className="md:hidden theme-bg-surface border-b theme-border px-4 py-3 space-y-1"
          >
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'theme-card-elevated theme-accent-text font-semibold'
                      : 'theme-text-secondary hover:theme-text-primary'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        )}
      </header>
    );
  }
);
