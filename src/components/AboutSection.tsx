import React from 'react';
import { GraduationCap, Globe2, UserCheck, Cpu } from 'lucide-react';
import {
  Language,
  OWNER_PROFILE,
  TECHNICAL_SKILLS_INVENTORY,
  UI_TRANSLATIONS,
} from '../data/portfolioData';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = React.memo(({ lang }) => {
  const isAr = lang === 'ar';
  const t = UI_TRANSLATIONS[lang].about;

  return (
    <section className="theme-bg-primary theme-section-spacing border-b theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold theme-accent-text tracking-wide">
            {t.sectionKicker}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight theme-text-primary">
            {t.sectionTitle}
          </h2>
        </div>

        {/* Profile & Brand Identity Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand Introduction & CV Engineering Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl theme-card space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold theme-accent-text">
                <UserCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.brandIntroHeading}</span>
              </div>
              <p className="text-base theme-text-primary leading-relaxed font-medium">
                {isAr ? OWNER_PROFILE.aboutBrandAr : OWNER_PROFILE.aboutBrandEn}
              </p>
            </div>

            <div className="rounded-2xl theme-card-elevated p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold theme-accent-text">
                  {t.cvSummaryHeading}
                </div>
                <span className="text-xs font-mono-tabular theme-text-muted">
                  {isAr ? OWNER_PROFILE.locationAr : OWNER_PROFILE.locationEn}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold theme-text-primary">
                  {isAr ? OWNER_PROFILE.fullNameAr : OWNER_PROFILE.fullNameEn}
                </h3>
                <div className="text-sm theme-accent-text font-medium mt-0.5">
                  {isAr ? OWNER_PROFILE.titleAr : OWNER_PROFILE.titleEn}
                </div>
              </div>
              <p className="text-sm theme-text-secondary leading-relaxed">
                {isAr ? OWNER_PROFILE.cvSummaryAr : OWNER_PROFILE.cvSummaryEn}
              </p>
            </div>
          </div>

          {/* Education & Languages */}
          <div className="lg:col-span-5 space-y-6">
            {/* Academic Credentials */}
            <div className="rounded-2xl theme-card space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold theme-accent-text">
                <GraduationCap className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.educationHeading}</span>
              </div>
              <h3 className="text-base font-bold theme-text-primary">
                {isAr
                  ? OWNER_PROFILE.education.degreeAr
                  : OWNER_PROFILE.education.degreeEn}
              </h3>
              <div className="text-sm theme-text-secondary">
                {isAr
                  ? OWNER_PROFILE.education.universityAr
                  : OWNER_PROFILE.education.universityEn}
              </div>
              <div className="text-xs font-mono-tabular theme-text-muted">
                {isAr
                  ? OWNER_PROFILE.education.graduationAr
                  : OWNER_PROFILE.education.graduationEn}
              </div>
            </div>

            {/* Languages */}
            <div className="rounded-2xl theme-card space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold theme-accent-text">
                <Globe2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.languagesHeading}</span>
              </div>
              <div className="space-y-3">
                {OWNER_PROFILE.languages.map((item) => (
                  <div
                    key={item.languageEn}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b theme-border last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm font-bold theme-text-primary">
                      {isAr ? item.languageAr : item.languageEn}
                    </span>
                    <span className="text-xs theme-text-secondary">
                      {isAr ? item.proficiencyAr : item.proficiencyEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Complete 6-Domain Technical Skills Inventory (CV Source of Truth) */}
        <div className="space-y-8 pt-6 border-t theme-border">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold theme-accent-text">
              <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {isAr
                  ? 'مصفوفة المهارات التقنية الموثقة'
                  : 'Verified Technical Skills Matrix'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold theme-text-primary">
              {t.skillsHeading}
            </h3>
            <p className="text-sm theme-text-secondary">{t.skillsSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap">
            {TECHNICAL_SKILLS_INVENTORY.map((group, index) => (
              <div
                key={group.id}
                className="rounded-2xl theme-card flex flex-col justify-between space-y-5"
              >
                <div className="space-y-2">
                  <div className="text-xs font-mono-tabular theme-accent-text">
                    0{index + 1} · {isAr ? group.titleAr : group.titleEn}
                  </div>
                  <h4 className="text-base font-bold theme-text-primary">
                    {isAr ? group.titleAr : group.titleEn}
                  </h4>
                  <p className="text-xs theme-text-muted leading-relaxed">
                    {isAr ? group.summaryAr : group.summaryEn}
                  </p>
                </div>

                {/* Unboxed clean typographic skill list with separators */}
                <div className="pt-4 border-t theme-border flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs font-medium theme-text-secondary">
                  {group.skills.map((skill, idx) => (
                    <React.Fragment key={skill.nameEn}>
                      {idx > 0 && (
                        <span
                          className="theme-text-muted select-none"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                      )}
                      <span>{isAr ? skill.nameAr : skill.nameEn}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
