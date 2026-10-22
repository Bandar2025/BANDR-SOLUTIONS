import React from 'react';
import { ExternalLink, Briefcase, Code2, Linkedin } from 'lucide-react';
import {
  Language,
  PROFESSIONAL_PROFILES,
  ProfessionalProfile,
  UI_TRANSLATIONS,
} from '../data/portfolioData';

interface ProfilesSectionProps {
  lang: Language;
}

export const ProfilesSection: React.FC<ProfilesSectionProps> = React.memo(
  ({ lang }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].profiles;

    const getIcon = (type: ProfessionalProfile['categoryType']) => {
      if (type === 'code_repository')
        return <Code2 className="w-5 h-5 theme-accent-text" />;
      if (type === 'professional_network')
        return <Linkedin className="w-5 h-5 theme-accent-text" />;
      return <Briefcase className="w-5 h-5 theme-accent-text" />;
    };

    return (
      <section className="theme-bg-primary border-y theme-border theme-section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3 mb-10">
            <div className="text-xs font-semibold theme-accent-text tracking-wide">
              {t.sectionKicker}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight theme-text-primary">
              {t.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base theme-text-secondary leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap">
            {PROFESSIONAL_PROFILES.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col justify-between rounded-2xl theme-card space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl theme-card-elevated flex items-center justify-center shrink-0">
                      {getIcon(profile.categoryType)}
                    </div>
                    <span className="text-xs font-mono-tabular theme-text-muted">
                      @{profile.handle}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs theme-accent-text font-medium mb-1">
                      {isAr ? profile.roleLabelAr : profile.roleLabelEn}
                    </div>
                    <h3 className="text-lg font-bold theme-text-primary">
                      {isAr ? profile.platformNameAr : profile.platformNameEn}
                    </h3>
                  </div>

                  <p className="text-sm theme-text-secondary leading-relaxed">
                    {isAr ? profile.descriptionAr : profile.descriptionEn}
                  </p>
                </div>

                <div className="pt-4 border-t theme-border flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono-tabular theme-text-muted truncate max-w-[55%]">
                    {profile.url.replace(/^https?:\/\//, '')}
                  </span>

                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg theme-btn-primary text-xs font-semibold whitespace-nowrap shrink-0"
                  >
                    <span>{isAr ? profile.ctaAr : profile.ctaEn}</span>
                    <ExternalLink
                      className="w-3.5 h-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);
