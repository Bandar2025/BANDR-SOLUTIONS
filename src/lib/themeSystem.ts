import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from './firebase';

export type ThemeId =
  | 'arctic-light'
  | 'ocean-breeze'
  | 'emerald-tech'
  | 'midnight-pro'
  | 'obsidian'
  | 'royal-violet';

export type ThemeModePreference = ThemeId | 'system';
export type ThemeDensity = 'comfortable' | 'compact';

export interface ThemePaletteDefinition {
  id: ThemeId;
  isLight: boolean;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  swatches: {
    bgPrimary: string;
    bgSurface: string;
    bgElevated: string;
    accentPrimary: string;
    accentSecondary: string;
    textPrimary: string;
    textMuted: string;
    borderSubtle: string;
  };
}

export const ALLOWLISTED_THEME_IDS: readonly ThemeId[] = [
  'midnight-pro',
  'obsidian',
  'royal-violet',
  'arctic-light',
  'ocean-breeze',
  'emerald-tech',
] as const;

export const DEFAULT_THEME_ID: ThemeId = 'midnight-pro';
export const DEFAULT_DENSITY: ThemeDensity = 'comfortable';

export const THEME_GALLERY: readonly ThemePaletteDefinition[] = [
  {
    id: 'midnight-pro',
    isLight: false,
    nameEn: 'Midnight Cyber-Tech (Default Smart Theme)',
    nameAr: 'ميدنايت سايبر تِك — الثيم الذكي الرئيسي (الافتراضي)',
    descriptionEn:
      'Flagship smart engineering & AI showcase studio — deep cyber-navy surfaces with electric indigo, neon cyan circuitry, and futuristic contrast.',
    descriptionAr:
      'الثيم التقني الذكي الرئيسي — بيئة هندسية عميقة بدرجات الكحلي السيبراني مع إضاءات النيلي الكهربائي والسيان الذكي لتجربة معرض مشاريع ذكية ومتطورة.',
    swatches: {
      bgPrimary: '#070B14',
      bgSurface: '#0E1526',
      bgElevated: '#15203B',
      accentPrimary: '#6366F1',
      accentSecondary: '#06B6D4',
      textPrimary: '#F8FAFC',
      textMuted: '#94A3B8',
      borderSubtle: '#1E293B',
    },
  },
  {
    id: 'obsidian',
    isLight: false,
    nameEn: 'Obsidian Quantum (Dark)',
    nameAr: 'أوبسيديان كوانتوم (تقني داكن)',
    descriptionEn:
      'Ultra-sleek carbon-black engineering console with cobalt blue and metallic silver telemetry accents.',
    descriptionAr:
      'تدرجات أسود كربوني فائقة الحداثة مع تباين هندسي ولمسات أزرق كوبالت وفضي تقني.',
    swatches: {
      bgPrimary: '#080B11',
      bgSurface: '#101622',
      bgElevated: '#182132',
      accentPrimary: '#3B82F6',
      accentSecondary: '#38BDF8',
      textPrimary: '#F8FAFC',
      textMuted: '#9CA3AF',
      borderSubtle: '#222D40',
    },
  },
  {
    id: 'royal-violet',
    isLight: false,
    nameEn: 'Neural Violet & Cyan (Dark)',
    nameAr: 'نيورال فايوليت الذكي (داكن)',
    descriptionEn:
      'AI-inspired deep neural violet and cyber-cyan architecture with luminous futuristic depth.',
    descriptionAr:
      'تصميم مستوحى من الشبكات العصبية والذكاء الاصطناعي بدرجات البنفسجي العميق والسيان المضيء.',
    swatches: {
      bgPrimary: '#0B091B',
      bgSurface: '#13102B',
      bgElevated: '#1D183D',
      accentPrimary: '#8B5CF6',
      accentSecondary: '#22D3EE',
      textPrimary: '#F5F3FF',
      textMuted: '#C4B5FD',
      borderSubtle: '#2D2654',
    },
  },
  {
    id: 'arctic-light',
    isLight: true,
    nameEn: 'Arctic Tech Lab (Light)',
    nameAr: 'المختبر التقني النهاري (فاتح)',
    descriptionEn:
      'Bright architectural lab workspace — crisp white surfaces, technical slate grid, and vibrant royal indigo accents.',
    descriptionAr:
      'واجهة مختبر تقني نهارية ناصعة — خلفية فاتحة مع شبكة هندسية دقيقة ولمسات أزرق ملكي.',
    swatches: {
      bgPrimary: '#F8FAFC',
      bgSurface: '#FFFFFF',
      bgElevated: '#EEF2FF',
      accentPrimary: '#4F46E5',
      accentSecondary: '#0891B2',
      textPrimary: '#0F172A',
      textMuted: '#64748B',
      borderSubtle: '#E2E8F0',
    },
  },
  {
    id: 'ocean-breeze',
    isLight: true,
    nameEn: 'Cyber Cyan Daylight (Light)',
    nameAr: 'السيان التقني المشرق (فاتح)',
    descriptionEn:
      'Luminous sky-cyan technical palette paired with pure white cards and ocean-teal highlights.',
    descriptionAr:
      'ثيم تقني نهاري مشرق بدرجات السيان الفاتح والأبيض النقي مع لمسات فيروزية ذكية.',
    swatches: {
      bgPrimary: '#F0F9FF',
      bgSurface: '#FFFFFF',
      bgElevated: '#E0F2FE',
      accentPrimary: '#0284C7',
      accentSecondary: '#0D9488',
      textPrimary: '#0C4A6E',
      textMuted: '#475569',
      borderSubtle: '#BAE6FD',
    },
  },
  {
    id: 'emerald-tech',
    isLight: true,
    nameEn: 'Emerald IoT Matrix (Light)',
    nameAr: 'الزمرد الذكي وإنترنت الأشياء (فاتح)',
    descriptionEn:
      'Clean mint-white technical environment with crisp emerald green IoT accents and high-legibility typography.',
    descriptionAr:
      'واجهة تقنية فاتحة بلمسات الزمرد الأخضر المستوحاة من أنظمة الأتمتة وإنترنت الأشياء.',
    swatches: {
      bgPrimary: '#F2FBF7',
      bgSurface: '#FFFFFF',
      bgElevated: '#E6F7EF',
      accentPrimary: '#059669',
      accentSecondary: '#0284C7',
      textPrimary: '#064E3B',
      textMuted: '#475569',
      borderSubtle: '#A7F3D0',
    },
  },
] as const;

