import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, isAuthorizedOwner } from './firebase';
import { Language } from '../data/portfolioData';

export type SeoManagedRoute =
  | '/'
  | '/projects'
  | '/services'
  | '/community'
  | '/about'
  | '/contact';

export interface RouteSeoEntry {
  path: SeoManagedRoute;
  routeLabelAr: string;
  routeLabelEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  keywordsAr: string;
  keywordsEn: string;
  ogImage: string;
}

export type RouteSeoMap = Record<SeoManagedRoute, RouteSeoEntry>;

const SEO_CACHE_STORAGE_KEY = 'bandr_seo_routes_cache_v1';

export const DEFAULT_ROUTE_SEO_MAP: RouteSeoMap = {
  '/': {
    path: '/',
    routeLabelAr: 'الصفحة الرئيسية (Home)',
    routeLabelEn: 'Home Page (/)',
    titleAr: 'Bandr Solutions | معرض الأعمال والمشاريع التقنية الذكية',
    titleEn: 'Bandr Solutions | Full Stack Engineering & AI Portfolio',
    descriptionAr:
      'اكتشف أعمال Bandr Solutions للمهندس سعيد بندر في تطوير المنصات الذكية، المتاجر الإلكترونية، أنظمة ERP، وحلول الذكاء الاصطناعي وإنترنت الأشياء.',
    descriptionEn:
      'Explore Bandr Solutions by Saeed Bandar — showcasing AI-powered web platforms, e-commerce storefronts, enterprise ERP systems, and IoT solutions.',
    keywordsAr:
      'Bandr Solutions, سعيد بندر, تطوير مواقع, متاجر إلكترونية, ذكاء اصطناعي, أنظمة ERP, معرض أعمال برمجية',
    keywordsEn:
      'Bandr Solutions, Saeed Bandar, Full Stack Engineer, AI Specialist, React, E-Commerce, ERP, Portfolio',
    ogImage: '/og-bandr-solutions.svg',
  },
  '/projects': {
    path: '/projects',
    routeLabelAr: 'المشاريع ودراسات الحالة (/projects)',
    routeLabelEn: 'Projects & Case Studies (/projects)',
    titleAr: 'المشاريع ودراسات الحالة الهندسية | Bandr Solutions',
    titleEn: 'Software Projects & Engineering Case Studies | Bandr Solutions',
    descriptionAr:
      'تصفح سجل المشاريع البرمجية ودراسات الحالة الموثقة: منصة رفيد ماركتس، نظام الحرائق بالذكاء الاصطناعي FIREAI، التوأم الرقمي تاساور، وأنظمة المحاسبة والمستشفيات.',
    descriptionEn:
      'Browse verified software projects and case studies including Rufid Markets, FIREAI Computer Vision, Tasour Digital Twin, FINB ERP, and Healthcare platforms.',
    keywordsAr:
      'مشاريع برمجية, رفيد ماركتس, دراسة حالة هندسية, توأم رقمي, اكتشاف الحرائق بالذكاء الاصطناعي, متاجر إلكترونية',
    keywordsEn:
      'Rufid Markets, FIREAI, Tasour Digital Twin, FINB ERP, Case Studies, Web Development Projects',
    ogImage: '/og-bandr-solutions.svg',
  },
  '/services': {
    path: '/services',
    routeLabelAr: 'الخدمات التقنية (/services)',
    routeLabelEn: 'Technical Services (/services)',
    titleAr: 'الخدمات التقنية وتطوير الأنظمة والذكاء الاصطناعي | Bandr Solutions',
    titleEn: 'Web Development, AI Automation & ERP Services | Bandr Solutions',
    descriptionAr:
      'خدمات هندسية متكاملة في تطوير تطبيقات الويب والمتاجر الإلكترونية، دمج نماذج الذكاء الاصطناعي، بناء أنظمة المحاسبة والمخزون، وإعداد التقارير التقنية.',
    descriptionEn:
      'Professional engineering services covering web app development, e-commerce storefronts, LLM & AI integration, custom ERP dashboards, and technical auditing.',
    keywordsAr:
      'خدمات برمجية, تصميم مواقع, تطوير متاجر, دمج الذكاء الاصطناعي, أتمتة الأعمال, لوحات تحكم',
    keywordsEn:
      'Web Development Services, E-Commerce Engineering, AI Integration, Workflow Automation, KPI Dashboards',
    ogImage: '/og-bandr-solutions.svg',
  },
  '/community': {
    path: '/community',
    routeLabelAr: 'المنتدى والتحديثات (/community)',
    routeLabelEn: 'Community & Engineering Updates (/community)',
    titleAr: 'منتدى التحديثات والمقالات الهندسية | Bandr Solutions',
    titleEn: 'Engineering Updates & Technical Insights | Bandr Solutions',
    descriptionAr:
      'تابع أحدث المقالات التقنية، تحديثات المشاريع، والنصائح الهندسية في تطوير البرمجيات والذكاء الاصطناعي من Bandr Solutions.',
    descriptionEn:
      'Read the latest platform updates, architectural case studies, and software engineering insights published by Bandr Solutions.',
    keywordsAr:
      'مقالات تقنية, تحديثات المنصة, هندسة البرمجيات, نصائح برمجية, Bandr Solutions',
    keywordsEn:
      'Engineering Blog, Tech Updates, Architecture Notes, Bandr Solutions Community',
    ogImage: '/og-bandr-solutions.svg',
  },
  '/about': {
    path: '/about',
    routeLabelAr: 'نبذة والسيرة الذاتية (/about)',
    routeLabelEn: 'About & Verified CV (/about)',
    titleAr: 'نبذة والسيرة الذاتية الموثقة — سعيد بندر | Bandr Solutions',
    titleEn: 'About Saeed Bandar & Verified Engineering CV | Bandr Solutions',
    descriptionAr:
      'تعرف على المهندس سعيد إسماعيل محمد بندر، المؤهل الأكاديمي في علوم الحاسوب وتقنية المعلومات، ومصفوفة المهارات التقنية الموثقة.',
    descriptionEn:
      'Learn about Saeed Ismail Mohammed Bandar, Full Stack Engineer & AI Specialist, academic credentials, and verified 6-domain technical skills matrix.',
    keywordsAr:
      'سعيد إسماعيل محمد بندر, السيرة الذاتية, مهندس برمجيات, متخصص ذكاء اصطناعي, جامعة الحكمة',
    keywordsEn:
      'Saeed Ismail Mohammed Bandar, Curriculum Vitae, Full Stack Developer, AI Engineer, Skills Matrix',
    ogImage: '/og-bandr-solutions.svg',
  },
  '/contact': {
    path: '/contact',
    routeLabelAr: 'تواصل معي (/contact)',
    routeLabelEn: 'Contact & Project Inquiry (/contact)',
    titleAr: 'تواصل معي واطلب مشروعك التقني | Bandr Solutions',
    titleEn: 'Contact & Start Your Project Inquiry | Bandr Solutions',
    descriptionAr:
      'تواصل مباشرة مع المهندس سعيد بندر عبر البريد الرسمي أو منصات العمل الحر الموثقة أو استخدم نموذج تجهيز ملخص المشروع الفوري.',
    descriptionEn:
      'Connect directly with Saeed Bandar via official email, LinkedIn, or verified freelance profiles, or build a structured project inquiry brief.',
    keywordsAr:
      'تواصل مع مبرمج, طلب مشروع تقني, توظيف مهندس برمجيات, Bandr Solutions تواصل',
    keywordsEn:
      'Contact Bandr Solutions, Hire Full Stack Developer, Project Inquiry Brief, Freelance Profiles',
    ogImage: '/og-bandr-solutions.svg',
  },
};

