import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, SERVICES_DATA, UI_TRANSLATIONS } from '../data/portfolioData';

interface ServicesSectionProps {
  lang: Language;
  onInquireService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = React.memo(
  ({ lang, onInquireService }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].services;
    const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

    return (
      <section className="theme-bg-surface theme-section-spacing border-b theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3 mb-12">
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
            {SERVICES_DATA.map((service) => {
              const serviceTitle = isAr ? service.titleAr : service.titleEn;
              const scopePoints = isAr
                ? service.scopePointsAr
                : service.scopePointsEn;
              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-2xl theme-card space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold theme-text-primary">
                      <span className="font-mono-tabular theme-accent-text me-2">
                        {service.index}.
                      </span>
                      {serviceTitle}
                    </h3>

                    <p className="text-sm theme-text-secondary leading-relaxed">
                      {isAr ? service.descriptionAr : service.descriptionEn}
                    </p>

                    <ul className="space-y-2 pt-3 border-t theme-border text-xs theme-text-secondary">
                      {scopePoints.map((pt, idx) => (
                        <li key={idx} className="leading-relaxed">
                          • {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t theme-border">
                    <button
                      type="button"
                      onClick={() => onInquireService(serviceTitle)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold theme-accent-text hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap"
                    >
                      <span>{t.inquireService}</span>
                      <ArrowIcon
                        className="w-3.5 h-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
);
