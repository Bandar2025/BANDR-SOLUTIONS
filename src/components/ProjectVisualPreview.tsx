import React, { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Language, ProjectItem, UI_TRANSLATIONS } from '../data/portfolioData';

interface ProjectVisualPreviewProps {
  project: ProjectItem;
  lang: Language;
  overrideImageUrl?: string | null;
  heightClass?: string;
  priorityLoading?: boolean;
}

export const ProjectVisualPreview: React.FC<ProjectVisualPreviewProps> =
  React.memo(
    ({
      project,
      lang,
      overrideImageUrl,
      heightClass = 'h-52',
      priorityLoading = false,
    }) => {
      const isAr = lang === 'ar';
      const t = UI_TRANSLATIONS[lang].projects;
      const [imgLoaded, setImgLoaded] = useState(false);
      const [imgError, setImgError] = useState(false);

      const candidateSrc =
        overrideImageUrl ||
        (project.thumbnailUrl && project.thumbnailUrl.trim().length > 0
          ? project.thumbnailUrl
          : project.genuineScreenshotPath || null);

      useEffect(() => {
        setImgLoaded(false);
        setImgError(false);
      }, [candidateSrc]);

      const { accentHex, secondaryHex, domainCode, diagramType } =
        project.illustrativeTheme;

      const resolvedAltText = isAr
        ? project.thumbnailAltAr ||
          project.screenshotCaptionAr ||
          project.nameAr
        : project.thumbnailAltEn ||
          project.screenshotCaptionEn ||
          project.nameEn;

      const renderDiagramSvg = () => {
        switch (diagramType) {
          case 'ecommerce_storefront':
          case 'digital_commerce':
          case 'global_catalog':
            return (
              <svg
                viewBox="0 0 360 180"
                className="w-full h-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id={`grad-${project.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.24" />
                    <stop
                      offset="100%"
                      stopColor={secondaryHex}
                      stopOpacity="0.08"
                    />
                  </linearGradient>
                </defs>
                <rect
                  width="360"
                  height="180"
                  fill={`url(#grad-${project.id})`}
                />
                <g stroke={accentHex} strokeOpacity="0.35" strokeWidth="1.2" fill="none">
                  <rect x="34" y="32" width="90" height="110" rx="8" />
                  <rect x="135" y="32" width="90" height="110" rx="8" />
                  <rect x="236" y="32" width="90" height="110" rx="8" />
                  <line x1="46" y1="115" x2="112" y2="115" />
                  <line x1="147" y1="115" x2="213" y2="115" />
                  <line x1="248" y1="115" x2="314" y2="115" />
                </g>
              </svg>
            );

          case 'school_platform':
          case 'healthcare_portal':
          case 'corporate_web':
            return (
              <svg
                viewBox="0 0 360 180"
                className="w-full h-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id={`grad-${project.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.25" />
                    <stop
                      offset="100%"
                      stopColor={secondaryHex}
                      stopOpacity="0.1"
                    />
                  </linearGradient>
                </defs>
                <rect
                  width="360"
                  height="180"
                  fill={`url(#grad-${project.id})`}
                />
                <g stroke={accentHex} strokeOpacity="0.35" strokeWidth="1.2" fill="none">
                  <circle cx="180" cy="90" r="46" />
                  <circle
                    cx="180"
                    cy="90"
                    r="68"
                    strokeDasharray="6 6"
                  />
                  <line x1="60" y1="90" x2="300" y2="90" />
                  <line x1="180" y1="22" x2="180" y2="158" />
                </g>
              </svg>
            );

          case 'accounting_ledger':
          case 'ai_web_platform':
          case 'fire_cv_iot':
          default:
            return (
              <svg
                viewBox="0 0 360 180"
                className="w-full h-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id={`grad-${project.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={accentHex} stopOpacity="0.25" />
                    <stop
                      offset="100%"
                      stopColor={secondaryHex}
                      stopOpacity="0.08"
                    />
                  </linearGradient>
                </defs>
                <rect
                  width="360"
                  height="180"
                  fill={`url(#grad-${project.id})`}
                />
                <g stroke={accentHex} strokeOpacity="0.4" strokeWidth="1.3" fill="none">
                  <polygon points="180,30 235,62 235,118 180,150 125,118 125,62" />
                  <polyline points="48,132 105,94 152,112 215,64 268,88 314,48" />
                </g>
              </svg>
            );
        }
      };

      const showGenuineImage = Boolean(candidateSrc && !imgError);

      return (
        <div
          className={`relative w-full ${heightClass} bg-[#0B1020] border-b theme-border overflow-hidden select-none`}
        >
          {/* Real Project Screenshot (When Uploaded by Owner in Admin or Present in Assets) */}
          {showGenuineImage && (
            <img
              src={candidateSrc!}
              alt={resolvedAltText}
              loading={priorityLoading ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover object-top transition-opacity duration-200 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Clearly Labeled Non-Deceptive Illustrative Category Graphic */}
          {(!showGenuineImage || !imgLoaded) && (
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-[#0B1020] text-slate-200">
              {renderDiagramSvg()}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/80">
                    {domainCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 text-slate-300 truncate max-w-[72%]">
                    {t.illustrativeNotice}
                  </span>
                </div>

                <div className="space-y-0.5 bg-slate-950/80 backdrop-blur-xs p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-[11px] text-blue-400 font-medium">
                    {isAr ? project.categoryLabelAr : project.categoryLabelEn}
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {isAr ? project.nameAr : project.nameEn}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Authentic Screenshot Caption Badge */}
          {showGenuineImage && imgLoaded && (
            <div className="absolute top-3 start-3 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/85 border border-blue-500/40 text-[11px] font-medium text-blue-200">
                <ImageIcon className="w-3 h-3 text-blue-400" aria-hidden="true" />
                <span>{t.genuineScreenshotBadge}</span>
              </span>
            </div>
          )}
        </div>
      );
    }
  );
