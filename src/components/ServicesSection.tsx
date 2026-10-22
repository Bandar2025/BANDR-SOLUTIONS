import React, { useId, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Cpu,
  Database,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  Layers,
  LineChart,
  Mail,
  Network,
  Palette,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  User,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';
import {
  Language,
  SERVICE_CATEGORIES_DATA,
  SERVICES_DATA,
  ServiceCategory,
  ServiceItem,
  UI_TRANSLATIONS,
} from '../data/portfolioData';

interface ServicesSectionProps {
  lang: Language;
  onInquireService?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = React.memo(
  ({ lang, onInquireService }) => {
    const isAr = lang === 'ar';
    const t = UI_TRANSLATIONS[lang].services;
    const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

    // Filter by category
    const [selectedCategory, setSelectedCategory] =
      useState<ServiceCategory | 'all'>('all');

    // Service Request Modal state
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');

    // Service Request Form fields
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [projectScope, setProjectScope] = useState('');
    const [expectedTimeline, setExpectedTimeline] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [preparedBrief, setPreparedBrief] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const nameInputId = useId();
    const emailInputId = useId();
    const serviceSelectId = useId();
    const scopeInputId = useId();
    const timelineInputId = useId();

    const filteredServices = useMemo(() => {
      if (selectedCategory === 'all') return SERVICES_DATA;
      return SERVICES_DATA.filter((s) => s.category === selectedCategory);
    }, [selectedCategory]);

    const handleOpenInquiry = (service: ServiceItem) => {
      const serviceTitle = isAr ? service.titleAr : service.titleEn;
      setSelectedServiceId(service.id);
      setRequestModalOpen(true);
      setPreparedBrief(null);
      setCopied(false);
      if (onInquireService) {
        onInquireService(serviceTitle);
      }
    };

    const handleValidateAndPrepare = (e: React.FormEvent) => {
      e.preventDefault();
      const errors: Record<string, string> = {};

      if (!clientName.trim() || clientName.trim().length < 2) {
        errors.clientName = isAr
          ? 'يرجى إدخال الاسم الكريم (حرفين على الأقل).'
          : 'Please enter your name (minimum 2 characters).';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!clientEmail.trim() || !emailRegex.test(clientEmail.trim())) {
        errors.clientEmail = isAr
          ? 'يرجى إدخال عنوان بريد إلكتروني صالح للتواصل.'
          : 'Please enter a valid contact email address.';
      }

      if (!projectScope.trim() || projectScope.trim().length < 15) {
        errors.projectScope = isAr
          ? 'يرجى كتابة وصف مختصر لاحتياجات المشروع (15 حرفاً على الأقل).'
          : 'Please describe your project requirements (minimum 15 characters).';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setFormErrors({});
      const activeService = SERVICES_DATA.find((s) => s.id === selectedServiceId);
      const serviceName = activeService
        ? isAr
          ? activeService.titleAr
          : activeService.titleEn
        : isAr
        ? 'طلب استشارة وتطوير عام'
        : 'General Consultation & Engineering';

      const briefText = isAr
        ? `طلب خدمة تقنية — Bandr Solutions\n----------------------------------------\nالخدمة المطلوبة: ${serviceName}\nاسم العميل: ${clientName.trim()}\nالبريد الإلكتروني: ${clientEmail.trim()}\nالموعد المتوقع: ${
            expectedTimeline.trim() || 'مرن / حسب التقدير الفني'
          }\n\nتفاصيل ومتطلبات المشروع:\n${projectScope.trim()}\n----------------------------------------\nمرسل عبر موقع Bandr Solutions الرسمي`
        : `Technical Service Inquiry — Bandr Solutions\n----------------------------------------\nRequested Service: ${serviceName}\nClient Name: ${clientName.trim()}\nEmail: ${clientEmail.trim()}\nTarget Timeline: ${
            expectedTimeline.trim() || 'Flexible / Subject to estimation'
          }\n\nProject Scope & Requirements:\n${projectScope.trim()}\n----------------------------------------\nSent via official Bandr Solutions portfolio`;

      setPreparedBrief(briefText);
    };

    const handleCopyBrief = () => {
      if (!preparedBrief) return;
      navigator.clipboard.writeText(preparedBrief).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    };

    const handleOpenMailClient = () => {
      if (!preparedBrief) return;
      const activeService = SERVICES_DATA.find((s) => s.id === selectedServiceId);
      const subject = encodeURIComponent(
        isAr
          ? `طلب خدمة: ${activeService?.titleAr || 'مشروع جديد'} — من ${clientName}`
          : `Service Inquiry: ${activeService?.titleEn || 'New Project'} — from ${clientName}`
      );
      const body = encodeURIComponent(preparedBrief);
      window.location.href = `mailto:bandr246899@gmail.com?subject=${subject}&body=${body}`;
    };

    const renderServiceIcon = (iconKey?: string) => {
      const cls = 'w-5 h-5 theme-accent-text shrink-0';
      switch (iconKey) {
        case 'Globe':
          return <Globe className={cls} aria-hidden="true" />;
        case 'ShoppingCart':
          return <ShoppingCart className={cls} aria-hidden="true" />;
        case 'Layers':
          return <Layers className={cls} aria-hidden="true" />;
        case 'Database':
          return <Database className={cls} aria-hidden="true" />;
        case 'Cpu':
          return <Cpu className={cls} aria-hidden="true" />;
        case 'Sparkles':
          return <Sparkles className={cls} aria-hidden="true" />;
        case 'Bot':
          return <Bot className={cls} aria-hidden="true" />;
        case 'Zap':
          return <Zap className={cls} aria-hidden="true" />;
        case 'Network':
          return <Network className={cls} aria-hidden="true" />;
        case 'FileSpreadsheet':
          return <FileSpreadsheet className={cls} aria-hidden="true" />;
        case 'Filter':
          return <Filter className={cls} aria-hidden="true" />;
        case 'LineChart':
          return <LineChart className={cls} aria-hidden="true" />;
        case 'Search':
          return <Search className={cls} aria-hidden="true" />;
        case 'BookOpen':
          return <BookOpen className={cls} aria-hidden="true" />;
        case 'UserCheck':
          return <UserCheck className={cls} aria-hidden="true" />;
        case 'Send':
          return <Send className={cls} aria-hidden="true" />;
        case 'GraduationCap':
          return <GraduationCap className={cls} aria-hidden="true" />;
        case 'Palette':
          return <Palette className={cls} aria-hidden="true" />;
        case 'ShieldCheck':
          return <ShieldCheck className={cls} aria-hidden="true" />;
        default:
          return <Code2 className={cls} aria-hidden="true" />;
      }
    };

    return (
      <section
        id="services-section"
        className="theme-bg-surface theme-section-spacing border-b theme-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
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

          {/* Interactive Category Filter Tabs */}
          <div className="mb-10 pb-4 border-b theme-border">
            <div
              role="tablist"
              aria-label={isAr ? 'تصنيفات الخدمات' : 'Service Categories'}
              className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl theme-card-elevated"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'theme-btn-primary shadow-xs'
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                <span>{isAr ? 'جميع الخدمات' : 'All Services'}</span>
                <span className="ms-1.5 opacity-70 font-mono-tabular">
                  ({SERVICES_DATA.length})
                </span>
              </button>

              {SERVICE_CATEGORIES_DATA.map((cat) => {
                const count = SERVICES_DATA.filter((s) => s.category === cat.id).length;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'theme-btn-primary shadow-xs'
                        : 'theme-text-secondary hover:theme-text-primary'
                    }`}
                  >
                    <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                    <span className="ms-1.5 opacity-70 font-mono-tabular">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 theme-grid-gap">
            {filteredServices.map((service) => {
              const serviceTitle = isAr ? service.titleAr : service.titleEn;
              const scopePoints = isAr ? service.scopePointsAr : service.scopePointsEn;
              const deliverables = isAr
                ? service.expectedDeliverablesAr
                : service.expectedDeliverablesEn;

              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-2xl theme-card p-6 space-y-6 hover:border-[var(--accent-primary)] transition-all shadow-xs"
                >
                  <div className="space-y-4">
                    {/* Top Row: Category Label & Icon */}
                    <div className="flex items-center justify-between gap-2 border-b theme-border pb-3">
                      <div className="flex items-center gap-2">
                        {renderServiceIcon(service.iconKey)}
                        <span className="text-[11px] font-bold theme-accent-text">
                          {isAr ? service.categoryLabelAr : service.categoryLabelEn}
                        </span>
                      </div>
                      <span className="text-xs font-mono-tabular theme-text-muted">
                        #{service.index}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold theme-text-primary leading-snug">
                        {serviceTitle}
                      </h3>
                      <p className="text-xs theme-text-secondary leading-relaxed mt-2">
                        {isAr ? service.descriptionAr : service.descriptionEn}
                      </p>
                    </div>

                    {/* Scope Points */}
                    <div className="space-y-2 pt-2 border-t theme-border">
                      <span className="text-[11px] font-bold theme-text-primary block">
                        {isAr ? 'نطاق العمل والتنفيذ:' : 'Scope & Implementation:'}
                      </span>
                      <ul className="space-y-1.5 text-xs theme-text-secondary">
                        {scopePoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="theme-accent-text mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expected Deliverables */}
                    {deliverables && deliverables.length > 0 && (
                      <div className="p-3 rounded-xl theme-bg-elevated border theme-border space-y-1.5">
                        <span className="text-[11px] font-bold theme-accent-text flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{isAr ? 'المخرجات المتوقعة:' : 'Expected Deliverables:'}</span>
                        </span>
                        <ul className="space-y-1 text-[11px] theme-text-secondary">
                          {deliverables.map((del, idx) => (
                            <li key={idx} className="leading-snug">
                              ✓ {del}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-3 border-t theme-border flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenInquiry(service)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl theme-btn-primary text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <span>{isAr ? 'طلب هذه الخدمة' : 'Request Service'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="text-[11px] theme-text-muted font-mono-tabular">
                      BANDR-SVC
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal: Service Inquiry & Brief Builder */}
        {requestModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
          >
            <div
              className="relative w-full max-w-xl theme-bg-surface theme-text-primary rounded-2xl border theme-border shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b theme-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl theme-bg-elevated border theme-border">
                    <Send className="w-5 h-5 theme-accent-text" />
                  </div>
                  <div>
                    <h3 id="inquiry-modal-title" className="text-base font-bold theme-text-primary">
                      {isAr ? 'طلب خدمة واستشارة تقنية' : 'Service Inquiry & Brief Builder'}
                    </h3>
                    <p className="text-xs theme-text-muted mt-0.5">
                      {isAr
                        ? 'تجهيز ملخص المشروع والخدمة المطلوبة بدقة للتواصل المباشر'
                        : 'Structure your project scope for direct consultation'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="p-1.5 rounded-lg theme-btn-secondary cursor-pointer"
                  aria-label={isAr ? 'إغلاق' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!preparedBrief ? (
                <form onSubmit={handleValidateAndPrepare} className="space-y-4">
                  <div>
                    <label
                      htmlFor={serviceSelectId}
                      className="block text-xs font-bold theme-text-primary mb-1.5"
                    >
                      {isAr ? 'الخدمة التقنية المطلوبة *' : 'Selected Service *'}
                    </label>
                    <select
                      id={serviceSelectId}
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl theme-input text-xs font-semibold"
                    >
                      {SERVICES_DATA.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.index}. {isAr ? s.titleAr : s.titleEn} (
                          {isAr ? s.categoryLabelAr : s.categoryLabelEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={nameInputId}
                        className="block text-xs font-bold theme-text-primary mb-1.5"
                      >
                        {isAr ? 'اسمك الكريم أو اسم الجهة *' : 'Your Name / Organization *'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 theme-text-muted absolute top-1/2 -translate-y-1/2 start-3" />
                        <input
                          id={nameInputId}
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder={isAr ? 'مثال: محمد عبدالله' : 'e.g. John Doe'}
                          className="w-full ps-9 pe-3 py-2 rounded-xl theme-input text-xs"
                        />
                      </div>
                      {formErrors.clientName && (
                        <p className="text-[11px] text-red-400 mt-1">{formErrors.clientName}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={emailInputId}
                        className="block text-xs font-bold theme-text-primary mb-1.5"
                      >
                        {isAr ? 'البريد الإلكتروني للتواصل *' : 'Contact Email *'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 theme-text-muted absolute top-1/2 -translate-y-1/2 start-3" />
                        <input
                          id={emailInputId}
                          type="email"
                          required
                          dir="ltr"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full ps-9 pe-3 py-2 rounded-xl theme-input text-xs font-mono-tabular"
                        />
                      </div>
                      {formErrors.clientEmail && (
                        <p className="text-[11px] text-red-400 mt-1">{formErrors.clientEmail}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={scopeInputId}
                      className="block text-xs font-bold theme-text-primary mb-1.5"
                    >
                      {isAr
                        ? 'تفاصيل المطلوب ونطاق المشروع *'
                        : 'Project Scope & Requirements *'}
                    </label>
                    <textarea
                      id={scopeInputId}
                      rows={4}
                      required
                      value={projectScope}
                      onChange={(e) => setProjectScope(e.target.value)}
                      placeholder={
                        isAr
                          ? 'صف فكرة المشروع، الأهداف الرئيسية، والنتائج أو المخرجات التي ترغب في تحقيقها...'
                          : 'Describe project goals, expected deliverables, and any relevant links...'
                      }
                      className="w-full px-3 py-2 rounded-xl theme-input text-xs leading-relaxed"
                    />
                    {formErrors.projectScope && (
                      <p className="text-[11px] text-red-400 mt-1">{formErrors.projectScope}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={timelineInputId}
                      className="block text-xs font-bold theme-text-primary mb-1.5"
                    >
                      {isAr ? 'الموعد الزمني المتوقع (اختياري)' : 'Target Timeline (Optional)'}
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 theme-text-muted absolute top-1/2 -translate-y-1/2 start-3" />
                      <input
                        id={timelineInputId}
                        type="text"
                        value={expectedTimeline}
                        onChange={(e) => setExpectedTimeline(e.target.value)}
                        placeholder={
                          isAr ? 'مثال: خلال شهر، أسبوعين، مرن' : 'e.g. 2 weeks, 1 month, flexible'
                        }
                        className="w-full ps-9 pe-3 py-2 rounded-xl theme-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRequestModalOpen(false)}
                      className="px-4 py-2 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl theme-btn-primary text-xs font-bold cursor-pointer"
                    >
                      {isAr ? 'تجهيز ملخص الطلب' : 'Prepare Inquiry Brief'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>
                      {isAr
                        ? 'تم تجهيز ملخص الطلب بنجاح! يمكنك الآن نسخه بنقرة واحدة أو فتحه في برنامج البريد.'
                        : 'Inquiry brief generated successfully! Copy to clipboard or open in your email client.'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl theme-bg-elevated border theme-border font-mono-tabular text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {preparedBrief}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPreparedBrief(null)}
                      className="px-3.5 py-2 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
                    >
                      {isAr ? 'تعديل البيانات' : 'Edit Details'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyBrief}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>{isAr ? 'نسخ الملخص' : 'Copy Brief'}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenMailClient}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl theme-btn-primary text-xs font-bold cursor-pointer"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{isAr ? 'فتح المسودة في تطبيق البريد' : 'Open Draft in Email Client'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] theme-text-muted leading-relaxed">
                    {isAr
                      ? 'ملاحظة: يقوم هذا الزر بفتح مسودة رسالة مهيأة بكافة التفاصيل في برنامج البريد الافتراضي بجهازك لإرسالها مباشرة إلى bandr246899@gmail.com دون إرسال خفي أو خادم وسيط.'
                      : 'Note: This button opens a fully prepared draft in your device’s default email client addressed to bandr246899@gmail.com with no hidden background dispatch.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }
);
