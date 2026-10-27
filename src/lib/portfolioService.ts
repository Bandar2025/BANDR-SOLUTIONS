import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  PROJECT_CATEGORIES,
  ProjectCategory,
  ProjectGalleryItem,
  ProjectItem,
  RECOVERABLE_INITIAL_PROJECTS_BACKUP,
} from '../data/portfolioData';
import { optimizeImageWithBrowserCompression } from './imageOptimizer';

export interface FirestoreProjectRecord {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  engineeringContributionAr: string;
  engineeringContributionEn: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabelAr: string;
  categoryLabelEn: string;
  technologies: string[];
  url: string;
  sourceUrl: string;
  featured: boolean;
  displayOrder: number;
  status: 'published' | 'draft';
  isCaseStudyOnly: boolean;
  thumbnailUrl: string;
  thumbnailAltAr: string;
  thumbnailAltEn: string;
  galleryMediaIds: string[];
  ownerUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_\-]+$/;
const SAFE_FILENAME_REGEX = /^[a-zA-Z0-9_\-\.]+$/;

export function sanitizeId(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_\-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return cleaned || `project-${Date.now()}`;
}

export function sanitizeFileName(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/[^a-zA-Z0-9_\-\.]+/g, '_')
    .slice(0, 160);
  return SAFE_FILENAME_REGEX.test(cleaned) ? cleaned : `image_${Date.now()}.webp`;
}

function getCategoryLabels(category: Exclude<ProjectCategory, 'all'>): {
  labelAr: string;
  labelEn: string;
} {
  const found = PROJECT_CATEGORIES.find((c) => c.id === category);
  return {
    labelAr: found?.labelAr || 'مشاريع الويب',
    labelEn: found?.labelEn || 'Web Development',
  };
}

function getDefaultIllustrativeTheme(
  category: Exclude<ProjectCategory, 'all'>,
  displayOrder: number
): ProjectItem['illustrativeTheme'] {
  const indexCode = String(displayOrder).padStart(2, '0');
  switch (category) {
    case 'e-commerce':
      return {
        accentHex: '#2563EB',
        secondaryHex: '#1D4ED8',
        domainCode: `ECOM-${indexCode}`,
        diagramType: 'ecommerce_storefront',
      };
    case 'education-tech':
      return {
        accentHex: '#2563EB',
        secondaryHex: '#7C3AED',
        domainCode: `EDTECH-${indexCode}`,
        diagramType: 'school_platform',
      };
    case 'healthcare-tech':
      return {
        accentHex: '#0D9488',
        secondaryHex: '#2563EB',
        domainCode: `HEALTH-${indexCode}`,
        diagramType: 'healthcare_portal',
      };
    case 'enterprise-accounting':
      return {
        accentHex: '#2563EB',
        secondaryHex: '#0F172A',
        domainCode: `ERP-${indexCode}`,
        diagramType: 'accounting_ledger',
      };
    case 'ai-iot':
      return {
        accentHex: '#7C3AED',
        secondaryHex: '#2563EB',
        domainCode: `AIIOT-${indexCode}`,
        diagramType: 'fire_cv_iot',
      };
    default:
      return {
        accentHex: '#3B82F6',
        secondaryHex: '#1E40AF',
        domainCode: `WEB-${indexCode}`,
        diagramType: 'corporate_web',
      };
  }
}

/**
 * Normalizes known legacy URLs or titles from earlier seeds to the canonical portfolio audit values
 * while preserving any custom owner edits, thumbnails, galleries, and publish statuses.
 */
