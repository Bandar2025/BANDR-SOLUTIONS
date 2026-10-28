import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Send,
} from 'lucide-react';
import {
  Language,
  OWNER_PROFILE,
  PhoneDisplayMode,
  PROFESSIONAL_PROFILES,
  SERVICES_DATA,
  UI_TRANSLATIONS,
} from '../data/portfolioData';
import { recordContactInteraction } from '../lib/analyticsService';

interface ContactSectionProps {
  lang: Language;
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = React.memo(
  ({ lang, preselectedService }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].contact;

    // Configurable Phone Privacy State ('click-to-call' | 'visible' | 'hidden')
    const [phoneMode, setPhoneMode] = useState<PhoneDisplayMode>(
      OWNER_PROFILE.defaultPhoneDisplayMode
    );
    const [phoneRevealed, setPhoneRevealed] = useState(false);

    // Client-Side Validated Project Brief Builder State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [projectType, setProjectType] = useState(preselectedService || '');
    const [message, setMessage] = useState('');
    const [touched, setTouched] = useState(false);
    const [briefPrepared, setBriefPrepared] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hasTrackedFieldFocus, setHasTrackedFieldFocus] = useState(false);

    useEffect(() => {
      recordContactInteraction('form_view');
    }, []);

    useEffect(() => {
      if (preselectedService) {
        setProjectType(preselectedService);
        recordContactInteraction('field_interaction', preselectedService);
      }
    }, [preselectedService]);

    const handleTrackFirstInteraction = () => {
      if (!hasTrackedFieldFocus) {
        setHasTrackedFieldFocus(true);
        recordContactInteraction('field_interaction', projectType || undefined);
      }
    };

    const errors = {
      name: name.trim().length < 2 ? t.errors.nameRequired : '',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? t.errors.emailInvalid
        : '',
      projectType: !projectType.trim() ? t.errors.projectTypeRequired : '',
      message: message.trim().length < 15 ? t.errors.messageShort : '',
    };

    const isValid =
      !errors.name && !errors.email && !errors.projectType && !errors.message;

    const formattedBrief = [
      `Bandr Solutions — Project Inquiry Brief`,
      `----------------------------------------`,
      `Client Name: ${name.trim()}`,
      `Client Email: ${email.trim()}`,
      `Project Category: ${projectType.trim()}`,
      `----------------------------------------`,
      `Project Details:`,
      message.trim(),
    ].join('\n');

    const mailtoHref = `mailto:${OWNER_PROFILE.email}?subject=${encodeURIComponent(
      `[Bandr Solutions Inquiry] ${projectType.trim()} — ${name.trim()}`
    )}&body=${encodeURIComponent(formattedBrief)}`;

    const handlePrepareBrief = (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      handleTrackFirstInteraction();
      if (isValid) {
        setBriefPrepared(true);
        recordContactInteraction('brief_prepared', projectType.trim());
      }
    };