export const MANAGED_SEO_ROUTES: SeoManagedRoute[] = [
  '/',
  '/projects',
  '/services',
  '/community',
  '/about',
  '/contact',
];

export function loadCachedRouteSeoMap(): RouteSeoMap {
  try {
    const raw = window.localStorage.getItem(SEO_CACHE_STORAGE_KEY);
    if (!raw) return DEFAULT_ROUTE_SEO_MAP;
    const parsed = JSON.parse(raw) as Partial<RouteSeoMap>;
    const merged: RouteSeoMap = { ...DEFAULT_ROUTE_SEO_MAP };
    for (const route of MANAGED_SEO_ROUTES) {
      if (parsed[route]) {
        merged[route] = {
          ...DEFAULT_ROUTE_SEO_MAP[route],
          ...parsed[route],
          path: route,
        };
      }
    }
    return merged;
  } catch {
    return DEFAULT_ROUTE_SEO_MAP;
  }
}

export function saveCachedRouteSeoMap(map: RouteSeoMap): void {
  try {
    window.localStorage.setItem(SEO_CACHE_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('bandr_seo_updated'));
  } catch {
    // Ignore storage errors
  }
}

export function subscribeRouteSeoConfig(
  onUpdate: (seoMap: RouteSeoMap) => void
): () => void {
  const docRef = doc(db, 'site_settings', 'seo_routes');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate(loadCachedRouteSeoMap());
        return;
      }
      const data = snapshot.data();
      if (data && typeof data.routesJson === 'string') {
        try {
          const parsed = JSON.parse(data.routesJson) as Partial<RouteSeoMap>;
          const merged: RouteSeoMap = { ...DEFAULT_ROUTE_SEO_MAP };
          for (const route of MANAGED_SEO_ROUTES) {
            if (parsed[route]) {
              merged[route] = {
                ...DEFAULT_ROUTE_SEO_MAP[route],
                ...parsed[route],
                path: route,
              };
            }
          }
          saveCachedRouteSeoMap(merged);
          onUpdate(merged);
        } catch {
          onUpdate(loadCachedRouteSeoMap());
        }
      }
    },
    () => {
      onUpdate(loadCachedRouteSeoMap());
    }
  );
}