function resolveCanonicalAuditOverrides(
  docId: string,
  data: FirestoreProjectRecord,
  baseline: ProjectItem
): {
  url: string | null;
  isCaseStudyOnly: boolean;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  engineeringContributionAr?: string;
  engineeringContributionEn?: string;
  category?: Exclude<ProjectCategory, 'all'>;
  categoryLabelAr?: string;
  categoryLabelEn?: string;
  needsFirestorePatch: boolean;
} {
  const rawUrl = data.url && data.url.trim().length > 0 ? data.url.trim() : null;
  let resolvedUrl = rawUrl;
  let resolvedCaseStudyOnly = Boolean(data.isCaseStudyOnly);
  let resolvedNameAr = data.nameAr || baseline.nameAr;
  let resolvedNameEn = data.nameEn || baseline.nameEn;
  let resolvedDescriptionAr: string | undefined = undefined;
  let resolvedDescriptionEn: string | undefined = undefined;
  let resolvedContributionAr: string | undefined = undefined;
  let resolvedContributionEn: string | undefined = undefined;
  let resolvedCategory: Exclude<ProjectCategory, 'all'> | undefined = undefined;
  let resolvedCategoryLabelAr: string | undefined = undefined;
  let resolvedCategoryLabelEn: string | undefined = undefined;
  let needsFirestorePatch = false;

  if (docId === 'integrated-school-management') {
    const isLegacySchool =
      !data.nameEn?.includes('Al-Manara') ||
      data.nameAr === 'نظام إدارة المدارس المتكامل' ||
      !data.descriptionAr?.includes('مجمع منارة اليمن');

    if (isLegacySchool || !rawUrl || !rawUrl.includes('8f028adf-0856-41be-b51c-1b6b9e4e044d')) {
      resolvedUrl = baseline.url;
      resolvedCaseStudyOnly = false;
      resolvedNameAr = baseline.nameAr;
      resolvedNameEn = baseline.nameEn;
      resolvedDescriptionAr = baseline.descriptionAr;
      resolvedDescriptionEn = baseline.descriptionEn;
      resolvedContributionAr = baseline.engineeringContributionAr;
      resolvedContributionEn = baseline.engineeringContributionEn;
      resolvedCategory = baseline.category;
      resolvedCategoryLabelAr = baseline.categoryLabelAr;
      resolvedCategoryLabelEn = baseline.categoryLabelEn;
      needsFirestorePatch = true;
    }
  } else if (docId === 'lumen-yemeni') {
    const isLegacyLumen =
      !data.nameEn?.includes('Creative & Productivity') ||
      data.nameAr === 'Lumen of Yemeni AI Platform' ||
      !data.descriptionAr?.includes('Lumen of Yemeni منصة رقمية');

    if (isLegacyLumen || !rawUrl || !rawUrl.includes('lumen-of-yemeni.vercel.app')) {
      resolvedUrl = baseline.url;
      resolvedCaseStudyOnly = false;
      resolvedNameAr = baseline.nameAr;
      resolvedNameEn = baseline.nameEn;
      resolvedDescriptionAr = baseline.descriptionAr;
      resolvedDescriptionEn = baseline.descriptionEn;
      resolvedContributionAr = baseline.engineeringContributionAr;
      resolvedContributionEn = baseline.engineeringContributionEn;
      resolvedCategory = baseline.category;
      resolvedCategoryLabelAr = baseline.categoryLabelAr;
      resolvedCategoryLabelEn = baseline.categoryLabelEn;
      needsFirestorePatch = true;
    }
  } else if (docId === 'novaro') {
    // Correct NOVARO -> Rufid Markets
    const isLegacyNovaro =
      !data.nameEn?.includes('Rufid') ||
      data.nameEn?.toUpperCase().includes('NOVARO') ||
      data.nameAr?.includes('نوفارو') ||
      data.descriptionAr?.includes('نوفارو');

    if (isLegacyNovaro) {
      resolvedNameAr = baseline.nameAr;
      resolvedNameEn = baseline.nameEn;
      resolvedDescriptionAr = baseline.descriptionAr;
      resolvedDescriptionEn = baseline.descriptionEn;
      resolvedContributionAr = baseline.engineeringContributionAr;
      resolvedContributionEn = baseline.engineeringContributionEn;
      resolvedCategory = baseline.category;
      resolvedCategoryLabelAr = baseline.categoryLabelAr;
      resolvedCategoryLabelEn = baseline.categoryLabelEn;
      needsFirestorePatch = true;
    }
  } else if (docId === 'smart-accounting-warehouse') {
    // Correct Accounting -> FINB
    const isLegacyAccounting =
      !rawUrl ||
      resolvedCaseStudyOnly ||
      !data.nameEn?.includes('FINB') ||
      data.nameEn === 'Smart Accounting & Warehouse Management Platform' ||
      data.nameAr?.includes('المستودعات');

    if (isLegacyAccounting) {
      resolvedUrl = baseline.url;
      resolvedCaseStudyOnly = false;
      resolvedNameAr = baseline.nameAr;
      resolvedNameEn = baseline.nameEn;
      resolvedDescriptionAr = baseline.descriptionAr;
      resolvedDescriptionEn = baseline.descriptionEn;
      resolvedContributionAr = baseline.engineeringContributionAr;
      resolvedContributionEn = baseline.engineeringContributionEn;
      resolvedCategory = baseline.category;
      resolvedCategoryLabelAr = baseline.categoryLabelAr;
      resolvedCategoryLabelEn = baseline.categoryLabelEn;
      needsFirestorePatch = true;
    }
  } else if (docId === 'sehasquare') {
    // Canonical Seha Square
    const isMismatched =
      !data.nameEn?.includes('Seha Square') || !data.nameAr?.includes('ساحة الصحة');

    if (isMismatched) {
      resolvedNameAr = baseline.nameAr;
      resolvedNameEn = baseline.nameEn;
      resolvedDescriptionAr = baseline.descriptionAr;
      resolvedDescriptionEn = baseline.descriptionEn;
      resolvedContributionAr = baseline.engineeringContributionAr;
      resolvedContributionEn = baseline.engineeringContributionEn;
      needsFirestorePatch = true;
    }
  } else if (docId === 'hospital-management-system') {
    // Hospital Management System must NOT have Seha Square title/description
    const hasSehaSquareOverlap =
      data.nameEn?.includes('Seha Square') ||
      data.nameAr?.includes('ساحة الصحة') ||
      !data.nameEn?.includes('Hospital Management System');

    if (hasSehaSquareOverlap) {
      resolvedNameAr = baseline.nameAr;
      resolvedNameEn = baseline.nameEn;
      resolvedDescriptionAr = baseline.descriptionAr;
      resolvedDescriptionEn = baseline.descriptionEn;
      resolvedContributionAr = baseline.engineeringContributionAr;
      resolvedContributionEn = baseline.engineeringContributionEn;
      resolvedUrl = baseline.url;
      resolvedCaseStudyOnly = false;
      needsFirestorePatch = true;
    }
  }

  return {
    url: resolvedUrl,
    isCaseStudyOnly: resolvedCaseStudyOnly,
    nameAr: resolvedNameAr,
    nameEn: resolvedNameEn,
    descriptionAr: resolvedDescriptionAr,
    descriptionEn: resolvedDescriptionEn,
    engineeringContributionAr: resolvedContributionAr,
    engineeringContributionEn: resolvedContributionEn,
    category: resolvedCategory,
    categoryLabelAr: resolvedCategoryLabelAr,
    categoryLabelEn: resolvedCategoryLabelEn,
    needsFirestorePatch,
  };
}

