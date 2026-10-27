import React, { useState } from 'react';
import {
  Cpu,
  Globe,
  Home,
  Layers,
  Menu,
  Radio,
  Send,
  UserCheck,
  X,
} from 'lucide-react';
import { Language, OWNER_PROFILE, UI_TRANSLATIONS } from '../data/portfolioData';

export type RoutePath =
  | '/'
  | '/projects'
  | '/services'
  | '/community'
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
    const isAr = lang === 'ar';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const t = UI_TRANSLATIONS[lang].nav;

    const navItems: {
      path: RoutePath;
      label: string;
      icon: React.FC<{ className?: string }>;
      code: string;
    }[] = [
      { path: '/', label: t.home, icon: Home, code: '01' },
      { path: '/projects', label: t.projects, icon: Cpu, code: '02' },
      { path: '/services', label: t.services, icon: Layers, code: '03' },
      {
        path: '/community',
        label: isAr ? 'المنتدى التقني' : 'Tech Hub',
        icon: Radio,
        code: '04',
      },
      { path: '/about', label: t.about, icon: UserCheck, code: '05' },
      { path: '/contact', label: t.contact, icon: Send, code: '06' },
    ];

    const handleNavClick = (
      e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
      path: RoutePath
    ) => {
      e.preventDefault();
      onNavigate(path);
      setMobileMenuOpen(false);
    };

    return (
      <header className="sticky top-0 z-40 theme-header backdrop-blur-xl border-b relative">
        {/* Top subtle smart-tech glowing circuit line */}
        <div
          className="h-[2px] w-full pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--accent-primary) 30%, var(--accent-secondary) 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-20">
          {/* Zone 1: Engineered Smart Brand Emblem */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="group flex items-center gap-3 shrink-0 focus:outline-none"
          >
            <div className="relative w-11 h-11 rounded-xl theme-btn-primary flex items-center justify-center font-display font-extrabold text-sm tracking-wider shadow-md overflow-hidden border border-white/20">
              {/* Subtle geometric corner lines inside monogram */}
              <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/50" />
              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/50" />
              <span>{OWNER_PROFILE.monogram}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight theme-text-primary group-hover:theme-accent-text transition-colors font-display leading-tight">
                {OWNER_PROFILE.brandName}
              </span>
              <span className="text-[11px] font-semibold theme-accent-text tracking-wide">
                {isAr
                  ? 'هندسة الأنظمة والمشاريع الذكية'
                  : 'Smart Systems & AI Engineering'}
              </span>
            </div>
          </a>

          {/* Zone 2: Smart Tech Navigation Command Dock (Professional Tech Buttons) */}
          <nav
            aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
            className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl tech-nav-dock"
          >
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              const IconComponent = item.icon;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer select-none ${
                    isActive ? 'tech-nav-btn-active' : 'tech-nav-btn'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'theme-bg-elevated theme-accent-text group-hover:bg-[var(--accent-soft)]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher Tech Control & Mobile Drawer Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleLang}
              aria-label={t.switchLangAria}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl tech-nav-btn text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 min-h-[42px]"
            >
              <span className="w-6 h-6 rounded-lg theme-bg-elevated theme-accent-text flex items-center justify-center shrink-0">
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span>{t.switchLang}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={
                lang === 'ar' ? 'فتح القائمة التقنية' : 'Toggle navigation menu'
              }
              className="lg:hidden p-2.5 rounded-xl tech-nav-btn cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 theme-accent-text" />
              ) : (
                <Menu className="w-5 h-5 theme-text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Smart Tech Button Matrix */}
        {mobileMenuOpen && (
          <nav
            aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}
            className="lg:hidden theme-bg-surface border-b theme-border px-4 py-4"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive ? 'tech-nav-btn-active' : 'tech-nav-btn'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'theme-bg-elevated theme-accent-text'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </nav>
        )}
      </header>
    );
  }
);