export async function publishRouteSeoConfigToFirestore(
  user: User,
  seoMap: RouteSeoMap
): Promise<void> {
  if (!isAuthorizedOwner(user)) {
    throw new Error('Unauthorized: Only the portfolio owner can update SEO metadata.');
  }

  saveCachedRouteSeoMap(seoMap);
  const docRef = doc(db, 'site_settings', 'seo_routes');
  await setDoc(docRef, {
    routesJson: JSON.stringify(seoMap),
    ownerUid: user.uid,
    updatedAt: serverTimestamp(),
  });
}

function upsertMetaTag(
  selector: string,
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
): void {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Dynamically applies route-specific SEO Title, Meta Description, Keywords,
 * OpenGraph, Twitter Card, Canonical URL, and Schema.org WebPage JSON-LD.
 */
export function applyRouteSeoToDocument(
  currentPath: string,
  lang: Language,
  seoMap: RouteSeoMap
): void {
  const isAr = lang === 'ar';
  const matchedRoute: SeoManagedRoute = (
    MANAGED_SEO_ROUTES.includes(currentPath as SeoManagedRoute)
      ? currentPath
      : '/'
  ) as SeoManagedRoute;

  const entry = seoMap[matchedRoute] || DEFAULT_ROUTE_SEO_MAP[matchedRoute];

  let title = isAr ? entry.titleAr : entry.titleEn;
  let description = isAr ? entry.descriptionAr : entry.descriptionEn;
  const keywords = isAr ? entry.keywordsAr : entry.keywordsEn;
  const ogImage = entry.ogImage || '/og-bandr-solutions.svg';

  if (currentPath === '/admin') {
    title = isAr
      ? 'لوحة الإدارة والتحليلات | Bandr Solutions'
      : 'Private Admin & SEO Console | Bandr Solutions';
  } else if (currentPath === '/404') {
    title = isAr
      ? '404 الصفحة غير موجودة | Bandr Solutions'
      : '404 Page Not Found | Bandr Solutions';
  }

  document.title = title;

  const canonicalUrl = window.location.origin + window.location.pathname;

  upsertMetaTag('meta[name="description"]', 'name', 'description', description);
  upsertMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);

  // OpenGraph Tags
  upsertMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  upsertMetaTag(
    'meta[property="og:description"]',
    'property',
    'og:description',
    description
  );
  upsertMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  upsertMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);

  // Twitter Card Tags
  upsertMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  upsertMetaTag(
    'meta[name="twitter:description"]',
    'name',
    'twitter:description',
    description
  );
  upsertMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

  // Canonical Link
  let canonical = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  // Dynamic WebPage JSON-LD for Search Engine Discoverability
  let ldScript = document.getElementById(
    'dynamic-route-schema'
  ) as HTMLScriptElement | null;
  if (!ldScript) {
    ldScript = document.createElement('script');
    ldScript.id = 'dynamic-route-schema';
    ldScript.type = 'application/ld+json';
    document.head.appendChild(ldScript);
  }
  ldScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: isAr ? 'ar' : 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Bandr Solutions',
      url: window.location.origin,
    },
  });
}