/**
 * Merges a Firestore document with the baseline project metadata (if it matches one of the baseline IDs)
 * or constructs a complete ProjectItem for newly created projects.
 */
export function mapFirestoreRecordToProjectItem(
  docId: string,
  data: FirestoreProjectRecord
): ProjectItem {
  const baseline = RECOVERABLE_INITIAL_PROJECTS_BACKUP.find((b) => b.id === docId);
  const cleanUrl = data.url && data.url.trim().length > 0 ? data.url.trim() : null;
  const cleanSourceUrl =
    data.sourceUrl && data.sourceUrl.trim().length > 0 ? data.sourceUrl.trim() : '';

  if (baseline) {
    const canonical = resolveCanonicalAuditOverrides(docId, data, baseline);
    return {
      ...baseline,
      slug: data.slug || baseline.slug,
      nameAr: canonical.nameAr,
      nameEn: canonical.nameEn,
      descriptionAr: canonical.descriptionAr || data.descriptionAr || baseline.descriptionAr,
      descriptionEn: canonical.descriptionEn || data.descriptionEn || baseline.descriptionEn,
      engineeringContributionAr:
        canonical.engineeringContributionAr ||
        data.engineeringContributionAr ||
        baseline.engineeringContributionAr,
      engineeringContributionEn:
        canonical.engineeringContributionEn ||
        data.engineeringContributionEn ||
        baseline.engineeringContributionEn,
      category: canonical.category || data.category || baseline.category,
      categoryLabelAr:
        canonical.categoryLabelAr || data.categoryLabelAr || baseline.categoryLabelAr,
      categoryLabelEn:
        canonical.categoryLabelEn || data.categoryLabelEn || baseline.categoryLabelEn,
      technologies: Array.isArray(data.technologies) ? data.technologies : baseline.technologies,
      technologiesSource:
        Array.isArray(data.technologies) && data.technologies.length > 0
          ? 'cv_stated'
          : baseline.technologiesSource,
      url: canonical.url,
      sourceUrl: cleanSourceUrl,
      featured: Boolean(data.featured),
      displayOrder: Number(data.displayOrder) || baseline.displayOrder,
      status: data.status === 'draft' ? 'draft' : 'published',
      isCaseStudyOnly: canonical.isCaseStudyOnly,
      thumbnailUrl: data.thumbnailUrl || '',
      thumbnailAltAr: data.thumbnailAltAr || baseline.thumbnailAltAr || '',
      thumbnailAltEn: data.thumbnailAltEn || baseline.thumbnailAltEn || '',
      galleryMediaIds: Array.isArray(data.galleryMediaIds) ? data.galleryMediaIds : [],
      verification: {
        ...baseline.verification,
        urlSupplied: Boolean(canonical.url),
        suppliedUrl: canonical.url,
      },
    };
  }

  return {
    id: docId,
    slug: data.slug || docId,
    displayOrder: Number(data.displayOrder) || 10,
    featured: Boolean(data.featured),
    status: data.status === 'draft' ? 'draft' : 'published',
    nameAr: data.nameAr,
    nameEn: data.nameEn,
    category: data.category,
    categoryLabelAr: data.categoryLabelAr,
    categoryLabelEn: data.categoryLabelEn,
    descriptionAr: data.descriptionAr,
    descriptionEn: data.descriptionEn,
    engineeringContributionAr: data.engineeringContributionAr,
    engineeringContributionEn: data.engineeringContributionEn,
    verifiedFactsAr: [
      cleanUrl
        ? 'مشروع مضاف ومعتمد عبر لوحة تحكم المالك.'
        : 'دراسة حالة هندسية مضافة عبر لوحة تحكم المالك.',
    ],
    verifiedFactsEn: [
      cleanUrl
        ? 'Project added and managed via the owner administration dashboard.'
        : 'Engineering case study added via the owner administration dashboard.',
    ],
    unverifiedBoundariesAr:
      'يُعرض المشروع وفق البيانات المدخلة من قِبل المالك دون ادعاءات إضافية غير موثقة.',
    unverifiedBoundariesEn:
      'Presented strictly according to owner-supplied data without unverified claims.',
    technologies: Array.isArray(data.technologies) ? data.technologies : [],
    technologiesSource:
      Array.isArray(data.technologies) && data.technologies.length > 0 ? 'cv_stated' : 'not_claimed',
    url: cleanUrl,
    sourceUrl: cleanSourceUrl,
    isCaseStudyOnly: Boolean(data.isCaseStudyOnly),
    thumbnailUrl: data.thumbnailUrl || '',
    thumbnailAltAr: data.thumbnailAltAr || data.nameAr,
    thumbnailAltEn: data.thumbnailAltEn || data.nameEn,
    galleryMediaIds: Array.isArray(data.galleryMediaIds) ? data.galleryMediaIds : [],
    verification: {
      urlSupplied: Boolean(cleanUrl),
      suppliedUrl: cleanUrl,
      urlOpened: cleanUrl ? 'not_yet_checked' : 'not_applicable',
      interfaceObserved: cleanUrl ? 'not_yet_observed' : 'not_applicable',
      workflowsTested: false,
      publiclyAccessible: cleanUrl
        ? 'pending_browser_verification'
        : 'case_study_no_public_url',
      statusSummaryAr: cleanUrl
        ? 'تم تزويد رابط المشروع — لم يتم التحقق من الوظائف بعد'
        : 'دراسة حالة هندسية — لا يتوفر رابط عرض عام',
      statusSummaryEn: cleanUrl
        ? 'Project URL provided — functionality not yet verified'
        : 'Engineering Case Study — No public demo URL supplied',
      verificationNotesAr: 'مدرج عبر نظام إدارة المشاريع الخاص بـ Bandr Solutions.',
      verificationNotesEn: 'Managed via the Bandr Solutions private portfolio registry.',
    },
    genuineScreenshotPath: null,
    illustrativeTheme: getDefaultIllustrativeTheme(data.category, Number(data.displayOrder) || 10),
  };
}

