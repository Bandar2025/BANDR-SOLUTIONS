import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Layers,
  ExternalLink,
  ShoppingBag,
  Globe,
  Cpu,
  ShieldCheck,
  Box,
  Database,
  Activity,
  Eye,
} from 'lucide-react';
import {
  Language,
  OWNER_PROFILE,
  PROJECTS_DATA,
  ProjectItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { HeroStaticEmblem } from './HeroStaticEmblem';
import { ProjectVisualPreview } from './ProjectVisualPreview';
import { RoutePath } from './Navbar';

const LazyHeroScene3D = lazy(() => import('./HeroScene3D'));

interface HeroSectionProps {
  lang: Language;
  onNavigate: (path: RoutePath) => void;
  reducedMotionActive?: boolean;
  projects?: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(
  ({
    lang,
    onNavigate,
    reducedMotionActive = false,
    projects = PROJECTS_DATA,
    onSelectProject,
  }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].hero;

    const [enable3D, setEnable3D] = useState(false);
    const [osReducedMotion, setOsReducedMotion] = useState(false);
    const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

    // Prioritize smart AI, Digital Twin, E-Commerce & ERP projects in the Hero Holo-Stage
    const featuredList = useMemo(() => {
      const published = projects.filter((p) => p.status !== 'draft');
      const priorityIds = [
        'ai-fire-automation-embedded',
        'tasour-digital-twin',
        'rufid-markets',
        'finb-accounting',
        'novaro-erp',
        'fresh',
      ];
      const prioritized = priorityIds
        .map((id) => published.find((p) => p.id === id))
        .filter((p): p is ProjectItem => Boolean(p));
      const others = published.filter((p) => !priorityIds.includes(p.id));
      return [...prioritized, ...others].slice(0, 6);
    }, [projects]);

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

    const smartCapabilities = [
      {
        icon: Cpu,
        labelAr: 'الذكاء الاصطناعي و IoT',
        labelEn: 'AI & Embedded IoT',
      },
      {
        icon: Box,
        labelAr: 'التوأم الرقمي الصناعي 3D',
        labelEn: '3D Digital Twin',
      },
      {
        icon: Database,
        labelAr: 'الأنظمة المحاسبية و ERP',
        labelEn: 'Enterprise Cloud ERP',
      },
      {
        icon: ShoppingBag,
        labelAr: 'المتاجر والمنصات الذكية',
        labelEn: 'Smart E-Commerce',
      },
    ];

    return (
      <section className="relative theme-bg-primary border-b theme-border overflow-hidden">
        {/* Layer 1: Architectural Tech Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
          aria-hidden="true"
        />

        {/* Layer 2: Ambient Cyber-Indigo & Cyan Radial Glows */}
        <div
          className="absolute -top-40 start-1/5 w-[620px] h-[620px] rounded-full pointer-events-none blur-3xl opacity-50"
          style={{
            background:
              'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 end-1/6 w-[540px] h-[540px] rounded-full pointer-events-none blur-3xl opacity-35"
          style={{
            background:
              'radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Layer 3: Smart Technology Geometric Circuitry & Neural Nodes SVG Backdrop */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          viewBox="0 0 1440 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroCircuitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.65" />
              <stop offset="50%" stopColor="var(--accent-secondary)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="heroCircuitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Left/Top Isometric Circuit Pathways */}
          <path
            d="M-20 140 H180 L230 190 H420 L460 150 H640"
            stroke="url(#heroCircuitGrad1)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M80 0 V90 L130 140 V280 L190 340 H360"
            stroke="url(#heroCircuitGrad1)"
            strokeWidth="1.2"
          />
          <circle cx="180" cy="140" r="4" fill="var(--accent-primary)" />
          <circle cx="230" cy="190" r="4" fill="var(--accent-secondary)" />
          <circle cx="420" cy="190" r="3.5" fill="var(--accent-primary)" />
          <circle cx="190" cy="340" r="4" fill="var(--accent-secondary)" />

          {/* Right/Center Orbital Tech Rings & Hexagon Geometry */}
          <g transform="translate(1120, 230)">
            <circle
              cx="0"
              cy="0"
              r="185"
              stroke="url(#heroCircuitGrad2)"
              strokeWidth="1.2"
              strokeDasharray="10 8"
            />
            <circle
              cx="0"
              cy="0"
              r="130"
              stroke="url(#heroCircuitGrad1)"
              strokeWidth="1"
            />
            <polygon
              points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45"
              stroke="url(#heroCircuitGrad2)"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="0" cy="-90" r="4" fill="var(--accent-secondary)" />
            <circle cx="78" cy="45" r="4" fill="var(--accent-primary)" />
            <circle cx="-78" cy="45" r="4" fill="var(--accent-secondary)" />
          </g>

          {/* Bottom Data Bus Trace */}
          <path
            d="M1460 660 H1180 L1130 610 H890 L850 650 H620"
            stroke="url(#heroCircuitGrad2)"
            strokeWidth="1.5"
          />
          <circle cx="1180" cy="660" r="4" fill="var(--accent-secondary)" />
          <circle cx="1130" cy="610" r="4" fill="var(--accent-primary)" />
          <circle cx="890" cy="610" r="3.5" fill="var(--accent-secondary)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:py-16 lg:py-20 space-y-12">
          {/* Main 2-Column Smart Engineering Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Primary Column: Smart Tech Identity, Interactive Domain Matrix & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
              <div className="space-y-6">
                {/* Engineered Smart Architecture Kicker */}
                <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl tech-nav-dock w-fit">
                  <span className="w-8 h-8 rounded-xl theme-btn-primary font-extrabold flex items-center justify-center font-display shrink-0 shadow-xs text-xs">
                    {OWNER_PROFILE.monogram}
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold theme-text-primary">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] shrink-0" />
                    <span>
                      {isAr
                        ? 'منظومة الهندسة البرمجية والمشاريع الذكية المتكاملة'
                        : 'Intelligent Systems, AI & Full-Stack Engineering Lab'}
                    </span>
                  </div>
                </div>

                {/* High-Impact Smart Headline */}
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight theme-text-primary leading-[1.22]"
                  style={{ textWrap: 'balance' }}
                >
                  {isAr ? (
                    <>
                      هندسة وتطوير{' '}
                      <span
                        className="bg-clip-text text-transparent"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                        }}
                      >
                        الأنظمة الذكية والمنصات الرقمية
                      </span>{' '}
                      بمعايير تقنية متقدمة
                    </>
                  ) : (
                    <>
                      Engineering{' '}
                      <span
                        className="bg-clip-text text-transparent"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                        }}
                      >
                        Intelligent Systems & Smart Platforms
                      </span>{' '}
                      Built for Real-World Scale
                    </>
                  )}
                </h1>

                {/* Supporting Narrative */}
                <p className="text-base sm:text-lg theme-text-secondary max-w-2xl leading-[1.8]">
                  {t.subtext}
                </p>

                {/* Interactive Smart Tech Capability Matrix Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {smartCapabilities.map((cap, idx) => {
                    const CapIcon = cap.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onNavigate('/projects')}
                        className="group flex items-center gap-2.5 p-2.5 rounded-xl tech-nav-btn text-start cursor-pointer"
                      >
                        <span className="w-8 h-8 rounded-lg theme-bg-elevated theme-accent-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <CapIcon className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-bold theme-text-primary leading-snug line-clamp-2">
                          {isAr ? cap.labelAr : cap.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Primary & Secondary Engineered Tech CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/projects')}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl tech-nav-btn-active text-sm font-bold cursor-pointer whitespace-nowrap"
                  >
                    <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>
                      {isAr
                        ? 'استكشف معرض المشاريع الذكية'
                        : 'Explore Smart Projects Showcase'}
                    </span>
                    <ArrowIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/services')}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl tech-nav-btn text-sm font-bold cursor-pointer whitespace-nowrap"
                  >
                    <Layers className="w-4 h-4 theme-accent-text shrink-0" />
                    <span>
                      {isAr ? 'الخدمات والحلول الهندسية' : 'Engineering Services'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/contact')}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl tech-nav-btn text-sm font-bold cursor-pointer whitespace-nowrap"
                  >
                    <span>{t.secondaryCta}</span>
                  </button>
                </div>
              </div>

              {/* Verified Architecture Specs Strip */}
              <div className="pt-6 border-t theme-border flex flex-wrap items-center gap-x-4 gap-y-2 text-xs theme-text-muted">
                <span className="inline-flex items-center gap-1.5 theme-text-primary font-bold">
                  <Activity
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
                <span className="font-mono-tabular theme-accent-text font-bold">
                  {isAr
                    ? `${projects.length} مشروعاً ذكياً ومنظومة برمجية`
                    : `${projects.length} Smart Systems & Production Platforms`}
                </span>
              </div>
            </div>

            {/* Secondary Column: Interactive Smart Project Holo-Stage */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              {enable3D && !effectiveReducedMotion ? (
                <Suspense
                  fallback={
                    <HeroStaticEmblem
                      lang={lang}
                      canEnable3D={false}
                      reasonNote={
                        isAr
                          ? 'جارٍ تهيئة المجسم الهندسي ثلاثي الأبعاد...'
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
                <div className="relative w-full h-full rounded-2xl tech-hud-card overflow-hidden flex flex-col justify-between p-5 space-y-4">
                  {/* Geometric Tech Corner Brackets */}
                  <span
                    className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[var(--accent-secondary)] opacity-70 pointer-events-none"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[var(--accent-primary)] opacity-70 pointer-events-none"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[var(--accent-primary)] opacity-70 pointer-events-none"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[var(--accent-secondary)] opacity-70 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Spotlight Top Selector Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-xs font-extrabold theme-accent-text">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                      <span>
                        {isAr
                          ? 'منصة العرض الذكي للمشاريع المختارة'
                          : 'Smart Project Holo-Showcase'}
                      </span>
                    </span>

                    <div className="flex items-center gap-1">
                      {featuredList.map((proj, idx) => (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => setActiveShowcaseIdx(idx)}
                          aria-label={isAr ? proj.nameAr : proj.nameEn}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-tabular font-bold transition-all cursor-pointer ${
                            activeShowcaseIdx === idx
                              ? 'tech-nav-btn-active'
                              : 'tech-nav-btn'
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Project Visual Preview with Auto-Slideshow */}
                  <div
                    onClick={() =>
                      onSelectProject && onSelectProject(activeFeatured)
                    }
                    className="relative w-full rounded-xl overflow-hidden cursor-pointer group border theme-border"
                  >
                    <ProjectVisualPreview
                      project={activeFeatured}
                      lang={lang}
                      aspectRatioClass="aspect-[16/10]"
                      fitMode="cover"
                      enableSlideshow={true}
                    />
                  </div>

                  {/* Featured Project Info & Tech Stack */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold theme-accent-text">
                        {isAr
                          ? activeFeatured.categoryLabelAr
                          : activeFeatured.categoryLabelEn}
                      </span>
                      <span className="font-mono-tabular text-[11px] theme-text-muted">
                        {activeFeatured.technologies.slice(0, 3).join(' · ')}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-extrabold theme-text-primary line-clamp-1">
                      {isAr ? activeFeatured.nameAr : activeFeatured.nameEn}
                    </h2>
                    <p className="text-xs sm:text-sm theme-text-secondary line-clamp-2 leading-relaxed">
                      {isAr
                        ? activeFeatured.descriptionAr
                        : activeFeatured.descriptionEn}
                    </p>
                  </div>

                  {/* Spotlight Engineered Footer Actions */}
                  <div className="pt-3 border-t theme-border flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectProject && onSelectProject(activeFeatured)
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl tech-nav-btn text-xs font-bold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 theme-accent-text" />
                      <span>
                        {isAr ? 'استعراض الدراسة الهندسية' : 'Case Study & Specs'}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      {!effectiveReducedMotion && (
                        <button
                          type="button"
                          onClick={() => setEnable3D(true)}
                          className="px-2.5 py-2 rounded-xl tech-nav-btn text-[11px] font-mono-tabular font-bold cursor-pointer"
                          title={
                            isAr
                              ? 'تفعيل المجسم الهندسي ثلاثي الأبعاد'
                              : 'Enable 3D Architectural Core'
                          }
                        >
                          3D CORE
                        </button>
                      )}
                      {activeFeatured.url && (
                        <a
                          href={activeFeatured.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl tech-nav-btn-active text-xs font-bold"
                        >
                          <span>{isAr ? 'زيارة المنصة' : 'Live System'}</span>
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

          {/* Full-Width 4-Pillar Smart Engineering Architecture Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('/projects')}
              className="p-4 rounded-2xl tech-hud-card flex items-start gap-3.5 text-start cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl theme-bg-elevated border theme-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 theme-accent-text" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono-tabular font-bold theme-accent-text">
                  01 · AI, IOT & DIGITAL TWIN
                </div>
                <div className="text-sm font-extrabold theme-text-primary">
                  {isAr
                    ? 'الذكاء الاصطناعي والتوأم الرقمي'
                    : 'AI Vision, IoT & Digital Twin'}
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  {isAr
                    ? 'نظام إطفاء الحرائق الذكي، ومنصة تاساور للتوأم الرقمي الصناعي'
                    : 'AI Fire Control System & Tasour 3D Industrial Digital Twin'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/projects')}
              className="p-4 rounded-2xl tech-hud-card flex items-start gap-3.5 text-start cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl theme-bg-elevated border theme-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 theme-accent-text" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono-tabular font-bold theme-accent-text">
                  02 · SMART E-COMMERCE
                </div>
                <div className="text-sm font-extrabold theme-text-primary">
                  {isAr
                    ? 'المتاجر والأسواق الرقمية الذكية'
                    : 'Smart E-Commerce & Marketplaces'}
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  {isAr
                    ? 'رفيد ماركتس، متجر فرش، وباويرا جلوبال للتجارة الحديثة'
                    : 'Rufid Markets, FRESH Store & Pawera Global'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/projects')}
              className="p-4 rounded-2xl tech-hud-card flex items-start gap-3.5 text-start cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl theme-bg-elevated border theme-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5 theme-accent-text" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono-tabular font-bold theme-accent-text">
                  03 · CLOUD ERP & PLATFORMS
                </div>
                <div className="text-sm font-extrabold theme-text-primary">
                  {isAr
                    ? 'الأنظمة المحاسبية ومنصات القطاعات'
                    : 'Cloud ERP, EdTech & HealthTech'}
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  {isAr
                    ? 'نظام FINB المحاسبي، نوفارو ERP، منارة اليمن، وساحة الصحة'
                    : 'FINB Accounting, NOVARO ERP, Al-Manara & Seha Square'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/services')}
              className="p-4 rounded-2xl tech-hud-card flex items-start gap-3.5 text-start cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl theme-bg-elevated border theme-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 theme-accent-text" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono-tabular font-bold theme-accent-text">
                  04 · FULL-STACK ARCHITECTURE
                </div>
                <div className="text-sm font-extrabold theme-text-primary">
                  {isAr
                    ? 'هندسة موثقة وروابط تشغيل حية'
                    : 'Verified Engineering & Live Systems'}
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  {isAr
                    ? 'دراسات حالة تفصيلية، معماريات نظيفة، وتجارب تفاعلية'
                    : 'Detailed case studies, clean architectures & live demos'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>
    );
  }
);

