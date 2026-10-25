import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Layers,
  Palette,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Globe,
  Cpu,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import {
  Language,
  OWNER_PROFILE,
  PROJECTS_DATA,
  ProjectItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { HeroStaticEmblem } from './HeroStaticEmblem';
import { RoutePath } from './Navbar';
import { THEME_GALLERY, ThemeId } from '../lib/themeSystem';

const LazyHeroScene3D = lazy(() => import('./HeroScene3D'));

interface HeroSectionProps {
  lang: Language;
  onNavigate: (path: RoutePath) => void;
  onOpenAppearance?: () => void;
  reducedMotionActive?: boolean;
  projects?: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
  activeThemeId?: ThemeId;
  onQuickSelectTheme?: (themeId: ThemeId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(
  ({
    lang,
    onNavigate,
    onOpenAppearance,
    reducedMotionActive = false,
    projects = PROJECTS_DATA,
    onSelectProject,
    activeThemeId = 'arctic-light',
    onQuickSelectTheme,
  }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].hero;

    const [enable3D, setEnable3D] = useState(false);
    const [osReducedMotion, setOsReducedMotion] = useState(false);
    const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

    const featuredList = projects
      .filter((p) => p.status !== 'draft')
      .slice(0, 4);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setOsReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setOsReducedMotion(e.matches);
        if (e.matches) {
          setEnable3D(false);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
      if (reducedMotionActive) {
        setEnable3D(false);
      }
    }, [reducedMotionActive]);

    const effectiveReducedMotion = osReducedMotion || reducedMotionActive;
    const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

    const activeFeatured = featuredList[activeShowcaseIdx] || featuredList[0];

    return (
      <section className="relative theme-bg-primary border-b theme-border overflow-hidden">
        {/* Soft luminous daylight architectural grid & ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-32 start-1/4 w-[520px] h-[520px] rounded-full pointer-events-none blur-3xl opacity-35"
          style={{
            background:
              'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:py-16 lg:py-20 space-y-12">
          {/* Quick Light & Dark Theme Switcher Strip at Top of Hero */}
          {onQuickSelectTheme && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl theme-bg-surface border theme-border shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold theme-text-primary">
                <Sun className="w-4 h-4 theme-accent-text shrink-0" />
                <span>
                  {isAr
                    ? 'اختر ألوان الواجهة المفضلة (ثيمات نهارية فاتحة وجديدة):'
                    : 'Choose Interface Palette (New Bright Daylight Themes):'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {THEME_GALLERY.map((themeItem) => {
                  const isCurrent = activeThemeId === themeItem.id;
                  return (
                    <button
                      key={themeItem.id}
                      type="button"
                      onClick={() => onQuickSelectTheme(themeItem.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isCurrent
                          ? 'theme-btn-primary border-transparent shadow-xs'
                          : 'theme-bg-elevated theme-text-secondary border-[var(--border-subtle)] hover:theme-text-primary'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: themeItem.swatches.accentPrimary }}
                      />
                      <span>{isAr ? themeItem.nameAr.split(' (')[0] : themeItem.nameEn.split(' (')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main 2-Column Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Primary Column: Editorial Brand Typography & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Brand Kicker & Monogram */}
                <div className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold theme-accent-text">
                  <span className="w-8 h-8 rounded-xl theme-btn-primary font-extrabold flex items-center justify-center font-display shrink-0 shadow-xs">
                    {OWNER_PROFILE.monogram}
                  </span>
                  <span>{t.kicker}</span>
                </div>

                {/* Hero Headline */}
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight theme-text-primary leading-[1.2]"
                  style={{ textWrap: 'balance' }}
                >
                  {t.headline}
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg theme-text-secondary max-w-2xl leading-[1.75]">
                  {t.subtext}
                </p>

                {/* Primary, Secondary & Appearance CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/projects')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl theme-btn-primary text-sm font-semibold cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <span>{t.primaryCta}</span>
                    <ArrowIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/contact')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl theme-btn-secondary text-sm font-semibold cursor-pointer whitespace-nowrap"
                  >
                    <span>{t.secondaryCta}</span>
                  </button>

                  {onOpenAppearance && (
                    <button
                      type="button"
                      onClick={onOpenAppearance}
                      className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
                    >
                      <Palette
                        className="w-4 h-4 theme-accent-text shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        {isAr ? 'تخصيص المظهر (6 ثيمات)' : 'Customize Theme (6)'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verified Identity Strip */}
              <div className="pt-6 border-t theme-border flex flex-wrap items-center gap-x-3 gap-y-2 text-xs theme-text-muted">
                <span className="inline-flex items-center gap-1.5 theme-text-primary font-semibold">
                  <Layers
                    className="w-3.5 h-3.5 theme-accent-text shrink-0"
                    aria-hidden="true"
                  />
                  <span>{t.ownerBadge}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {isAr ? OWNER_PROFILE.locationAr : OWNER_PROFILE.locationEn}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular theme-accent-text font-semibold">
                  {isAr
                    ? `${projects.length} مشروعاً تقنياً وهندسياً`
                    : `${projects.length} Software & Engineering Projects`}
                </span>
              </div>
            </div>

            {/* Secondary Column: Interactive Live Featured Project Spotlight Card */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              {enable3D && !effectiveReducedMotion ? (
                <Suspense
                  fallback={
                    <HeroStaticEmblem
                      lang={lang}
                      canEnable3D={false}
                      reasonNote={
                        isAr
                          ? 'جارٍ تهيئة المجسم ثلاثي الأبعاد...'
                          : 'Initializing 3D architectural emblem...'
                      }
                    />
                  }
                >
                  <LazyHeroScene3D
                    lang={lang}
                    onSwitchToStatic={() => setEnable3D(false)}
                  />
                </Suspense>
              ) : activeFeatured ? (
                <div className="w-full h-full rounded-2xl theme-bg-surface border theme-border shadow-md overflow-hidden flex flex-col justify-between p-5 space-y-4">
                  {/* Spotlight Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold theme-accent-text">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {isAr ? 'استعراض سريع للمشاريع البارزة' : 'Featured Project Spotlight'}
                      </span>
                    </span>

                    <div className="flex items-center gap-1">
                      {featuredList.map((proj, idx) => (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => setActiveShowcaseIdx(idx)}
                          className={`px-2 py-1 rounded-md text-[11px] font-mono-tabular font-bold transition-colors cursor-pointer ${
                            activeShowcaseIdx === idx
                              ? 'theme-btn-primary'
                              : 'theme-bg-elevated theme-text-muted hover:theme-text-primary'
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Featured Project Preview Image */}
                  <div
                    onClick={() => onSelectProject && onSelectProject(activeFeatured)}
                    className="relative w-full aspect-[16/10] rounded-xl theme-bg-elevated border theme-border overflow-hidden cursor-pointer group"
                  >
                    {activeFeatured.genuineScreenshotPath ? (
                      <img
                        src={activeFeatured.genuineScreenshotPath}
                        alt={isAr ? activeFeatured.nameAr : activeFeatured.nameEn}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs theme-text-muted">
                        {isAr ? activeFeatured.nameAr : activeFeatured.nameEn}
                      </div>
                    )}
                  </div>

                  {/* Featured Project Info */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold theme-accent-text">
                      {isAr
                        ? activeFeatured.categoryLabelAr
                        : activeFeatured.categoryLabelEn}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold theme-text-primary line-clamp-1">
                      {isAr ? activeFeatured.nameAr : activeFeatured.nameEn}
                    </h2>
                    <p className="text-xs sm:text-sm theme-text-secondary line-clamp-2 leading-relaxed">
                      {isAr
                        ? activeFeatured.descriptionAr
                        : activeFeatured.descriptionEn}
                    </p>
                  </div>

                  {/* Spotlight Footer Actions */}
                  <div className="pt-3 border-t theme-border flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProject && onSelectProject(activeFeatured)}
                      className="px-3.5 py-2 rounded-lg theme-btn-secondary text-xs font-semibold cursor-pointer"
                    >
                      {isAr ? 'عرض تفاصيل المشروع' : 'View Project Details'}
                    </button>

                    <div className="flex items-center gap-2">
                      {!effectiveReducedMotion && (
                        <button
                          type="button"
                          onClick={() => setEnable3D(true)}
                          className="px-2.5 py-2 rounded-lg theme-bg-elevated theme-text-muted hover:theme-text-primary text-[11px] font-semibold cursor-pointer border theme-border"
                        >
                          3D
                        </button>
                      )}
                      {activeFeatured.url && (
                        <a
                          href={activeFeatured.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg theme-btn-primary text-xs font-semibold"
                        >
                          <span>{isAr ? 'زيارة الموقع' : 'Visit Live'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <HeroStaticEmblem
                  lang={lang}
                  canEnable3D={!effectiveReducedMotion}
                  onEnable3D={() => setEnable3D(true)}
                />
              )}
            </div>
          </div>

          {/* Full-Width 4-Column Domain Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-2xl theme-bg-surface border theme-border shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl theme-bg-elevated flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 theme-accent-text" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono-tabular font-bold theme-accent-text">
                  01 · E-COMMERCE
                </div>
                <div className="text-sm font-bold theme-text-primary">
                  {isAr ? 'المتاجر والأسواق الرقمية' : 'E-Commerce & Marketplaces'}
                </div>
                <p className="text-xs theme-text-secondary">
                  {isAr
                    ? 'رفيد ماركتس، متجر فرش، وباويرا جلوبال'
                    : 'Rufid Markets, FRESH, Pawera Global'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl theme-bg-surface border theme-border shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl theme-bg-elevated flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 theme-accent-text" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono-tabular font-bold theme-accent-text">
                  02 · WEB & PLATFORMS
                </div>
                <div className="text-sm font-bold theme-text-primary">
                  {isAr ? 'منصات الأعمال والتعليم والصحة' : 'Web, EdTech & HealthTech'}
                </div>
                <p className="text-xs theme-text-secondary">
                  {isAr
                    ? 'إنجازك التقني، منارة اليمن، ساحة الصحة، ولومن'
                    : 'ENJAZAK, Al-Manara, Seha Square, Lumen'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl theme-bg-surface border theme-border shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl theme-bg-elevated flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 theme-accent-text" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono-tabular font-bold theme-accent-text">
                  03 · ERP & AI SYSTEMS
                </div>
                <div className="text-sm font-bold theme-text-primary">
                  {isAr ? 'الأنظمة المحاسبية والذكاء الاصطناعي' : 'Accounting ERP & AI IoT'}
                </div>
                <p className="text-xs theme-text-secondary">
                  {isAr
                    ? 'نظام FINB المحاسبي، FIREAI، ونوفارو ERP'
                    : 'FINB Accounting, FIREAI, NOVARO ERP'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl theme-bg-surface border theme-border shadow-xs flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl theme-bg-elevated flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 theme-accent-text" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono-tabular font-bold theme-accent-text">
                  04 · VERIFIED PORTFOLIO
                </div>
                <div className="text-sm font-bold theme-text-primary">
                  {isAr ? 'روابط مباشرة ومعاينات موثقة' : 'Live Links & Verified Previews'}
                </div>
                <p className="text-xs theme-text-secondary">
                  {isAr
                    ? 'تصنيف منظم بدون تكرار مع لقطات شاشة حقيقية'
                    : 'Structured non-repeating showcase with real screenshots'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