/**
 * Real-time subscription for public visitors.
 * Enforces `where('status', '==', 'published')` to match Firestore security rules.
 * If Firestore has not yet been seeded by the owner, returns the 12 verified baseline projects;
 * once seeded, returns the live published Firestore records merged idempotently with any newly added
 * canonical baseline record (such as `hospital-management-system`) sorted by displayOrder.
 */
export function subscribePublicPublishedProjects(
  onProjects: (projects: ProjectItem[]) => void
): () => void {
  const q = query(collection(db, 'projects'), where('status', '==', 'published'));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onProjects([...RECOVERABLE_INITIAL_PROJECTS_BACKUP]);
        return;
      }
      const items: ProjectItem[] = [];
      const seenIds = new Set<string>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestoreProjectRecord;
        seenIds.add(docSnap.id);
        if (data.status === 'published') {
          items.push(mapFirestoreRecordToProjectItem(docSnap.id, data));
        }
      });

      // Ensure newly added canonical projects (e.g., hospital-management-system) appear without duplicates
      for (const baselineItem of RECOVERABLE_INITIAL_PROJECTS_BACKUP) {
        if (!seenIds.has(baselineItem.id) && baselineItem.status !== 'draft') {
          items.push({ ...baselineItem });
        }
      }

      items.sort((a, b) => a.displayOrder - b.displayOrder);
      onProjects(items);
    },
    (error) => {
      // Fallback to baseline projects if offline, while logging structured error
      console.warn('Public projects snapshot fallback:', error);
      onProjects([...RECOVERABLE_INITIAL_PROJECTS_BACKUP]);
    }
  );
  return unsubscribe;
}