export interface AppearancePreferences {
  themeMode: ThemeModePreference;
  density: ThemeDensity;
  reducedMotion: boolean;
}

export interface GlobalPublishedAppearance {
  themeId: ThemeId;
  density: ThemeDensity;
  reducedMotion: boolean;
}

const PERSONAL_STORAGE_KEY = 'bandr_admin_preview_appearance_v4';
const GLOBAL_CACHE_STORAGE_KEY = 'bandr_global_appearance_cache_v4';

export function isValidThemeId(val: unknown): val is ThemeId {
  return (
    typeof val === 'string' &&
    (ALLOWLISTED_THEME_IDS as readonly string[]).includes(val)
  );
}

export function isValidThemeMode(val: unknown): val is ThemeModePreference {
  return val === 'system' || isValidThemeId(val);
}

export function isValidDensity(val: unknown): val is ThemeDensity {
  return val === 'comfortable' || val === 'compact';
}

export function resolveSystemThemeId(): ThemeId {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'arctic-light'
      : 'midnight-pro';
  }
  return DEFAULT_THEME_ID;
}

export function resolveEffectiveThemeId(mode: ThemeModePreference): ThemeId {
  if (mode === 'system') {
    return resolveSystemThemeId();
  }
  return isValidThemeId(mode) ? mode : DEFAULT_THEME_ID;
}

export function getThemeDefinition(themeId: ThemeId): ThemePaletteDefinition {
  return (
    THEME_GALLERY.find((t) => t.id === themeId) || THEME_GALLERY[0]
  );
}

