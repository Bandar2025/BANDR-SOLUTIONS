import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Globe,
  Loader2,
  RotateCcw,
  Save,
  Search,
  Share2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Language } from '../data/portfolioData';
import {
  DEFAULT_ROUTE_SEO_MAP,
  MANAGED_SEO_ROUTES,
  publishRouteSeoConfigToFirestore,
  RouteSeoEntry,
  RouteSeoMap,
  SeoManagedRoute,
} from '../lib/seoService';

interface AdminSeoManagerProps {
  lang: Language;
  authUser: User | null;
  seoMap: RouteSeoMap;
  onUpdateSeoMap: (updated: RouteSeoMap) => void;
}

export const AdminSeoManager: React.FC<AdminSeoManagerProps> = ({
  lang,
  authUser,
  seoMap,
  onUpdateSeoMap,
}) => {
  const isAr = lang === 'ar';
  const [selectedRoute, setSelectedRoute] = useState<SeoManagedRoute>('/');
  const [draftMap, setDraftMap] = useState<RouteSeoMap>(seoMap);
  const [previewLang, setPreviewLang] = useState<Language>(lang);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setDraftMap(seoMap);
  }, [seoMap]);

  const currentEntry: RouteSeoEntry =
    draftMap[selectedRoute] || DEFAULT_ROUTE_SEO_MAP[selectedRoute];

  const handleFieldChange = (
    field: keyof RouteSeoEntry,
    value: string
  ) => {
    setFeedback(null);
    setDraftMap((prev) => ({
      ...prev,
      [selectedRoute]: {
        ...prev[selectedRoute],
        [field]: value,
      },
    }));
  };

  const handleResetRouteToDefault = () => {
    setFeedback(null);
    setDraftMap((prev) => ({
      ...prev,
      [selectedRoute]: { ...DEFAULT_ROUTE_SEO_MAP[selectedRoute] },
    }));
  };

  const handleSaveAllSeoChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    setSaving(true);
    setFeedback(null);
    try {
      await publishRouteSeoConfigToFirestore(authUser, draftMap);
      onUpdateSeoMap(draftMap);
      setFeedback({
        type: 'success',
        message: isAr
          ? 'تم حفظ ونشر عناوين الصفحات وأوصاف الميتا (SEO) لجميع المسارات بنجاح في قاعدة البيانات وتطبيقها فوراً.'
          : 'Successfully saved and published dynamic route SEO titles and meta descriptions to Firestore.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : isAr
            ? 'تعذر حفظ إعدادات SEO.'
            : 'Failed to save SEO settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  const titleArLen = currentEntry.titleAr.trim().length;
  const titleEnLen = currentEntry.titleEn.trim().length;
  const descArLen = currentEntry.descriptionAr.trim().length;
  const descEnLen = currentEntry.descriptionEn.trim().length;

  const getLengthBadgeClass = (len: number, min: number, max: number) => {
    if (len >= min && len <= max) {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
    if (len > 0 && len < min) {
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
    return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
  };

  const previewTitle =
    previewLang === 'ar' ? currentEntry.titleAr : currentEntry.titleEn;
  const previewDesc =
    previewLang === 'ar'
      ? currentEntry.descriptionAr
      : currentEntry.descriptionEn;
  const previewUrl = `${window.location.origin}${
    selectedRoute === '/' ? '' : selectedRoute
  }`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="theme-bg-surface border theme-border rounded-2xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono-tabular theme-accent-text">
            <Globe className="w-4 h-4" />
            <span>
              {isAr
                ? 'محرك تحسين محركات البحث الديناميكي · DYNAMIC ROUTE SEO'
                : 'DYNAMIC ROUTE SEO & METADATA MANAGER'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold theme-text-primary">
            {isAr
              ? 'إدارة عناوين الصفحات وأوصاف الميتا (SEO) لكل مسار'
              : 'Dynamic Page Titles & Meta Descriptions per Route'}
          </h2>
          <p className="text-xs theme-text-secondary">
            {isAr
              ? 'تحكم بشكل مباشر في عناوين الصفحات (<title>)، أوصاف الميتا (meta description)، الكلمات المفتاحية، وبطاقات المشاركة الاجتماعية لكل مسار لتحسين ظهور الموقع في محركات البحث.'
              : 'Dynamically customize <title>, meta descriptions, keywords, OpenGraph cards, and Schema.org structured data for each route.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetRouteToDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {isAr
                ? 'استعادة القيم الافتراضية للمسار'
                : 'Reset Route to Default'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSaveAllSeoChanges}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl theme-btn-primary text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {isAr ? 'حفظ ونشر إعدادات SEO' : 'Save & Publish SEO Metadata'}
            </span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs sm:text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
              : 'bg-red-950/40 border-red-700/60 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Route Selector Dock */}
      <div className="theme-bg-surface border theme-border rounded-2xl p-4 space-y-3">
        <div className="text-xs font-bold theme-text-primary flex items-center justify-between">
          <span>
            {isAr
              ? 'اختر مسار الصفحة لتعديل بيانات SEO الخاصة به:'
              : 'Select a Route to Configure Its SEO Metadata:'}
          </span>
          <span className="font-mono-tabular theme-accent-text">
            {selectedRoute}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {MANAGED_SEO_ROUTES.map((routePath) => {
            const meta = draftMap[routePath] || DEFAULT_ROUTE_SEO_MAP[routePath];
            const isSelected = selectedRoute === routePath;
            return (
              <button
                key={routePath}
                type="button"
                onClick={() => setSelectedRoute(routePath)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'tech-nav-btn tech-nav-btn-active'
                    : 'tech-nav-btn theme-text-secondary'
                }`}
              >
                <span className="font-mono-tabular opacity-80">
                  {routePath}
                </span>
                <span>·</span>
                <span>{isAr ? meta.routeLabelAr : meta.routeLabelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Editor + Live Google SERP Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Form Inputs */}
        <form
          onSubmit={handleSaveAllSeoChanges}
          className="lg:col-span-7 theme-bg-surface border theme-border rounded-2xl p-5 sm:p-6 space-y-5"
        >
          <div className="border-b theme-border pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold theme-text-primary">
              {isAr
                ? `تعديل بيانات المسار: ${currentEntry.routeLabelAr}`
                : `Editing Route Metadata: ${currentEntry.routeLabelEn}`}
            </h3>
            <span className="text-[11px] font-mono-tabular px-2.5 py-1 rounded-md theme-card-elevated theme-accent-text">
              {selectedRoute}
            </span>
          </div>

          {/* Arabic Page Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold theme-text-primary">
                {isAr
                  ? 'عنوان الصفحة بالعربية (Page Title - AR)'
                  : 'Arabic Page Title (<title>)'}
              </label>
              <span
                className={`text-[11px] font-mono-tabular px-2 py-0.5 rounded border ${getLengthBadgeClass(
                  titleArLen,
                  30,
                  65
                )}`}
              >
                {titleArLen} {isAr ? 'حرف (الموصى به: 30–60)' : 'chars (30–60)'}
              </span>
            </div>
            <input
              type="text"
              dir="rtl"
              value={currentEntry.titleAr}
              onChange={(e) => handleFieldChange('titleAr', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
              placeholder="مثال: Bandr Solutions | معرض الأعمال والمشاريع التقنية"
            />
          </div>

          {/* Arabic Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold theme-text-primary">
                {isAr
                  ? 'وصف الميتا بالعربية (Meta Description - AR)'
                  : 'Arabic Meta Description'}
              </label>
              <span
                className={`text-[11px] font-mono-tabular px-2 py-0.5 rounded border ${getLengthBadgeClass(
                  descArLen,
                  100,
                  165
                )}`}
              >
                {descArLen}{' '}
                {isAr ? 'حرف (الموصى به: 120–160)' : 'chars (120–160)'}
              </span>
            </div>
            <textarea
              rows={3}
              dir="rtl"
              value={currentEntry.descriptionAr}
              onChange={(e) =>
                handleFieldChange('descriptionAr', e.target.value)
              }
              className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
            />
          </div>

          {/* English Page Title */}
          <div className="space-y-1.5 pt-2 border-t theme-border">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold theme-text-primary">
                {isAr
                  ? 'عنوان الصفحة بالإنجليزية (Page Title - EN)'
                  : 'English Page Title (<title>)'}
              </label>
              <span
                className={`text-[11px] font-mono-tabular px-2 py-0.5 rounded border ${getLengthBadgeClass(
                  titleEnLen,
                  30,
                  65
                )}`}
              >
                {titleEnLen}{' '}
                {isAr ? 'حرف (الموصى به: 30–60)' : 'chars (30–60)'}
              </span>
            </div>
            <input
              type="text"
              dir="ltr"
              value={currentEntry.titleEn}
              onChange={(e) => handleFieldChange('titleEn', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
              placeholder="e.g. Bandr Solutions | Full Stack Engineering & AI Portfolio"
            />
          </div>

          {/* English Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold theme-text-primary">
                {isAr
                  ? 'وصف الميتا بالإنجليزية (Meta Description - EN)'
                  : 'English Meta Description'}
              </label>
              <span
                className={`text-[11px] font-mono-tabular px-2 py-0.5 rounded border ${getLengthBadgeClass(
                  descEnLen,
                  100,
                  165
                )}`}
              >
                {descEnLen}{' '}
                {isAr ? 'حرف (الموصى به: 120–160)' : 'chars (120–160)'}
              </span>
            </div>
            <textarea
              rows={3}
              dir="ltr"
              value={currentEntry.descriptionEn}
              onChange={(e) =>
                handleFieldChange('descriptionEn', e.target.value)
              }
              className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
            />
          </div>

          {/* Keywords (AR & EN) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t theme-border">
            <div className="space-y-1.5">
              <label className="text-xs font-bold theme-text-primary block">
                {isAr
                  ? 'الكلمات المفتاحية بالعربية (Keywords AR)'
                  : 'Arabic Keywords (comma-separated)'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={currentEntry.keywordsAr}
                onChange={(e) =>
                  handleFieldChange('keywordsAr', e.target.value)
                }
                className="w-full px-3.5 py-2 rounded-xl theme-input text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold theme-text-primary block">
                {isAr
                  ? 'الكلمات المفتاحية بالإنجليزية (Keywords EN)'
                  : 'English Keywords (comma-separated)'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={currentEntry.keywordsEn}
                onChange={(e) =>
                  handleFieldChange('keywordsEn', e.target.value)
                }
                className="w-full px-3.5 py-2 rounded-xl theme-input text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl theme-btn-primary text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {isAr
                  ? 'حفظ وتطبيق تغييرات SEO'
                  : 'Save & Apply Route SEO Changes'}
              </span>
            </button>
          </div>
        </form>

        {/* Right: Live Search Engine (SERP) & OpenGraph Social Card Preview */}
        <div className="lg:col-span-5 space-y-5">
          <div className="theme-bg-surface border theme-border rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold theme-text-primary">
                <Search className="w-4 h-4 theme-accent-text" />
                <span>
                  {isAr
                    ? 'معاينة نتيجة البحث في Google (SERP)'
                    : 'Live Google Search Snippet Preview'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewLang('ar')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    previewLang === 'ar'
                      ? 'theme-btn-primary'
                      : 'theme-btn-secondary'
                  }`}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    previewLang === 'en'
                      ? 'theme-btn-primary'
                      : 'theme-btn-secondary'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Simulated Google Search Result Card */}
            <div
              dir={previewLang === 'ar' ? 'rtl' : 'ltr'}
              className="p-4 rounded-xl theme-card-elevated border theme-border space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs theme-text-muted">
                <span className="w-6 h-6 rounded-full theme-btn-primary flex items-center justify-center text-[10px] font-extrabold">
                  BS
                </span>
                <div className="truncate">
                  <div className="text-[11px] font-semibold theme-text-primary">
                    Bandr Solutions
                  </div>
                  <div className="text-[10px] font-mono-tabular theme-text-muted truncate">
                    {previewUrl}
                  </div>
                </div>
              </div>
              <div className="text-base font-bold text-sky-400 hover:underline line-clamp-1 pt-1">
                {previewTitle || 'Bandr Solutions'}
              </div>
              <p className="text-xs theme-text-secondary leading-relaxed line-clamp-3">
                {previewDesc}
              </p>
            </div>

            {/* Simulated Social Share Card (OpenGraph / LinkedIn / X) */}
            <div className="pt-3 border-t theme-border space-y-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-bold theme-text-primary">
                <Share2 className="w-4 h-4 theme-accent-text" />
                <span>
                  {isAr
                    ? 'معاينة بطاقة المشاركة الاجتماعية (OpenGraph / LinkedIn)'
                    : 'Social Share Card Preview (OpenGraph)'}
                </span>
              </div>

              <div
                dir={previewLang === 'ar' ? 'rtl' : 'ltr'}
                className="rounded-xl overflow-hidden border theme-border theme-card-elevated"
              >
                <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-between px-5 border-b theme-border">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono-tabular text-sky-400 uppercase tracking-wider">
                      BANDR SOLUTIONS · PORTFOLIO
                    </span>
                    <div className="text-sm font-extrabold text-white line-clamp-1">
                      {previewTitle}
                    </div>
                  </div>
                  <span className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 font-extrabold text-sm shrink-0">
                    BS
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="text-[10px] font-mono-tabular theme-text-muted uppercase">
                    {window.location.host}
                  </div>
                  <div className="text-xs font-bold theme-text-primary line-clamp-1">
                    {previewTitle}
                  </div>
                  <div className="text-[11px] theme-text-secondary line-clamp-2">
                    {previewDesc}
                  </div>
                </div>
              </div>
            </div>

            {/* All Routes Quick Summary Matrix */}
            <div className="pt-3 border-t theme-border space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold theme-text-primary">
                <Sparkles className="w-3.5 h-3.5 theme-accent-text" />
                <span>
                  {isAr
                    ? 'ملخص حالة المسارات المهيأة لمحركات البحث'
                    : 'Configured Routes SEO Status'}
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pe-1">
                {MANAGED_SEO_ROUTES.map((r) => {
                  const item = draftMap[r] || DEFAULT_ROUTE_SEO_MAP[r];
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRoute(r)}
                      className={`w-full text-start p-2.5 rounded-xl border transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        selectedRoute === r
                          ? 'theme-card-elevated border-sky-500/50'
                          : 'theme-bg-primary theme-border hover:border-sky-500/30'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold theme-text-primary truncate">
                          {isAr ? item.titleAr : item.titleEn}
                        </div>
                        <div className="text-[11px] theme-text-muted truncate">
                          {isAr ? item.descriptionAr : item.descriptionEn}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded theme-card-elevated theme-accent-text shrink-0">
                        {r}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
