import React, { useEffect, useState } from 'react';
import {
  Check,
  Eye,
  Globe,
  LayoutGrid,
  Loader2,
  Monitor,
  Palette,
  RotateCcw,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Language } from '../data/portfolioData';
import {
  AppearancePreferences,
  applyAppearanceToDocument,
  DEFAULT_DENSITY,
  DEFAULT_THEME_ID,
  GlobalPublishedAppearance,
  publishGlobalSiteAppearance,
  resolveEffectiveThemeId,
  THEME_GALLERY,
  ThemeDensity,
  ThemeId,
  ThemeModePreference,
} from '../lib/themeSystem';

interface ThemeSettingsCenterProps {
  lang: Language;
  personalPrefs: AppearancePreferences | null;
  globalPublished: GlobalPublishedAppearance;
  onApplyPersonalPrefs: (prefs: AppearancePreferences) => void;
  onResetPersonalToGlobal: () => void;
  authUser?: User | null;
  isOwnerAdmin?: boolean;
  onCloseModal?: () => void;
}

export const ThemeSettingsCenter: React.FC<ThemeSettingsCenterProps> = ({
  lang,
  personalPrefs,
  globalPublished,
  onApplyPersonalPrefs,
  onResetPersonalToGlobal,
  authUser,
  isOwnerAdmin = false,
  onCloseModal,
}) => {
  const isAr = lang === 'ar';

  // Baseline active state (personal preference if set, else global published)
  const committedThemeMode: ThemeModePreference =
    personalPrefs?.themeMode ?? globalPublished.themeId;
  const committedDensity: ThemeDensity =
    personalPrefs?.density ?? globalPublished.density;
  const committedReducedMotion: boolean =
    personalPrefs?.reducedMotion ?? globalPublished.reducedMotion;

  // Draft / Live Preview state
  const [previewThemeMode, setPreviewThemeMode] =
    useState<ThemeModePreference>(committedThemeMode);
  const [previewDensity, setPreviewDensity] =
    useState<ThemeDensity>(committedDensity);
  const [previewReducedMotion, setPreviewReducedMotion] = useState<boolean>(
    committedReducedMotion
  );

  const [publishingGlobal, setPublishingGlobal] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Sync draft state when committed preferences change externally
  useEffect(() => {
    setPreviewThemeMode(committedThemeMode);
    setPreviewDensity(committedDensity);
    setPreviewReducedMotion(committedReducedMotion);
  }, [committedThemeMode, committedDensity, committedReducedMotion]);

  // Apply Live Preview to <html> immediately while browsing themes
  useEffect(() => {
    const effectiveTheme = resolveEffectiveThemeId(previewThemeMode);
    applyAppearanceToDocument(
      effectiveTheme,
      previewDensity,
      previewReducedMotion
    );
  }, [previewThemeMode, previewDensity, previewReducedMotion]);

  const hasUnappliedPreview =
    previewThemeMode !== committedThemeMode ||
    previewDensity !== committedDensity ||
    previewReducedMotion !== committedReducedMotion;

  const handleApplyPersonal = () => {
    onApplyPersonalPrefs({
      themeMode: previewThemeMode,
      density: previewDensity,
      reducedMotion: previewReducedMotion,
    });
    setFeedbackBanner({
      type: 'success',
      text: isAr
        ? 'تم تطبيق وحفظ تفضيلات المظهر الشخصية على متصفحك بنجاح.'
        : 'Personal appearance preferences applied and saved locally.',
    });
  };

  const handleCancelPreview = () => {
    setPreviewThemeMode(committedThemeMode);
    setPreviewDensity(committedDensity);
    setPreviewReducedMotion(committedReducedMotion);
    const effectiveCommitted = resolveEffectiveThemeId(committedThemeMode);
    applyAppearanceToDocument(
      effectiveCommitted,
      committedDensity,
      committedReducedMotion
    );
    setFeedbackBanner({
      type: 'info',
      text: isAr
        ? 'تم إلغاء المعاينة واستعادة المظهر المحفوظ.'
        : 'Live preview cancelled; restored saved appearance.',
    });
  };

  const handleRestoreDefault = () => {
    onResetPersonalToGlobal();
    setPreviewThemeMode(globalPublished.themeId);
    setPreviewDensity(globalPublished.density);
    setPreviewReducedMotion(globalPublished.reducedMotion);
    applyAppearanceToDocument(
      globalPublished.themeId,
      globalPublished.density,
      globalPublished.reducedMotion
    );
    setFeedbackBanner({
      type: 'info',
      text: isAr
        ? 'تمت استعادة المظهر الافتراضي العام للمنصة.'
        : 'Restored to the published site default appearance.',
    });
  };

  const handlePublishGlobalDefault = async () => {
    if (!isOwnerAdmin || !authUser) return;
    setPublishingGlobal(true);
    setFeedbackBanner(null);

    const targetGlobalThemeId: ThemeId = resolveEffectiveThemeId(previewThemeMode);
    try {
      await publishGlobalSiteAppearance(
        {
          themeId: targetGlobalThemeId,
          density: previewDensity,
          reducedMotion: previewReducedMotion,
        },
        authUser
      );
      // Also align personal preference so the owner sees the exact published state
      onApplyPersonalPrefs({
        themeMode: targetGlobalThemeId,
        density: previewDensity,
        reducedMotion: previewReducedMotion,
      });
      setFeedbackBanner({
        type: 'success',
        text: isAr
          ? `تم نشر الثيم "${targetGlobalThemeId}" في Firestore كمظهر افتراضي عام لجميع زوار الموقع.`
          : `Published "${targetGlobalThemeId}" to Firestore as the global default theme for all site visitors.`,
      });
    } catch (err) {
      setFeedbackBanner({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : isAr
            ? 'تعذر نشر الثيم العام.'
            : 'Failed to publish global theme.',
      });
    } finally {
      setPublishingGlobal(false);
    }
  };

  const handleRestoreGlobalToMidnightPro = async () => {
    if (!isOwnerAdmin || !authUser) return;
    setPublishingGlobal(true);
    setFeedbackBanner(null);
    try {
      await publishGlobalSiteAppearance(
        {
          themeId: DEFAULT_THEME_ID,
          density: DEFAULT_DENSITY,
          reducedMotion: false,
        },
        authUser
      );
      onResetPersonalToGlobal();
      setPreviewThemeMode(DEFAULT_THEME_ID);
      setPreviewDensity(DEFAULT_DENSITY);
      setPreviewReducedMotion(false);
      applyAppearanceToDocument(DEFAULT_THEME_ID, DEFAULT_DENSITY, false);
      setFeedbackBanner({
        type: 'success',
        text: isAr
          ? 'تمت استعادة الثيم الرسمي (Midnight Pro) كمظهر افتراضي عام لجميع الزوار.'
          : 'Restored Midnight Pro as the global published default theme.',
      });
    } catch (err) {
      setFeedbackBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Restore failed',
      });
    } finally {
      setPublishingGlobal(false);
    }
  };

  return (
    <div className="theme-bg-surface rounded-2xl border theme-border p-5 sm:p-7 space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b theme-border pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold theme-accent-text">
            <Palette className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {isAr ? 'المظهر والثيمات' : 'Appearance & Themes'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold theme-text-primary">
            {isAr
              ? 'مركز تخصيص الهوية البصرية والثيمات'
              : 'Visual Design System & Theme Gallery'}
          </h2>
          <p className="text-xs sm:text-sm theme-text-muted max-w-2xl leading-relaxed">
            {isAr
              ? 'اختر من بين 6 ثيمات هندسية متكاملة مع معاينة حية فورية، وتحكم في كثافة التخطيط وتقليل الحركة.'
              : 'Select from six complete architectural color systems with live preview, layout density controls, and reduced-motion preferences.'}
          </p>
        </div>

        {onCloseModal && (
          <button
            type="button"
            onClick={() => {
              if (hasUnappliedPreview) handleCancelPreview();
              onCloseModal();
            }}
            aria-label={isAr ? 'إغلاق نافذة المظهر' : 'Close appearance settings'}
            className="p-2 rounded-xl theme-btn-secondary cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Explicit Distinction: Personal Visitor Preference vs Published Global Site Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl theme-card-elevated space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold theme-text-primary">
              <UserCheck className="w-4 h-4 theme-accent-text shrink-0" />
              <span>
                {isAr
                  ? '1. التفضيل الشخصي للزائر (Personal Preference)'
                  : '1. Personal Visitor Preference (Local Browser)'}
              </span>
            </span>
            <span className="text-[11px] font-mono-tabular theme-accent-text">
              {personalPrefs ? (isAr ? 'مخصص محلياً' : 'Custom Active') : isAr ? 'يتبع العام' : 'Following Global'}
            </span>
          </div>
          <p className="text-xs theme-text-muted leading-relaxed">
            {isAr
              ? 'يُحفظ في متصفحك الحالي فقط ليمنحك تجربة تصفح فورية ومخصصة دون التأثير على بقية الزوار.'
              : 'Saved locally in your browser for instant initialization across visits without affecting other visitors.'}
          </p>
        </div>

        <div className="p-4 rounded-xl theme-card-elevated space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold theme-text-primary">
              <Globe className="w-4 h-4 theme-accent-secondary shrink-0" />
              <span>
                {isAr
                  ? '2. الثيم العام المنشور للمنصة (Published Site Theme)'
                  : '2. Published Site Theme (Global Default)'}
              </span>
            </span>
            <span className="text-[11px] font-mono-tabular theme-text-secondary">
              {globalPublished.themeId}
            </span>
          </div>
          <p className="text-xs theme-text-muted leading-relaxed">
            {isAr
              ? 'الثيم الافتراضي المعتمد لجميع زوار الموقع الجدد (محمي في Firestore ولا يمكن تعديله إلا بواسطة مالك المنصة).'
              : 'The default appearance shown to all public visitors (persisted in Firestore and restricted to the verified owner).'}
          </p>
        </div>
      </div>

      {/* Status / Feedback Banner */}
      {feedbackBanner && (
        <div
          role="status"
          className="p-3.5 rounded-xl theme-card-elevated flex items-center justify-between gap-3 text-xs font-medium"
        >
          <span className="theme-text-primary">{feedbackBanner.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="theme-text-muted hover:opacity-80 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Six Selectable Theme Preview Cards */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold theme-text-primary">
            {isAr ? 'معرض الثيمات الستة (6 Complete Themes)' : 'Theme Gallery (6 Complete Palettes)'}
          </h3>
          {hasUnappliedPreview && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold theme-accent-text">
              <Eye className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? 'المعاينة الحية نشطة — اضغط "تطبيق المظهر" للحفظ'
                  : 'Live preview active — click "Apply Theme" to save'}
              </span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEME_GALLERY.map((theme) => {
            const isSelected = previewThemeMode === theme.id;
            const isCommitted = committedThemeMode === theme.id;
            const isGlobalDefault = globalPublished.themeId === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setPreviewThemeMode(theme.id)}
                aria-pressed={isSelected}
                className={`group text-start rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between gap-4 border ${
                  isSelected
                    ? 'ring-2 ring-[var(--accent-primary)] border-[var(--accent-primary)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                }`}
                style={{
                  backgroundColor: theme.swatches.bgSurface,
                  color: theme.swatches.textPrimary,
                }}
              >
                {/* Representative Miniature Interface Sample */}
                <div
                  className="w-full rounded-xl p-3 border space-y-2.5"
                  style={{
                    backgroundColor: theme.swatches.bgPrimary,
                    borderColor: theme.swatches.borderSubtle,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-md text-[10px] font-extrabold flex items-center justify-center text-white"
                        style={{ backgroundColor: theme.swatches.accentPrimary }}
                      >
                        BS
                      </span>
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: theme.swatches.textPrimary }}
                      >
                        {isAr ? theme.nameAr : theme.nameEn}
                      </span>
                    </div>
                    {isSelected && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: theme.swatches.accentPrimary }}
                      >
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Mini UI Surface Bar & Accent Preview */}
                  <div
                    className="p-2 rounded-lg border flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: theme.swatches.bgElevated,
                      borderColor: theme.swatches.borderSubtle,
                    }}
                  >
                    <div className="space-y-1 flex-1">
                      <div
                        className="h-2 w-3/4 rounded"
                        style={{ backgroundColor: theme.swatches.textPrimary, opacity: 0.85 }}
                      />
                      <div
                        className="h-1.5 w-1/2 rounded"
                        style={{ backgroundColor: theme.swatches.textMuted, opacity: 0.65 }}
                      />
                    </div>
                    <span
                      className="px-2 py-1 rounded text-[9px] font-bold text-white shrink-0"
                      style={{ backgroundColor: theme.swatches.accentPrimary }}
                    >
                      {theme.isLight ? 'LIGHT' : 'DARK'}
                    </span>
                  </div>

                  {/* 5 Miniature Color Swatches */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {[
                      theme.swatches.bgPrimary,
                      theme.swatches.bgSurface,
                      theme.swatches.bgElevated,
                      theme.swatches.accentPrimary,
                      theme.swatches.accentSecondary,
                    ].map((hex, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Theme Description & Status Labels */}
                <div className="space-y-2 w-full">
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: theme.swatches.textMuted }}
                  >
                    {isAr ? theme.descriptionAr : theme.descriptionEn}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-tabular pt-1">
                    {isCommitted && (
                      <span style={{ color: theme.swatches.accentPrimary }}>
                        {isAr ? '• مفعل حالياً' : '• Currently Active'}
                      </span>
                    )}
                    {isGlobalDefault && (
                      <span style={{ color: theme.swatches.accentSecondary }}>
                        {isAr ? '• افتراضي المنصة' : '• Global Default'}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Preference, Density & Reduced Motion Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t theme-border">
        {/* 1. System-Following Mode */}
        <div className="p-4 rounded-xl theme-card-elevated flex flex-col justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold theme-text-primary">
              <Monitor className="w-4 h-4 theme-accent-text" />
              <span>{isAr ? 'مزامنة مع نظام التشغيل' : 'System Theme Sync'}</span>
            </div>
            <p className="text-xs theme-text-muted">
              {isAr
                ? 'التبديل تلقائياً بين Arctic Light نهاراً و Midnight Pro ليلاً حسب جهازك.'
                : 'Automatically follow your OS light/dark mode preference.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setPreviewThemeMode(
                previewThemeMode === 'system' ? DEFAULT_THEME_ID : 'system'
              )
            }
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              previewThemeMode === 'system'
                ? 'theme-btn-primary'
                : 'theme-btn-secondary'
            }`}
          >
            {previewThemeMode === 'system'
              ? isAr
                ? 'متزامن مع النظام (مفعل)'
                : 'Following System (Active)'
              : isAr
              ? 'تفعيل مزامنة النظام'
              : 'Use System Preference'}
          </button>
        </div>

        {/* 2. Layout Density Preference */}
        <div className="p-4 rounded-xl theme-card-elevated flex flex-col justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold theme-text-primary">
              <LayoutGrid className="w-4 h-4 theme-accent-text" />
              <span>{isAr ? 'كثافة التخطيط والمسافات' : 'Layout Spacing Density'}</span>
            </div>
            <p className="text-xs theme-text-muted">
              {isAr
                ? 'اختر بين التباعد المريح أو العرض المدمج للبطاقات والأقسام.'
                : 'Switch between generous comfortable spacing or compact cards.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPreviewDensity('comfortable')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                previewDensity === 'comfortable'
                  ? 'theme-btn-primary'
                  : 'theme-btn-secondary'
              }`}
            >
              {isAr ? 'مريح (Comfortable)' : 'Comfortable'}
            </button>
            <button
              type="button"
              onClick={() => setPreviewDensity('compact')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                previewDensity === 'compact'
                  ? 'theme-btn-primary'
                  : 'theme-btn-secondary'
              }`}
            >
              {isAr ? 'مدمج (Compact)' : 'Compact'}
            </button>
          </div>
        </div>

        {/* 3. Reduced Motion Preference */}
        <div className="p-4 rounded-xl theme-card-elevated flex flex-col justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold theme-text-primary">
              <Sparkles className="w-4 h-4 theme-accent-text" />
              <span>{isAr ? 'تقليل الحركة والتأثيرات' : 'Reduced Motion Mode'}</span>
            </div>
            <p className="text-xs theme-text-muted">
              {isAr
                ? 'إيقاف الانتقالات الحركية والمجسم ثلاثي الأبعاد لراحة العين وأعلى سرعة.'
                : 'Minimize animations and use static SVG geometry for maximum comfort.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPreviewReducedMotion((prev) => !prev)}
            aria-pressed={previewReducedMotion}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              previewReducedMotion ? 'theme-btn-primary' : 'theme-btn-secondary'
            }`}
          >
            {previewReducedMotion
              ? isAr
                ? 'تقليل الحركة: مفعل'
                : 'Reduced Motion: ON'
              : isAr
              ? 'تقليل الحركة: غير مفعل'
              : 'Reduced Motion: OFF'}
          </button>
        </div>
      </div>

      {/* Action Controls: Apply Theme, Cancel Preview, Restore Default, and Owner Global Publish */}
      <div className="pt-4 border-t theme-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleApplyPersonal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl theme-btn-primary text-xs sm:text-sm font-bold cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isAr ? 'تطبيق المظهر (Apply Theme)' : 'Apply Theme'}</span>
          </button>

          <button
            type="button"
            onClick={handleCancelPreview}
            disabled={!hasUnappliedPreview}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl theme-btn-secondary disabled:opacity-45 text-xs font-semibold cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isAr ? 'إلغاء المعاينة (Cancel Preview)' : 'Cancel Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleRestoreDefault}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'استعادة الافتراضي (Restore Default)' : 'Restore Default'}</span>
          </button>
        </div>

        {/* Owner-Only Global Site Default Publishing */}
        {isOwnerAdmin && authUser && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePublishGlobalDefault}
              disabled={publishingGlobal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {publishingGlobal ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )}
              <span>
                {isAr
                  ? 'نشر كثيم عام لجميع الزوار'
                  : 'Publish as Global Default for All Visitors'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleRestoreGlobalToMidnightPro}
              disabled={publishingGlobal}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
            >
              <span>
                {isAr
                  ? 'إعادة العام إلى Midnight Pro'
                  : 'Reset Global to Midnight Pro'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
