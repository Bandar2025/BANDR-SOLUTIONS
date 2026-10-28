/**
 * Standardized Image Aspect Ratio & Object-Fit Helper Utility
 * Ensures uniform aspect ratios (defaulting to 16:9) and CSS `object-fit: cover`
 * across all project thumbnails, cards, and gallery previews in the portfolio.
 */

export type StandardAspectRatio = '16:9' | '16:10' | '4:3' | '1:1';
export type ImageFitMode = 'cover' | 'contain';
export type ImageObjectPosition = 'center' | 'top' | 'bottom';

export interface StandardizedImageAspectConfig {
  /** Tailwind aspect-ratio & container class (uses CSS `aspect-ratio` + `overflow-hidden`) */
  containerClass: string;
  /** Tailwind image class (uses CSS `object-fit: cover` or `contain` + full width/height) */
  imageClass: string;
  /** Pure aspect-ratio utility class for components that accept `aspectRatioClass` */
  aspectRatioClass: string;
  /** Canonical CSS aspect-ratio string (e.g. '16 / 9') */
  cssAspectRatio: string;
  /** Numeric aspect ratio value (e.g. 16 / 9 = 1.7778) */
  numericRatio: number;
}

const ASPECT_RATIO_MAP: Record<
  StandardAspectRatio,
  { aspectClass: string; cssValue: string; numeric: number }
> = {
  '16:9': {
    aspectClass: 'aspect-video',
    cssValue: '16 / 9',
    numeric: 16 / 9,
  },
  '16:10': {
    aspectClass: 'aspect-[16/10]',
    cssValue: '16 / 10',
    numeric: 16 / 10,
  },
  '4:3': {
    aspectClass: 'aspect-[4/3]',
    cssValue: '4 / 3',
    numeric: 4 / 3,
  },
  '1:1': {
    aspectClass: 'aspect-square',
    cssValue: '1 / 1',
    numeric: 1,
  },
};

const OBJECT_POSITION_MAP: Record<ImageObjectPosition, string> = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
};

/**
 * Returns standardized Tailwind CSS classes for image containers and `<img>` elements
 * enforcing a consistent aspect ratio (default `16:9`) and `object-fit: cover`.
 */
export function standardizeImageAspectRatio(
  ratio: StandardAspectRatio = '16:9',
  fit: ImageFitMode = 'cover',
  position: ImageObjectPosition = 'top',
  extraContainerClass: string = '',
  extraImageClass: string = ''
): StandardizedImageAspectConfig {
  const entry = ASPECT_RATIO_MAP[ratio] || ASPECT_RATIO_MAP['16:9'];
  const posClass = OBJECT_POSITION_MAP[position] || 'object-center';

  const fitClass =
    fit === 'contain'
      ? `object-contain ${posClass}`
      : `object-cover ${posClass}`;

  const containerClass = [
    'w-full',
    entry.aspectClass,
    'overflow-hidden',
    'relative',
    extraContainerClass.trim(),
  ]
    .filter(Boolean)
    .join(' ');

  const imageClass = [
    'w-full',
    'h-full',
    fitClass,
    extraImageClass.trim(),
  ]
    .filter(Boolean)
    .join(' ');

  return {
    containerClass,
    imageClass,
    aspectRatioClass: entry.aspectClass,
    cssAspectRatio: entry.cssValue,
    numericRatio: entry.numeric,
  };
}