/**
 * Real-time subscription for the authenticated owner in `/admin`.
 * Reads both 'published' and 'draft' projects and indicates whether any baseline record
 * needs idempotent creation or canonical URL patching in Firestore.
 */
export function subscribeAdminAllProjects(
  onProjects: (projects: ProjectItem[], isFullySynced: boolean) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'projects';
  const unsubscribe = onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        onProjects([...RECOVERABLE_INITIAL_PROJECTS_BACKUP], false);
        return;
      }
      const items: ProjectItem[] = [];
      const seenIds = new Set<string>();
      let needsSync = false;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestoreProjectRecord;
        seenIds.add(docSnap.id);
        const baseline = RECOVERABLE_INITIAL_PROJECTS_BACKUP.find((b) => b.id === docSnap.id);
        if (baseline) {
          const check = resolveCanonicalAuditOverrides(docSnap.id, data, baseline);
          if (check.needsFirestorePatch) {
            needsSync = true;
          }
        }
        items.push(mapFirestoreRecordToProjectItem(docSnap.id, data));
      });

      for (const baselineItem of RECOVERABLE_INITIAL_PROJECTS_BACKUP) {
        if (!seenIds.has(baselineItem.id)) {
          items.push({ ...baselineItem });
          needsSync = true;
        }
      }

      items.sort((a, b) => a.displayOrder - b.displayOrder);
      onProjects(items, !needsSync);
    },
    (error) => {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
  return unsubscribe;
}

/**
 * Idempotently migrates and synchronizes the 12 canonical baseline projects into Firestore.
 * - Creates any missing baseline project (e.g., `novaro-erp`, `tasour-digital-twin`, or `hospital-management-system`).
 * - Updates existing baseline projects ONLY if their URL/title matches a known legacy value
 *   (or if `forceRestoreAll` is true), preserving all uploaded thumbnails, galleries, alt text,
 *   sort order, featured flags, and draft/published status.
 */
