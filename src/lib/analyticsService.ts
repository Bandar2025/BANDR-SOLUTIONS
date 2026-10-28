import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  getBuiltInProjectGallery,
  PROJECT_CATEGORIES,
  ProjectItem,
  PROJECTS_DATA,
} from '../data/portfolioData';

const ANALYTICS_STORAGE_KEY = 'bandr_real_telemetry_v2';

export type ProjectInteractionType = 'visit' | 'case_study' | 'live_link';

export type ContactInteractionType =
  | 'form_view'
  | 'field_interaction'
  | 'brief_prepared'
  | 'copy_brief'
  | 'email_click'
  | 'phone_click'
  | 'profile_click';

export interface ProjectMetricRecord {
  visits: number;
  caseStudyOpens: number;
  liveLinkClicks: number;
}

export interface DailyTelemetryRecord {
  dateKey: string; // YYYY-MM-DD
  pageViews: number;
  projectInspections: number;
  formViews: number;
  fieldInteractions: number;
  briefsPrepared: number;
  directClicks: number;
}

export interface RealAnalyticsStore {
  projectMetrics: Record<string, ProjectMetricRecord>;
  contactTotals: {
    formViews: number;
    fieldInteractions: number;
    briefsPrepared: number;
    copyBriefs: number;
    emailClicks: number;
    phoneClicks: number;
    profileClicks: number;
  };
  serviceInquiries: Record<string, number>;
  dailyHistory: Record<string, DailyTelemetryRecord>;
  totalPageLoads: number;
  lastUpdated: string;
}

function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function createEmptyAnalyticsStore(): RealAnalyticsStore {
  return {
    projectMetrics: {},
    contactTotals: {
      formViews: 0,
      fieldInteractions: 0,
      briefsPrepared: 0,
      copyBriefs: 0,
      emailClicks: 0,
      phoneClicks: 0,
      profileClicks: 0,
    },
    serviceInquiries: {},
    dailyHistory: {},
    totalPageLoads: 0,
    lastUpdated: new Date().toISOString(),
  };
}

function loadLocalTelemetry(): RealAnalyticsStore {
  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return createEmptyAnalyticsStore();
    const parsed = JSON.parse(raw) as Partial<RealAnalyticsStore>;
    return {
      projectMetrics: parsed.projectMetrics || {},
      contactTotals: {
        ...createEmptyAnalyticsStore().contactTotals,
        ...(parsed.contactTotals || {}),
      },
      serviceInquiries: parsed.serviceInquiries || {},
      dailyHistory: parsed.dailyHistory || {},
      totalPageLoads:
        typeof parsed.totalPageLoads === 'number' ? parsed.totalPageLoads : 0,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    return createEmptyAnalyticsStore();
  }
}

function saveLocalTelemetry(store: RealAnalyticsStore): void {
  try {
    store.lastUpdated = new Date().toISOString();
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent('bandr_analytics_updated'));
  } catch {
    // Ignore storage errors
  }
}

let syncTimeout: number | null = null;

