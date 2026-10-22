import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Layers, Palette } from 'lucide-react';
import { Language, OWNER_PROFILE, PROJECTS_DATA, UI_TRANSLATIONS } from '../data/portfolioData';
import { HeroStaticEmblem } from './HeroStaticEmblem';
import { RoutePath } from './Navbar';

const LazyHeroScene3D = lazy(() => import('./HeroScene3D'));

interface HeroSectionProps {
  lang: Language;
  onNavigate: (path: RoutePath) => void;
  onOpenAppearance?: () => void;
  reducedMotionActive?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(
  ({ lang, onNavigate, onOpenAppearance, reducedMotionActive = false }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].hero;

    // Default to lightweight static vector emblem for zero main-thread blocking on initial load;
    // user can interactively enable the 3D scene if reduced motion is not active.
    const [enable3D, setEnable3D] = useState(false);
    const [osReducedMotion, setOsReducedMotion] = useState(false);

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

    return (
      <section className="relative theme-bg-primary border-b theme-border overflow-hidden">
        {/* Subtle architectural background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Primary Column: Typographic Hierarchy & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              {/* Brand Kicker & Monogram */}
              <div className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold theme-accent-text">
                <span className="w-7 h-7 rounded-lg theme-card-elevated theme-accent-text font-extrabold flex items-center justify-center font-display shrink-0">
                  {OWNER_PROFILE.monogram}
                </span>
                <span>{t.kicker}</span>
              </div>

              {/* Hero Headline */}
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight theme-text-primary leading-[1.18]"
                style={{ textWrap: 'balance' }}
              >
                {t.headline}
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg theme-text-secondary max-w-2xl leading-relaxed">
                {t.subtext}
              </p>

              {/* Primary, Secondary & Appearance CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/projects')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl theme-btn-primary text-sm font-semibold cursor-pointer whitespace-nowrap"
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
                      {isAr ? 'المظهر والثيمات (6)' : 'Appearance & Themes (6)'}
                    </span>
                  </button>
                )}
              </div>

              {/* CV-Verified Identity Strip */}
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
                <span className="font-mono-tabular theme-accent-text font-medium">
                  {isAr
                    ? `${PROJECTS_DATA.length} مشاريع برمجية وهندسية`
                    : `${PROJECTS_DATA.length} Software & Engineering Projects`}
                </span>
              </div>
            </div>

            {/* Secondary Column: Architectural Emblem (Vector by default, optional on-demand 3D) */}
            <div className="lg:col-span-5 flex items-center">
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
              ) : (
                <HeroStaticEmblem
                  lang={lang}
                  canEnable3D={!effectiveReducedMotion}
                  onEnable3D={() => setEnable3D(true)}
                  reasonNote={
                    effectiveReducedMotion
                      ? isAr
                        ? 'تم تفعيل العرض الثابت احتراماً لإعدادات تقليل الحركة'
                        : 'Static vector emblem active (Reduced Motion enabled)'
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
);