export async function migrateBaselineProjectsToFirestore(
  user: User,
  forceRestoreAll = false
): Promise<number> {
  let migratedCount = 0;
  for (const item of RECOVERABLE_INITIAL_PROJECTS_BACKUP) {
    const docRef = doc(db, 'projects', item.id);
    const path = `projects/${item.id}`;
    try {
      const existingSnap = await getDoc(docRef);
      const labels = getCategoryLabels(item.category);

      if (existingSnap.exists() && !forceRestoreAll) {
        const existingData = existingSnap.data() as FirestoreProjectRecord;
        const audit = resolveCanonicalAuditOverrides(item.id, existingData, item);
        if (!audit.needsFirestorePatch) {
          continue;
        }

        // Preserve all existing uploaded images, galleries, order, featured flag, and status
        const patchedPayload: FirestoreProjectRecord = {
          slug: sanitizeId(existingData.slug || item.slug || item.id),
          nameAr: audit.nameAr.slice(0, 200),
          nameEn: audit.nameEn.slice(0, 200),
          descriptionAr: (
            audit.descriptionAr ||
            existingData.descriptionAr ||
            item.descriptionAr
          ).slice(0, 2000),
          descriptionEn: (
            audit.descriptionEn ||
            existingData.descriptionEn ||
            item.descriptionEn
          ).slice(0, 2000),
          engineeringContributionAr: (
            audit.engineeringContributionAr ||
            existingData.engineeringContributionAr ||
            item.engineeringContributionAr ||
            ''
          ).slice(0, 2000),
          engineeringContributionEn: (
            audit.engineeringContributionEn ||
            existingData.engineeringContributionEn ||
            item.engineeringContributionEn ||
            ''
          ).slice(0, 2000),
          category: audit.category || existingData.category || item.category,
          categoryLabelAr: (
            audit.categoryLabelAr ||
            existingData.categoryLabelAr ||
            labels.labelAr
          ).slice(0, 120),
          categoryLabelEn: (
            audit.categoryLabelEn ||
            existingData.categoryLabelEn ||
            labels.labelEn
          ).slice(0, 120),
          technologies: (
            Array.isArray(existingData.technologies) && existingData.technologies.length > 0
              ? existingData.technologies
              : item.technologies || []
          )
            .slice(0, 25)
            .map((t) => t.slice(0, 80)),
          url: (audit.url || '').slice(0, 500),
          sourceUrl: (existingData.sourceUrl || item.sourceUrl || '').slice(0, 500),
          featured:
            typeof existingData.featured === 'boolean'
              ? existingData.featured
              : Boolean(item.featured),
          displayOrder: Math.max(
            0,
            Math.min(10000, Number(existingData.displayOrder) || Number(item.displayOrder) || 1)
          ),
          status: existingData.status === 'draft' ? 'draft' : 'published',
          isCaseStudyOnly: audit.isCaseStudyOnly,
          thumbnailUrl: (existingData.thumbnailUrl || item.thumbnailUrl || '').slice(0, 450000),
          thumbnailAltAr: (
            existingData.thumbnailAltAr ||
            item.thumbnailAltAr ||
            audit.nameAr
          ).slice(0, 300),
          thumbnailAltEn: (
            existingData.thumbnailAltEn ||
            item.thumbnailAltEn ||
            audit.nameEn
          ).slice(0, 300),
          galleryMediaIds: Array.isArray(existingData.galleryMediaIds)
            ? existingData.galleryMediaIds.slice(0, 10)
            : [],
          ownerUid: existingData.ownerUid || user.uid,
        };

        await setDoc(docRef, {
          ...patchedPayload,
          createdAt: existingData.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        migratedCount++;
        continue;
      }

      const payload: FirestoreProjectRecord = {
        slug: sanitizeId(item.slug || item.id),
        nameAr: item.nameAr.slice(0, 200),
        nameEn: item.nameEn.slice(0, 200),
        descriptionAr: item.descriptionAr.slice(0, 2000),
        descriptionEn: item.descriptionEn.slice(0, 2000),
        engineeringContributionAr: (item.engineeringContributionAr || '').slice(0, 2000),
        engineeringContributionEn: (item.engineeringContributionEn || '').slice(0, 2000),
        category: item.category,
        categoryLabelAr: labels.labelAr.slice(0, 120),
        categoryLabelEn: labels.labelEn.slice(0, 120),
        technologies: (item.technologies || []).slice(0, 25).map((t) => t.slice(0, 80)),
        url: (item.url || '').slice(0, 500),
        sourceUrl: (item.sourceUrl || '').slice(0, 500),
        featured: Boolean(item.featured),
        displayOrder: Math.max(0, Math.min(10000, Number(item.displayOrder) || 1)),
        status: item.status === 'draft' ? 'draft' : 'published',
        isCaseStudyOnly: Boolean(item.isCaseStudyOnly),
        thumbnailUrl: (item.thumbnailUrl || '').slice(0, 450000),
        thumbnailAltAr: (item.thumbnailAltAr || item.nameAr).slice(0, 300),
        thumbnailAltEn: (item.thumbnailAltEn || item.nameEn).slice(0, 300),
        galleryMediaIds: (item.galleryMediaIds || []).slice(0, 10),
        ownerUid: user.uid,
      };

      if (existingSnap.exists()) {
        const existingData = existingSnap.data();
        await setDoc(docRef, {
          ...payload,
          ownerUid: existingData.ownerUid || user.uid,
          createdAt: existingData.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      migratedCount++;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
  return migratedCount;
}

/**
 * Validates and saves (creates or updates) a PortfolioProject document in Firestore.
 */
export async function savePortfolioProject(
  projectId: string,
  input: {
    slug: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    engineeringContributionAr: string;
    engineeringContributionEn: string;
    category: Exclude<ProjectCategory, 'all'>;
    technologies: string[];
    url: string;
    sourceUrl: string;
    featured: boolean;
    displayOrder: number;
    status: 'published' | 'draft';
    isCaseStudyOnly: boolean;
    thumbnailUrl: string;
    thumbnailAltAr: string;
    thumbnailAltEn: string;
    galleryMediaIds: string[];
  },
  user: User
): Promise<void> {
  const cleanId = sanitizeId(projectId);
  if (!VALID_ID_REGEX.test(cleanId)) {
    throw new Error('Invalid project ID format.');
  }

  const labels = getCategoryLabels(input.category);
  const cleanSlug = sanitizeId(input.slug || cleanId);
  const docRef = doc(db, 'projects', cleanId);
  const path = `projects/${cleanId}`;

  const validatedData: FirestoreProjectRecord = {
    slug: cleanSlug,
    nameAr: input.nameAr.trim().slice(0, 200),
    nameEn: input.nameEn.trim().slice(0, 200),
    descriptionAr: input.descriptionAr.trim().slice(0, 2000),
    descriptionEn: input.descriptionEn.trim().slice(0, 2000),
    engineeringContributionAr: input.engineeringContributionAr.trim().slice(0, 2000),
    engineeringContributionEn: input.engineeringContributionEn.trim().slice(0, 2000),
    category: input.category,
    categoryLabelAr: labels.labelAr.slice(0, 120),
    categoryLabelEn: labels.labelEn.slice(0, 120),
    technologies: input.technologies
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 25)
      .map((t) => t.slice(0, 80)),
    url: input.isCaseStudyOnly ? '' : input.url.trim().slice(0, 500),
    sourceUrl: input.sourceUrl.trim().slice(0, 500),
    featured: Boolean(input.featured),
    displayOrder: Math.max(0, Math.min(10000, Number(input.displayOrder) || 1)),
    status: input.status === 'draft' ? 'draft' : 'published',
    isCaseStudyOnly: Boolean(input.isCaseStudyOnly),
    thumbnailUrl: (input.thumbnailUrl || '').slice(0, 850000),
    thumbnailAltAr: input.thumbnailAltAr.trim().slice(0, 300),
    thumbnailAltEn: input.thumbnailAltEn.trim().slice(0, 300),
    galleryMediaIds: (input.galleryMediaIds || []).slice(0, 25),
    ownerUid: user.uid,
  };

  try {
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data();
      await setDoc(docRef, {
        ...validatedData,
        ownerUid: existingData.ownerUid || user.uid,
        createdAt: existingData.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...validatedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Keep associated gallery media status synchronized with the project status
    if (validatedData.galleryMediaIds.length > 0) {
      for (const mediaId of validatedData.galleryMediaIds) {
        const mediaRef = doc(db, 'project_media', mediaId);
        const mediaSnap = await getDoc(mediaRef);
        if (mediaSnap.exists() && mediaSnap.data().status !== validatedData.status) {
          await updateDoc(mediaRef, {
            status: validatedData.status,
            updatedAt: serverTimestamp(),
          });
        }
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function toggleProjectPublishStatus(
  projectId: string,
  nextStatus: 'published' | 'draft'
): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      status: nextStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deletePortfolioProject(
  projectId: string,
  galleryMediaIds: string[] = []
): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    for (const mediaId of galleryMediaIds) {
      await deleteDoc(doc(db, 'project_media', mediaId));
    }
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Validates actual file magic bytes (PNG, JPEG, WebP) rather than trusting file extension alone.
 */
export async function validateImageMagicBytes(
  file: File
): Promise<'image/png' | 'image/jpeg' | 'image/webp'> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds the 5 MB maximum upload limit.');
  }
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // WebP: "RIFF" (52 49 46 46) ... "WEBP" (57 45 42 50)
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  throw new Error(
    'Invalid file binary header. Only genuine PNG, JPEG, or WebP images are permitted.'
  );
}

/**
 * Optimizes an validated image file via HTML5 Canvas into a responsive WebP/JPEG data URI
 * guaranteed to fit cleanly within Firestore document limits.
 */
export async function processAndOptimizeImageFile(
  file: File,
  maxWidth = 1920,
  onProgress?: (pct: number) => void
): Promise<{
  dataUrl: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  safeFileName: string;
}> {
  if (onProgress) onProgress(15);
  await validateImageMagicBytes(file);
  if (onProgress) onProgress(30);

  const res = await optimizeImageWithBrowserCompression(file, Math.min(maxWidth || 1920, 1920), (p) => {
    if (onProgress) onProgress(30 + Math.round(p * 0.7));
  });

  return {
    dataUrl: res.dataUrl,
    mimeType: res.mimeType,
    safeFileName: sanitizeFileName(file.name),
  };
}

/**
 * Uploads a gallery image into `/project_media/{mediaId}` (requires parent project to exist in `/projects/{projectId}`).
 */
export async function uploadProjectGalleryMedia(
  file: File,
  projectId: string,
  altAr: string,
  altEn: string,
  projectStatus: 'published' | 'draft',
  user: User,
  onProgress?: (pct: number) => void
): Promise<ProjectGalleryItem> {
  const processed = await processAndOptimizeImageFile(file, 1920, onProgress);
  const mediaId = sanitizeId(`media_${projectId}_${Date.now()}`);
  const path = `project_media/${mediaId}`;

  const normalizedStatus: 'published' | 'draft' =
    projectStatus === 'draft' ? 'draft' : 'published';

  const record = {
    projectId: sanitizeId(projectId),
    fileName: sanitizeFileName(processed.safeFileName),
    mimeType: processed.mimeType,
    dataUrl: processed.dataUrl,
    altAr: (altAr || '').trim().slice(0, 300),
    altEn: (altEn || '').trim().slice(0, 300),
    status: normalizedStatus,
    ownerUid: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'project_media', mediaId), record);
    if (onProgress) onProgress(100);
    return {
      id: mediaId,
      projectId: record.projectId,
      fileName: record.fileName,
      mimeType: record.mimeType,
      dataUrl: record.dataUrl,
      altAr: record.altAr,
      altEn: record.altEn,
      status: record.status,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function uploadPreOptimizedGalleryMedia(
  dataUrl: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp',
  safeFileName: string,
  projectId: string,
  altAr: string,
  altEn: string,
  projectStatus: 'published' | 'draft',
  user: User
): Promise<ProjectGalleryItem> {
  const mediaId = sanitizeId(
    `media_${projectId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  );
  const path = `project_media/${mediaId}`;
  const cleanFileName = sanitizeFileName(safeFileName);
  const validMimeType: 'image/jpeg' | 'image/png' | 'image/webp' =
    mimeType === 'image/png' || mimeType === 'image/jpeg' || mimeType === 'image/webp'
      ? mimeType
      : 'image/webp';
  const normalizedStatus: 'published' | 'draft' =
    projectStatus === 'draft' ? 'draft' : 'published';

  const record = {
    projectId: sanitizeId(projectId),
    fileName: cleanFileName,
    mimeType: validMimeType,
    dataUrl,
    altAr: (altAr || '').trim().slice(0, 300),
    altEn: (altEn || '').trim().slice(0, 300),
    status: normalizedStatus,
    ownerUid: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'project_media', mediaId), record);
    return {
      id: mediaId,
      projectId: record.projectId,
      fileName: record.fileName,
      mimeType: record.mimeType,
      dataUrl: record.dataUrl,
      altAr: record.altAr,
      altEn: record.altEn,
      status: record.status,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateProjectGalleryMediaAlt(
  mediaId: string,
  altAr: string,
  altEn: string
): Promise<void> {
  const path = `project_media/${mediaId}`;
  try {
    await updateDoc(doc(db, 'project_media', mediaId), {
      altAr: altAr.trim().slice(0, 300),
      altEn: altEn.trim().slice(0, 300),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProjectGalleryMedia(mediaId: string): Promise<void> {
  const path = `project_media/${mediaId}`;
  try {
    await deleteDoc(doc(db, 'project_media', mediaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchProjectGalleryItems(
  mediaIds: string[],
  publicOnly = true
): Promise<ProjectGalleryItem[]> {
  if (!mediaIds || mediaIds.length === 0) return [];
  const results: ProjectGalleryItem[] = [];
  for (const id of mediaIds.slice(0, 10)) {
    try {
      const snap = await getDoc(doc(db, 'project_media', id));
      if (snap.exists()) {
        const data = snap.data();
        if (!publicOnly || data.status === 'published') {
          results.push({
            id: snap.id,
            projectId: data.projectId,
            fileName: data.fileName,
            mimeType: data.mimeType,
            dataUrl: data.dataUrl,
            altAr: data.altAr || '',
            altEn: data.altEn || '',
            status: data.status,
          });
        }
      }
    } catch {
      // Ignore individual unreadable draft media items for public visitors
    }
  }
  return results;
}

/**
 * Diagnostic helper allowing a non-owner or unauthenticated user on `/admin` to test
 * that Firestore Security Rules reject unauthorized draft reads and writes.
 */
export async function verifyServerSideUnauthorizedRejection(): Promise<{
  draftReadRejected: boolean;
  writeRejected: boolean;
  themeWriteRejected: boolean;
}> {
  let draftReadRejected = false;
  let writeRejected = false;
  let themeWriteRejected = false;

  try {
    const q = query(collection(db, 'projects'), where('status', '==', 'draft'));
    await getDocs(q);
  } catch {
    draftReadRejected = true;
  }

  try {
    await setDoc(doc(db, 'projects', 'unauthorized-probe'), {
      slug: 'unauthorized-probe',
      status: 'draft',
    });
  } catch {
    writeRejected = true;
  }

  try {
    await setDoc(doc(db, 'site_settings', 'appearance'), {
      themeId: 'obsidian',
      density: 'compact',
      reducedMotion: false,
    });
  } catch {
    themeWriteRejected = true;
  }

  return { draftReadRejected, writeRejected, themeWriteRejected };
}