function scheduleFirestoreTelemetrySync(store: RealAnalyticsStore): void {
  if (syncTimeout) {
    window.clearTimeout(syncTimeout);
  }
  syncTimeout = window.setTimeout(async () => {
    try {
      const ref = doc(db, 'site_analytics', 'telemetry');
      await setDoc(ref, {
        payloadJson: JSON.stringify(store),
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Offline or unconfigured fallback stays safely in localStorage
    }
  }, 600);
}

/**
 * Subscribes to live Firestore telemetry (/site_analytics/telemetry) so the Admin
 * dashboard displays real, synchronized visitor interactions across sessions.
 */
export function subscribeRealSiteTelemetry(
  onUpdate: () => void
): () => void {
  const ref = doc(db, 'site_analytics', 'telemetry');
  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      if (data && typeof data.payloadJson === 'string') {
        try {
          const remote = JSON.parse(data.payloadJson) as RealAnalyticsStore;
          const local = loadLocalTelemetry();
          // Merge taking maximums so no real interaction is ever lost
          const merged: RealAnalyticsStore = {
            projectMetrics: { ...local.projectMetrics },
            contactTotals: {
              formViews: Math.max(
                local.contactTotals.formViews,
                remote.contactTotals?.formViews || 0
              ),
              fieldInteractions: Math.max(
                local.contactTotals.fieldInteractions,
                remote.contactTotals?.fieldInteractions || 0
              ),
              briefsPrepared: Math.max(
                local.contactTotals.briefsPrepared,
                remote.contactTotals?.briefsPrepared || 0
              ),
              copyBriefs: Math.max(
                local.contactTotals.copyBriefs,
                remote.contactTotals?.copyBriefs || 0
              ),
              emailClicks: Math.max(
                local.contactTotals.emailClicks,
                remote.contactTotals?.emailClicks || 0
              ),
              phoneClicks: Math.max(
                local.contactTotals.phoneClicks,
                remote.contactTotals?.phoneClicks || 0
              ),
              profileClicks: Math.max(
                local.contactTotals.profileClicks,
                remote.contactTotals?.profileClicks || 0
              ),
            },
            serviceInquiries: { ...local.serviceInquiries },
            dailyHistory: { ...local.dailyHistory },
            totalPageLoads: Math.max(
              local.totalPageLoads,
              remote.totalPageLoads || 0
            ),
            lastUpdated: remote.lastUpdated || new Date().toISOString(),
          };

          if (remote.projectMetrics) {
            for (const [pid, rec] of Object.entries(remote.projectMetrics)) {
              const locRec = merged.projectMetrics[pid] || {
                visits: 0,
                caseStudyOpens: 0,
                liveLinkClicks: 0,
              };
              merged.projectMetrics[pid] = {
                visits: Math.max(locRec.visits, rec.visits || 0),
                caseStudyOpens: Math.max(
                  locRec.caseStudyOpens,
                  rec.caseStudyOpens || 0
                ),
                liveLinkClicks: Math.max(
                  locRec.liveLinkClicks,
                  rec.liveLinkClicks || 0
                ),
              };
            }
          }

          if (remote.serviceInquiries) {
            for (const [sid, count] of Object.entries(
              remote.serviceInquiries
            )) {
              merged.serviceInquiries[sid] = Math.max(
                merged.serviceInquiries[sid] || 0,
                count || 0
              );
            }
          }

          if (remote.dailyHistory) {
            for (const [dKey, dRec] of Object.entries(remote.dailyHistory)) {
              const locDay = merged.dailyHistory[dKey];
              if (!locDay) {
                merged.dailyHistory[dKey] = dRec;
              } else {
                merged.dailyHistory[dKey] = {
                  dateKey: dKey,
                  pageViews: Math.max(locDay.pageViews, dRec.pageViews || 0),
                  projectInspections: Math.max(
                    locDay.projectInspections,
                    dRec.projectInspections || 0
                  ),
                  formViews: Math.max(locDay.formViews, dRec.formViews || 0),
                  fieldInteractions: Math.max(
                    locDay.fieldInteractions,
                    dRec.fieldInteractions || 0
                  ),
                  briefsPrepared: Math.max(
                    locDay.briefsPrepared,
                    dRec.briefsPrepared || 0
                  ),
                  directClicks: Math.max(
                    locDay.directClicks,
                    dRec.directClicks || 0
                  ),
                };
              }
            }
          }

          saveLocalTelemetry(merged);
          onUpdate();
        } catch {
          // Ignore malformed JSON
        }
      }
    },
    () => {
      // Ignore permission or offline errors
    }
  );
}

function ensureDayRecord(
  store: RealAnalyticsStore,
  dateKey: string
): DailyTelemetryRecord {
  if (!store.dailyHistory[dateKey]) {
    store.dailyHistory[dateKey] = {
      dateKey,
      pageViews: 0,
      projectInspections: 0,
      formViews: 0,
      fieldInteractions: 0,
      briefsPrepared: 0,
      directClicks: 0,
    };
  }
  return store.dailyHistory[dateKey];
}

export function recordPageVisit(): void {
  const store = loadLocalTelemetry();
  const today = getTodayDateKey();
  store.totalPageLoads += 1;
  const day = ensureDayRecord(store, today);
  day.pageViews += 1;
  saveLocalTelemetry(store);
  scheduleFirestoreTelemetrySync(store);
}

export function recordProjectInteraction(
  projectId: string,
  type: ProjectInteractionType = 'visit'
): void {
  if (!projectId) return;
  const store = loadLocalTelemetry();
  const today = getTodayDateKey();
  const day = ensureDayRecord(store, today);
  day.projectInspections += 1;

  const current = store.projectMetrics[projectId] || {
    visits: 0,
    caseStudyOpens: 0,
    liveLinkClicks: 0,
  };

  if (type === 'visit') {
    current.visits += 1;
  } else if (type === 'case_study') {
    current.visits += 1;
    current.caseStudyOpens += 1;
  } else if (type === 'live_link') {
    current.visits += 1;
    current.liveLinkClicks += 1;
  }

  store.projectMetrics[projectId] = current;
  saveLocalTelemetry(store);
  scheduleFirestoreTelemetrySync(store);
}

