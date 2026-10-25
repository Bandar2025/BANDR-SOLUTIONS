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
  'arctic-light',
  'ocean-breeze',
  'emerald-tech',
  'midnight-pro',
  'obsidian',
  'royal-violet',
] as const;

export const DEFAULT_THEME_ID: ThemeId = 'arctic-light';
export const DEFAULT_DENSITY: ThemeDensity = 'comfortable';

export const THEME_GALLERY: readonly ThemePaletteDefinition[] = [
  {
    id: 'arctic-light',
    isLight: true,
    nameEn: 'Arctic Daylight (Default)',
    nameAr: 'الإشراق النهاري الفاتح (الافتراضي)',
    descriptionEn:
      'Default bright daylight workspace — crisp white surfaces, soft alabaster canvas, and vibrant royal indigo accents.',
    descriptionAr:
      'الثيم الفاتح الافتراضي — خلفية نهارية ناصعة ومريحة للعين مع بطاقات بيضاء ولمسات أزرق ملكي واضحة.',
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
    nameEn: 'Sky & Turquoise Light',
    nameAr: 'نسيم السماء والفيروز (فاتح)',
    descriptionEn:
      'Luminous sky-blue daylight palette paired with pure white cards and refreshing ocean-teal highlights.',
    descriptionAr:
      'ثيم نهاري مشرق بدرجات السماوي الفاتح والأبيض النقي مع لمسات فيروزية وبحرية هادئة.',
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
    nameEn: 'Mint & Emerald Light',
    nameAr: 'النعناع والزمرد التقني (فاتح)',
    descriptionEn:
      'Clean mint-white daylight environment with crisp emerald green accents and high-legibility typography.',
    descriptionAr:
      'واجهة فاتحة عصرية بخلفية نعناعية هادئة وبطاقات بيضاء مع لمسات زمردية تقنية مريحة للقراءة.',
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
  {
    id: 'midnight-pro',
    isLight: false,
    nameEn: 'Midnight Pro (Dark)',
    nameAr: 'ميدنايت برو (داكن)',
    descriptionEn:
      'Deep midnight navy studio with electric indigo and cyan highlights.',
    descriptionAr:
      'ثيم ليلي داكن بدرجات الكحلي العميق مع إضاءات بنفسجية وسماوية.',
    swatches: {
      bgPrimary: '#0A0E1A',
      bgSurface: '#111827',
      bgElevated: '#172238',
      accentPrimary: '#6366F1',
      accentSecondary: '#22D3EE',
      textPrimary: '#F5F7FA',
      textMuted: '#94A3B8',
      borderSubtle: '#1E293B',
    },
  },
  {
    id: 'obsidian',
    isLight: false,
    nameEn: 'Obsidian (Dark)',
    nameAr: 'أوبسيديان (داكن)',
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
    id: 'royal-violet',
    isLight: false,
    nameEn: 'Royal Violet (Dark)',
    nameAr: 'رويال فايوليت (داكن)',
    descriptionEn:
      'Executive indigo-charcoal surfaces with accessible violet-blue and soft cyan highlights.',
    descriptionAr:
      'تصميم ملكي داكن بدرجات البنفسجي والأزرق النيلي مع تباين عالي الوضوح.',
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

const PERSONAL_STORAGE_KEY = 'bandr_personal_appearance_v3';
const GLOBAL_CACHE_STORAGE_KEY = 'bandr_global_appearance_cache_v3';
const APPEARANCE_SCHEMA_VERSION = 3;

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
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'midnight-pro'
      : 'arctic-light';
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
      // Only honor Firestore theme if it was explicitly published under current v3 light-default schema
      const effectiveThemeId: ThemeId =
        data.schemaVersion === APPEARANCE_SCHEMA_VERSION &&
        isValidThemeId(data.themeId)
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
        schemaVersion: APPEARANCE_SCHEMA_VERSION,
        ownerUid: existingData.ownerUid,
        createdAt: existingData.createdAt,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        themeId: safeThemeId,
        density: safeDensity,
        reducedMotion: safeReducedMotion,
        schemaVersion: APPEARANCE_SCHEMA_VERSION,
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