export function loadPersonalAppearance(): AppearancePreferences | null {
  try {
    const raw = window.localStorage.getItem(PERSONAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const themeMode: ThemeModePreference = isValidThemeMode(parsed.themeMode)
      ? parsed.themeMode
      : DEFAULT_THEME_ID;
    const density: ThemeDensity = isValidDensity(parsed.density)
      ? parsed.density
      : DEFAULT_DENSITY;
    const reducedMotion = Boolean(parsed.reducedMotion);

    return { themeMode, density, reducedMotion };
  } catch {
    return null;
  }
}

export function savePersonalAppearance(prefs: AppearancePreferences): void {
  try {
    const sanitized: AppearancePreferences = {
      themeMode: isValidThemeMode(prefs.themeMode)
        ? prefs.themeMode
        : DEFAULT_THEME_ID,
      density: isValidDensity(prefs.density) ? prefs.density : DEFAULT_DENSITY,
      reducedMotion: Boolean(prefs.reducedMotion),
    };
    window.localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearPersonalAppearance(): void {
  try {
    window.localStorage.removeItem(PERSONAL_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function loadCachedGlobalAppearance(): GlobalPublishedAppearance {
  try {
    const raw = window.localStorage.getItem(GLOBAL_CACHE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && isValidThemeId(parsed.themeId)) {
        return {
          themeId: parsed.themeId,
          density: isValidDensity(parsed.density) ? parsed.density : DEFAULT_DENSITY,
          reducedMotion: Boolean(parsed.reducedMotion),
        };
      }
    }
  } catch {
    // Ignore cache read error
  }
  return {
    themeId: DEFAULT_THEME_ID,
    density: DEFAULT_DENSITY,
    reducedMotion: false,
  };
}

function saveCachedGlobalAppearance(settings: GlobalPublishedAppearance): void {
  try {
    window.localStorage.setItem(GLOBAL_CACHE_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Applies the resolved theme, density, and reduced-motion attributes to <html>
 * so semantic CSS variables update smoothly across the entire application.
 */
export function applyAppearanceToDocument(
  effectiveThemeId: ThemeId,
  density: ThemeDensity,
  reducedMotion: boolean
): {
  dataTheme: string;
  bgPrimary: string;
  accentPrimary: string;
} {
  if (typeof document === 'undefined') {
    return { dataTheme: effectiveThemeId, bgPrimary: '', accentPrimary: '' };
  }
  const safeTheme = isValidThemeId(effectiveThemeId)
    ? effectiveThemeId
    : DEFAULT_THEME_ID;
  const safeDensity = isValidDensity(density) ? density : DEFAULT_DENSITY;
  const themeDef = getThemeDefinition(safeTheme);

  const root = document.documentElement;
  root.setAttribute('data-theme', safeTheme);
  root.setAttribute('data-theme-mode', themeDef.isLight ? 'light' : 'dark');
  root.setAttribute('data-density', safeDensity);
  root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');

  let bgPrimary = '';
  let accentPrimary = '';
  if (typeof window !== 'undefined') {
    const computed = window.getComputedStyle(root);
    bgPrimary = computed.getPropertyValue('--bg-primary').trim();
    accentPrimary = computed.getPropertyValue('--accent-primary').trim();
  }

  return {
    dataTheme: safeTheme,
    bgPrimary,
    accentPrimary,
  };
}

/**
 * Subscribes to the global published theme at `/site_settings/appearance`.
 * Uses a single lightweight document listener.
 */
export function subscribePublishedSiteAppearance(
  onUpdate: (published: GlobalPublishedAppearance) => void
): () => void {
  const docRef = doc(db, 'site_settings', 'appearance');
  const unsubscribe = onSnapshot(
    docRef,
    (snap) => {
      if (!snap.exists()) {
        const fallback: GlobalPublishedAppearance = {
          themeId: DEFAULT_THEME_ID,
          density: DEFAULT_DENSITY,
          reducedMotion: false,
        };
        saveCachedGlobalAppearance(fallback);
        onUpdate(fallback);
        return;
      }
      const data = snap.data();
      const effectiveThemeId: ThemeId = isValidThemeId(data.themeId)
        ? data.themeId
        : DEFAULT_THEME_ID;

      const validated: GlobalPublishedAppearance = {
        themeId: effectiveThemeId,
        density: isValidDensity(data.density) ? data.density : DEFAULT_DENSITY,
        reducedMotion: Boolean(data.reducedMotion),
      };
      saveCachedGlobalAppearance(validated);
      onUpdate(validated);
    },
    () => {
      // On offline/network error, use cached global appearance
      onUpdate(loadCachedGlobalAppearance());
    }
  );
  return unsubscribe;
}

/**
 * Publishes the global default site appearance to `/site_settings/appearance`.
 * Strictly restricted to the authenticated & verified portfolio owner in Admin Dashboard.
 */
export async function publishGlobalSiteAppearance(
  settings: GlobalPublishedAppearance,
  user: User
): Promise<void> {
  const safeThemeId = isValidThemeId(settings.themeId)
    ? settings.themeId
    : DEFAULT_THEME_ID;
  const safeDensity = isValidDensity(settings.density)
    ? settings.density
    : DEFAULT_DENSITY;
  const safeReducedMotion = Boolean(settings.reducedMotion);

  const docRef = doc(db, 'site_settings', 'appearance');
  const path = 'site_settings/appearance';

  try {
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data();
      await setDoc(docRef, {
        themeId: safeThemeId,
        density: safeDensity,
        reducedMotion: safeReducedMotion,
        ownerUid: existingData.ownerUid || user.uid,
        createdAt: existingData.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        themeId: safeThemeId,
        density: safeDensity,
        reducedMotion: safeReducedMotion,
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    saveCachedGlobalAppearance({
      themeId: safeThemeId,
      density: safeDensity,
      reducedMotion: safeReducedMotion,
    });
    clearPersonalAppearance();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