export function recordContactInteraction(
  type: ContactInteractionType,
  serviceLabel?: string
): void {
  const store = loadLocalTelemetry();
  const today = getTodayDateKey();
  const day = ensureDayRecord(store, today);

  switch (type) {
    case 'form_view':
      store.contactTotals.formViews += 1;
      day.formViews += 1;
      break;
    case 'field_interaction':
      store.contactTotals.fieldInteractions += 1;
      day.fieldInteractions += 1;
      break;
    case 'brief_prepared':
      store.contactTotals.briefsPrepared += 1;
      day.briefsPrepared += 1;
      break;
    case 'copy_brief':
      store.contactTotals.copyBriefs += 1;
      day.directClicks += 1;
      break;
    case 'email_click':
      store.contactTotals.emailClicks += 1;
      day.directClicks += 1;
      break;
    case 'phone_click':
      store.contactTotals.phoneClicks += 1;
      day.directClicks += 1;
      break;
    case 'profile_click':
      store.contactTotals.profileClicks += 1;
      day.directClicks += 1;
      break;
  }

  if (serviceLabel && serviceLabel.trim()) {
    const key = serviceLabel.trim();
    store.serviceInquiries[key] = (store.serviceInquiries[key] || 0) + 1;
  }

  saveLocalTelemetry(store);
  scheduleFirestoreTelemetrySync(store);
}

export async function resetRealTelemetryCounters(): Promise<void> {
  const empty = createEmptyAnalyticsStore();
  saveLocalTelemetry(empty);
  try {
    const ref = doc(db, 'site_analytics', 'telemetry');
    await setDoc(ref, {
      payloadJson: JSON.stringify(empty),
      updatedAt: new Date().toISOString(),
    });
  } catch {
    // Ignore if offline
  }
}

export async function refreshTelemetryFromFirestore(): Promise<void> {
  try {
    const ref = doc(db, 'site_analytics', 'telemetry');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.payloadJson === 'string') {
        const remote = JSON.parse(data.payloadJson) as RealAnalyticsStore;
        saveLocalTelemetry(remote);
      }
    }
  } catch {
    // Ignore errors
  }
}

export interface ComputedRealDashboardAnalytics {
  projectChartData: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    shortNameAr: string;
    shortNameEn: string;
    category: string;
    visits: number;
    caseStudyOpens: number;
    liveLinkClicks: number;
    documentedMediaCount: number;
    techStackCount: number;
  }>;
  dailyTimelineData: Array<{
    dateKey: string;
    labelAr: string;
    labelEn: string;
    pageViews: number;
    projectInspections: number;
    formViews: number;
    fieldInteractions: number;
    briefsPrepared: number;
    directClicks: number;
  }>;
  categoryDistributionData: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    projectCount: number;
    totalVisits: number;
    color: string;
  }>;
  contactFunnelData: Array<{
    stageId: string;
    labelAr: string;
    labelEn: string;
    count: number;
    color: string;
  }>;
  summary: {
    totalPageLoads: number;
    totalProjectVisits: number;
    totalCaseStudyOpens: number;
    totalLiveLinkClicks: number;
    totalDocumentedScreenshots: number;
    totalContactFormViews: number;
    totalFieldInteractions: number;
    totalBriefsPrepared: number;
    totalDirectChannelClicks: number;
    conversionRatePercent: number;
    lastUpdated: string;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  'e-commerce': '#38bdf8',
  'ai-iot': '#a855f7',
  'enterprise-accounting': '#10b981',
  'healthcare-tech': '#14b8a6',
  'education-tech': '#6366f1',
  'web-development': '#f59e0b',
};

