import React from 'react';
import { Language } from '../data/portfolioData';

interface HeroStaticEmblemProps {
  lang: Language;
  onEnable3D?: () => void;
  canEnable3D?: boolean;
  reasonNote?: string;
}

export const HeroStaticEmblem: React.FC<HeroStaticEmblemProps> = React.memo(
  ({ lang, onEnable3D, canEnable3D = true, reasonNote }) => {
    const isAr = lang === 'ar';

    return (
      <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] rounded-2xl theme-bg-surface border theme-border overflow-hidden flex flex-col justify-between p-6 select-none">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 z-10">
          <span className="text-xs font-mono-tabular theme-text-muted tracking-wider">
            {isAr
              ? 'نواة الهندسة المعمارية · عرض متجهي'
              : 'ARCHITECTURAL CORE · VECTOR VIEW'}
          </span>
          {canEnable3D && onEnable3D && (
            <button
              type="button"
              onClick={onEnable3D}
              className="px-3 py-1.5 text-xs font-semibold theme-btn-secondary rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isAr
                ? 'تشغيل المجسم ثلاثي الأبعاد (3D)'
                : 'Enable Interactive 3D Emblem'}
            </button>
          )}
        </div>

        {/* Center Architectural SVG Emblem */}
        <div className="relative flex-1 flex items-center justify-center my-2">
          <svg
            viewBox="0 0 400 320"
            className="w-full max-w-[330px] h-auto max-h-[250px]"
            role="img"
            aria-label={
              isAr
                ? 'شعار هندسي معماري لـ Bandr Solutions'
                : 'Bandr Solutions architectural geometric emblem'
            }
          >
            <defs>
              <linearGradient id="bsCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-primary)" />
                <stop offset="100%" stopColor="var(--accent-secondary)" />
              </linearGradient>
              <radialGradient id="bsGlow" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  stopColor="var(--accent-primary)"
                  stopOpacity="0.22"
                />
                <stop offset="100%" stopColor="var(--bg-surface)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Radial ambient backdrop */}
            <circle cx="200" cy="160" r="142" fill="url(#bsGlow)" />

            {/* Outer precision gimbal ring */}
            <circle
              cx="200"
              cy="160"
              r="122"
              fill="none"
              stroke="var(--border-strong)"
              strokeWidth="1.5"
            />
            <circle
              cx="200"
              cy="160"
              r="110"
              fill="none"
              stroke="url(#bsCoreGrad)"
              strokeWidth="2"
              strokeDasharray="18 8 4 8"
            />

            {/* Isometric structural struts */}
            <line
              x1="90"
              y1="160"
              x2="310"
              y2="160"
              stroke="var(--border-strong)"
              strokeWidth="1.25"
            />
            <line
              x1="200"
              y1="50"
              x2="200"
              y2="270"
              stroke="var(--border-strong)"
              strokeWidth="1.25"
            />
            <line
              x1="122"
              y1="82"
              x2="278"
              y2="238"
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />
            <line
              x1="278"
              y1="82"
              x2="122"
              y2="238"
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />

            {/* Octagonal frame */}
            <polygon
              points="200,68 265,95 292,160 265,225 200,252 135,225 108,160 135,95"
              fill="var(--bg-elevated)"
              stroke="var(--border-strong)"
              strokeWidth="1.5"
            />

            {/* Inner hexagonal core */}
            <polygon
              points="200,90 260,125 260,195 200,230 140,195 140,125"
              fill="var(--bg-primary)"
              stroke="url(#bsCoreGrad)"
              strokeWidth="2.5"
            />

            {/* Orbital nodes */}
            <circle cx="200" cy="50" r="4.5" fill="var(--accent-primary)" />
            <circle cx="310" cy="160" r="4.5" fill="var(--accent-primary)" />
            <circle cx="200" cy="270" r="4.5" fill="var(--accent-secondary)" />
            <circle cx="90" cy="160" r="4.5" fill="var(--accent-primary)" />

            {/* BS Monogram Typography */}
            <text
              x="200"
              y="170"
              textAnchor="middle"
              fill="var(--text-primary)"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="800"
              fontSize="38"
              letterSpacing="2"
            >
              BS
            </text>
            <text
              x="200"
              y="195"
              textAnchor="middle"
              fill="var(--accent-primary)"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
              fontSize="9"
              letterSpacing="2.5"
            >
              BANDR SOLUTIONS
            </text>
          </svg>
        </div>

        {/* Bottom caption */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t theme-border text-xs theme-text-muted z-10">
          <span>
            {reasonNote ||
              (isAr
                ? 'تصميم هندسي خفيف الوزن ومتوافق مع تقليل الحركة'
                : 'Lightweight architectural vector view (Reduced-Motion ready)')}
          </span>
          <span className="font-mono-tabular">BS · 2026</span>
        </div>
      </div>
    );
  }
);