    const handleCopyBrief = async () => {
      recordContactInteraction('copy_brief', projectType.trim());
      try {
        await navigator.clipboard.writeText(formattedBrief);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 3000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = formattedBrief;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 3000);
      }
    };

    return (
      <section className="theme-bg-surface theme-section-spacing">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Verified Contact Details, Configurable Phone Privacy & Profile Links */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl theme-card-elevated space-y-6">
                <h3 className="text-base font-bold theme-text-primary border-b theme-border pb-3">
                  {t.directChannelsTitle}
                </h3>

                {/* Official Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl theme-bg-surface border theme-border flex items-center justify-center shrink-0">
                    <Mail
                      className="w-4 h-4 theme-accent-text"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs theme-text-muted">{t.emailLabel}</div>
                    <a
                      href={`mailto:${OWNER_PROFILE.email}`}
                      className="text-sm font-mono-tabular font-semibold theme-accent-text hover:underline break-all"
                    >
                      {OWNER_PROFILE.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl theme-bg-surface border theme-border flex items-center justify-center shrink-0">
                    <MapPin
                      className="w-4 h-4 theme-accent-text"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="text-xs theme-text-muted">
                      {t.locationLabel}
                    </div>
                    <div className="text-sm font-medium theme-text-primary">
                      {isAr
                        ? OWNER_PROFILE.locationAr
                        : OWNER_PROFILE.locationEn}
                    </div>
                  </div>
                </div>

                {/* Configurable Public Phone Privacy Block */}
                <div className="pt-4 border-t theme-border space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs theme-text-muted flex items-center gap-1.5">
                      <Shield
                        className="w-3.5 h-3.5 theme-accent-text"
                        aria-hidden="true"
                      />
                      <span>{t.phonePrivacyLabel}</span>
                    </span>
                  </div>

                  {/* Owner Privacy Mode Switcher */}
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        { id: 'click-to-call', label: t.phoneModeClickToCall },
                        { id: 'visible', label: t.phoneModeVisible },
                        { id: 'hidden', label: t.phoneModeHidden },
                      ] as { id: PhoneDisplayMode; label: string }[]
                    ).map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setPhoneMode(mode.id);
                          if (mode.id !== 'click-to-call')
                            setPhoneRevealed(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          phoneMode === mode.id
                            ? 'theme-btn-primary'
                            : 'theme-btn-secondary'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {phoneMode !== 'hidden' && (
                    <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl theme-bg-surface border theme-border">
                      <div className="flex items-center gap-3">
                        <Phone
                          className="w-4 h-4 theme-accent-text shrink-0"
                          aria-hidden="true"
                        />
                        <div>
                          <div className="text-[11px] theme-text-muted">
                            {t.phoneLabel}
                          </div>
                          {phoneMode === 'visible' || phoneRevealed ? (
                            <a
                              href={`tel:${OWNER_PROFILE.phone.replace(
                                /\s+/g,
                                ''
                              )}`}
                              dir="ltr"
                              className="text-sm font-mono-tabular font-semibold theme-text-primary hover:theme-accent-text"
                            >
                              {OWNER_PROFILE.phone}
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPhoneRevealed(true)}
                              className="text-xs font-semibold theme-accent-text underline cursor-pointer"
                            >
                              {t.revealPhoneBtn}
                            </button>
                          )}
                        </div>
                      </div>

                      <a
                        href={`tel:${OWNER_PROFILE.phone.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 rounded-lg theme-btn-primary text-xs font-semibold whitespace-nowrap shrink-0"
                      >
                        {t.callNowBtn}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Freelance & Professional Links */}
              <div className="p-6 rounded-2xl theme-card space-y-3">
                <h3 className="text-xs font-bold theme-text-primary tracking-wide">
                  {isAr
                    ? 'التواصل عبر المنصات المهنية والحسابات الموثقة'
                    : 'Connect via Verified Professional Platforms'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROFESSIONAL_PROFILES.map((profile) => (
                    <a
                      key={profile.id}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl theme-btn-secondary text-xs font-semibold"
                    >
                      <span className="truncate">
                        {isAr ? profile.platformNameAr : profile.platformNameEn}
                      </span>
                      <ExternalLink
                        className="w-3.5 h-3.5 theme-accent-text shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Client-Side Validated Project Brief Builder */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl theme-card space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold theme-text-primary">
                    {t.formTitle}
                  </h3>
                  <p className="text-xs theme-text-secondary leading-relaxed theme-card-elevated p-3.5 rounded-xl">
                    {t.formNotice}
                  </p>
                </div>

                <form
                  onSubmit={handlePrepareBrief}
                  noValidate
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold theme-text-primary mb-1.5"
                      >
                        {t.nameLabel} *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setBriefPrepared(false);
                        }}
                        placeholder={t.namePlaceholder}
                        aria-invalid={touched && Boolean(errors.name)}
                        aria-describedby={
                          touched && errors.name ? 'err-name' : undefined
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                      />
                      {touched && errors.name && (
                        <p
                          id="err-name"
                          className="mt-1 text-xs text-red-400 font-medium"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold theme-text-primary mb-1.5"
                      >
                        {t.emailInputLabel} *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        dir="ltr"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setBriefPrepared(false);
                        }}
                        placeholder={t.emailPlaceholder}
                        aria-invalid={touched && Boolean(errors.email)}
                        aria-describedby={
                          touched && errors.email ? 'err-email' : undefined
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                      />
                      {touched && errors.email && (
                        <p
                          id="err-email"
                          className="mt-1 text-xs text-red-400 font-medium"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Project Type Selector */}
                  <div>
                    <label
                      htmlFor="contact-project-type"
                      className="block text-xs font-semibold theme-text-primary mb-1.5"
                    >
                      {t.projectTypeLabel} *
                    </label>
                    <select
                      id="contact-project-type"
                      value={projectType}
                      onChange={(e) => {
                        setProjectType(e.target.value);
                        setBriefPrepared(false);
                      }}
                      aria-invalid={touched && Boolean(errors.projectType)}
                      aria-describedby={
                        touched && errors.projectType ? 'err-type' : undefined
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                    >
                      <option value="">{t.projectTypePlaceholder}</option>
                      {SERVICES_DATA.map((s) => {
                        const label = isAr ? s.titleAr : s.titleEn;
                        return (
                          <option key={s.id} value={label}>
                            {label}
                          </option>
                        );
                      })}
                      <option
                        value={
                          isAr
                            ? 'مشروع ذكاء اصطناعي أو أنظمة مدمجة'
                            : 'AI / Computer Vision / IoT Project'
                        }
                      >
                        {isAr
                          ? 'مشروع ذكاء اصطناعي أو أنظمة مدمجة'
                          : 'AI / Computer Vision / IoT Project'}
                      </option>
                    </select>
                    {touched && errors.projectType && (
                      <p
                        id="err-type"
                        className="mt-1 text-xs text-red-400 font-medium"
                      >
                        {errors.projectType}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold theme-text-primary mb-1.5"
                    >
                      {t.messageLabel} *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setBriefPrepared(false);
                      }}
                      placeholder={t.messagePlaceholder}
                      aria-invalid={touched && Boolean(errors.message)}
                      aria-describedby={
                        touched && errors.message ? 'err-msg' : undefined
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                    />
                    {touched && errors.message && (
                      <p
                        id="err-msg"
                        className="mt-1 text-xs text-red-400 font-medium"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl theme-btn-primary text-sm font-semibold cursor-pointer"
                  >
                    <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t.submitPrepareBtn}</span>
                  </button>
                </form>

                {/* Prepared Brief Actions (Copy & Mailto) */}
                {briefPrepared && isValid && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="p-5 rounded-xl theme-card-elevated space-y-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold theme-accent-text">
                        {isAr
                          ? 'ملخص المشروع جاهز للنسخ أو الفتح في البريد الإلكتروني'
                          : 'Structured Project Brief Ready'}
                      </span>
                      <span className="text-xs font-mono-tabular theme-text-muted">
                        To: {OWNER_PROFILE.email}
                      </span>
                    </div>

                    <pre
                      dir="ltr"
                      className="p-3.5 rounded-lg theme-bg-primary theme-text-primary text-xs font-mono-tabular whitespace-pre-wrap overflow-x-auto border theme-border"
                    >
                      {formattedBrief}
                    </pre>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyBrief}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg theme-btn-primary text-xs font-semibold cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 shrink-0" />
                            <span>{t.copiedSuccess}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 shrink-0" />
                            <span>{t.copyBriefBtn}</span>
                          </>
                        )}
                      </button>

                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg theme-btn-secondary text-xs font-semibold"
                      >
                        <Mail className="w-4 h-4 shrink-0" />
                        <span>{t.openMailClientBtn}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