export function getDashboardAnalytics(
  projects: ProjectItem[]
): ComputedRealDashboardAnalytics {
  const store = loadLocalTelemetry();
  const sourceProjects = projects.length > 0 ? projects : PROJECTS_DATA;

  let totalDocumentedScreenshots = 0;

  const projectChartData = sourceProjects.map((proj) => {
    const rec = store.projectMetrics[proj.id] || {
      visits: 0,
      caseStudyOpens: 0,
      liveLinkClicks: 0,
    };

    const builtInCount = getBuiltInProjectGallery(proj.id).length;
    const firestoreGalleryCount = proj.galleryMediaIds?.length || 0;
    const hasMainThumb = Boolean(
      (proj.thumbnailUrl && proj.thumbnailUrl.trim()) ||
        (proj.genuineScreenshotPath && proj.genuineScreenshotPath.trim())
    );
    const documentedMediaCount = Math.max(
      builtInCount + firestoreGalleryCount,
      hasMainThumb ? 1 : 0
    );
    totalDocumentedScreenshots += documentedMediaCount;

    const techStackCount = proj.technologies?.length || 0;

    const shortNameAr =
      proj.nameAr.split('—')[0].trim().slice(0, 20) || proj.nameAr.slice(0, 20);
    const shortNameEn =
      proj.nameEn.split('—')[0].trim().slice(0, 20) || proj.nameEn.slice(0, 20);

    return {
      id: proj.id,
      nameAr: proj.nameAr,
      nameEn: proj.nameEn,
      shortNameAr,
      shortNameEn,
      category: proj.category,
      visits: rec.visits,
      caseStudyOpens: rec.caseStudyOpens,
      liveLinkClicks: rec.liveLinkClicks,
      documentedMediaCount,
      techStackCount,
    };
  });

  // Sort by real visits first, then by documented media count
  projectChartData.sort((a, b) => {
    if (b.visits !== a.visits) return b.visits - a.visits;
    return b.documentedMediaCount - a.documentedMediaCount;
  });

  // Build real last 7 calendar days timeline
  const dailyTimelineData: ComputedRealDashboardAnalytics['dailyTimelineData'] =
    [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${dayNum}`;
    const shortDate = `${m}/${dayNum}`;

    const dayRec = store.dailyHistory[dateKey] || {
      dateKey,
      pageViews: 0,
      projectInspections: 0,
      formViews: 0,
      fieldInteractions: 0,
      briefsPrepared: 0,
      directClicks: 0,
    };

    dailyTimelineData.push({
      dateKey,
      labelAr: i === 0 ? `اليوم (${shortDate})` : shortDate,
      labelEn: i === 0 ? `Today (${shortDate})` : shortDate,
      pageViews: dayRec.pageViews,
      projectInspections: dayRec.projectInspections,
      formViews: dayRec.formViews,
      fieldInteractions: dayRec.fieldInteractions,
      briefsPrepared: dayRec.briefsPrepared,
      directClicks: dayRec.directClicks,
    });
  }

  // Real category distribution from actual portfolio projects + their real visits
  const categories = PROJECT_CATEGORIES.filter((c) => c.id !== 'all');
  const categoryDistributionData = categories.map((cat) => {
    const matching = projectChartData.filter((p) => p.category === cat.id);
    const totalVisits = matching.reduce((sum, p) => sum + p.visits, 0);
    return {
      id: cat.id,
      nameAr: cat.labelAr,
      nameEn: cat.labelEn,
      projectCount: matching.length,
      totalVisits,
      color: CATEGORY_COLORS[cat.id] || '#38bdf8',
    };
  });

  const totalProjectVisits = projectChartData.reduce(
    (acc, item) => acc + item.visits,
    0
  );
  const totalCaseStudyOpens = projectChartData.reduce(
    (acc, item) => acc + item.caseStudyOpens,
    0
  );
  const totalLiveLinkClicks = projectChartData.reduce(
    (acc, item) => acc + item.liveLinkClicks,
    0
  );

  const c = store.contactTotals;
  const totalDirectChannelClicks =
    c.copyBriefs + c.emailClicks + c.phoneClicks + c.profileClicks;

  const conversionRatePercent =
    c.formViews > 0
      ? Number(
          (
            ((c.briefsPrepared + totalDirectChannelClicks) / c.formViews) *
            100
          ).toFixed(1)
        )
      : 0;

  const contactFunnelData = [
    {
      stageId: 'views',
      labelAr: 'مشاهدات قسم التواصل الفعلية',
      labelEn: 'Real Contact Section Views',
      count: c.formViews,
      color: '#38bdf8',
    },
    {
      stageId: 'interactions',
      labelAr: 'التفاعل الفعلي مع حقول النموذج',
      labelEn: 'Real Form Field Interactions',
      count: c.fieldInteractions,
      color: '#6366f1',
    },
    {
      stageId: 'direct_channels',
      labelAr: 'نقرات البريد والهاتف والروابط المهنية',
      labelEn: 'Direct Email/Phone/Profile Clicks',
      count: totalDirectChannelClicks,
      color: '#10b981',
    },
    {
      stageId: 'briefs',
      labelAr: 'ملخصات المشاريع المجهزة للإرسال',
      labelEn: 'Prepared Project Inquiry Briefs',
      count: c.briefsPrepared,
      color: '#a855f7',
    },
  ];

  return {
    projectChartData,
    dailyTimelineData,
    categoryDistributionData,
    contactFunnelData,
    summary: {
      totalPageLoads: store.totalPageLoads,
      totalProjectVisits,
      totalCaseStudyOpens,
      totalLiveLinkClicks,
      totalDocumentedScreenshots,
      totalContactFormViews: c.formViews,
      totalFieldInteractions: c.fieldInteractions,
      totalBriefsPrepared: c.briefsPrepared,
      totalDirectChannelClicks,
      conversionRatePercent,
      lastUpdated: store.lastUpdated,
    },
  };
}
