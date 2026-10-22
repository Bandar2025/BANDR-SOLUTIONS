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
  | 'midnight-pro'
  | 'obsidian'
  | 'arctic-light'
  | 'ocean-breeze'
  | 'emerald-tech'
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
  'arctic-light',
  'ocean-breeze',
  'emerald-tech',
  'royal-violet',
] as const;

export const DEFAULT_THEME_ID: ThemeId = 'midnight-pro';
export const DEFAULT_DENSITY: ThemeDensity = 'comfortable';

export const THEME_GALLERY: readonly ThemePaletteDefinition[] = [
  {
    id: 'midnight-pro',
    isLight: false,
    nameEn: 'Midnight Pro',
    nameAr: 'ميدنايت برو (Midnight Pro)',
    descriptionEn:
      'Default flagship theme — deep midnight navy with refined electric blue and cyan accents.',
    descriptionAr:
      'الثيم الافتراضي الرسمي — كحلي ليلي عميق مع لمسات أزرق كهربائي وسيان متوازنة.',
    swatches: {
      bgPrimary: '#0B1020',
      bgSurface: '#121A2B',
      bgElevated: '#192338',
      accentPrimary: '#5B8CFF',
      accentSecondary: '#43D9D0',
      textPrimary: '#F5F7FF',
      textMuted: '#AAB5CA',
      borderSubtle: '#22304A',
    },
  },
  {
    id: 'obsidian',
    isLight: false,
    nameEn: 'Obsidian',
    nameAr: 'أوبسيديان (Obsidian)',
    descriptionEn:
      'Sophisticated near-black studio surface with restrained slate-silver and cobalt highlights.',
    descriptionAr:
      'تدرجات أسود فحمي احترافية مع تباين هادئ ولمسات فضية وزرقاء رصينة.',
    swatches: {
      bgPrimary: '#090C12',
      bgSurface: '#111621',
      bgElevated: '#182030',
      accentPrimary: '#6E9BFF',
      accentSecondary: '#94A3B8',
      textPrimary: '#F8FAFC',
      textMuted: '#9CA3AF',
      borderSubtle: '#232C3D',
    },
  },
  {
    id: 'arctic-light',
    isLight: true,
    nameEn: 'Arctic Light',
    nameAr: 'آركتيك الفاتح (Arctic Light)',
    descriptionEn:
      'Clean crisp white and cool-gray daylight workspace with high-contrast cobalt typography.',
    descriptionAr:
      'واجهة نهارية مشرقة بخلفية بيضاء ورمادية باردة مع نصوص كحلية عالية الوضوح.',
    swatches: {
      bgPrimary: '#F8FAFC',
      bgSurface: '#FFFFFF',
      bgElevated: '#F1F5F9',
      accentPrimary: '#2563EB',
      accentSecondary: '#0D9488',
      textPrimary: '#0F172A',
      textMuted: '#475569',
      borderSubtle: '#E2E8F0',
    },
  },
  {
    id: 'ocean-breeze',
    isLight: false,
    nameEn: 'Ocean Breeze',
    nameAr: 'نسيم المحيط (Ocean Breeze)',
    descriptionEn:
      'Deep oceanic navy architecture paired with luminous sky blue and turquoise accents.',
    descriptionAr:
      'عمق أزرق محيطي متناسق مع إضاءات فيروزية وسماوية مريحة للعين.',
    swatches: {
      bgPrimary: '#071426',
      bgSurface: '#0D213B',
      bgElevated: '#152F52',
      accentPrimary: '#38BDF8',
      accentSecondary: '#2DD4BF',
      textPrimary: '#F0F9FF',
      textMuted: '#93C5FD',
      borderSubtle: '#1E3A5F',
    },
  },
  {
    id: 'emerald-tech',
    isLight: false,
    nameEn: 'Emerald Tech',
    nameAr: 'إيميرالد تك (Emerald Tech)',
    descriptionEn:
      'Refined emerald and mint-teal engineering palette on balanced dark slate-pine surfaces.',
    descriptionAr:
      'هوية تقنية باللون الزمردي والأخضر النعناعي على أسطح داكنة متوازنة.',
    swatches: {
      bgPrimary: '#081512',
      bgSurface: '#0F231E',
      bgElevated: '#16322B',
      accentPrimary: '#10B981',
      accentSecondary: '#34D399',
      textPrimary: '#ECFDF5',
      textMuted: '#A7F3D0',
      borderSubtle: '#1F4239',
    },
  },
  {
    id: 'royal-violet',
    isLight: false,
    nameEn: 'Royal Violet',
    nameAr: 'رويال فايوليت (Royal Violet)',
    descriptionEn:
      'Executive indigo-charcoal surfaces with accessible violet-blue and soft cyan highlights.',
    descriptionAr:
      'تصميم ملكي بدرجات البنفسجي والأزرق النيلي مع تباين قياسي عالي الوضوح.',
    swatches: {
      bgPrimary: '#0E0B1E',
      bgSurface: '#16122E',
      bgElevated: '#201B40',
      accentPrimary: '#8B5CF6',
      accentSecondary: '#38BDF8',
      textPrimary: '#F5F3FF',
      textMuted: '#C4B5FD',
      borderSubtle: '#2D2654',
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

const PERSONAL_STORAGE_KEY = 'bandr_personal_appearance_v1';
const GLOBAL_CACHE_STORAGE_KEY = 'bandr_global_appearance_cache_v1';

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

/**
 * Reads the visitor's personal appearance override from localStorage (if set).
 */
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
): void {
  if (typeof document === 'undefined') return;
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
      const validated: GlobalPublishedAppearance = {
        themeId: isValidThemeId(data.themeId) ? data.themeId : DEFAULT_THEME_ID,
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
 * Strictly restricted to the authenticated & verified portfolio owner.
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
        ownerUid: existingData.ownerUid,
        createdAt: existingData.createdAt,
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
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
