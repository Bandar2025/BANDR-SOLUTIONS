import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Eye,
  FileText,
  Images,
  MousePointerClick,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { Language, ProjectItem } from '../data/portfolioData';
import {
  getDashboardAnalytics,
  refreshTelemetryFromFirestore,
  resetRealTelemetryCounters,
  subscribeRealSiteTelemetry,
} from '../lib/analyticsService';

interface AdminAnalyticsChartsProps {
  lang: Language;
  projects: ProjectItem[];
}

export const AdminAnalyticsCharts: React.FC<AdminAnalyticsChartsProps> = ({
  lang,
  projects,
}) => {
  const isAr = lang === 'ar';
  const [refreshTick, setRefreshTick] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetricFilter, setSelectedMetricFilter] = useState<
    'all' | 'interactions' | 'assets'
  >('all');

  useEffect(() => {
    const handleUpdate = () => setRefreshTick((prev) => prev + 1);
    window.addEventListener('bandr_analytics_updated', handleUpdate);
    const unsubFirestore = subscribeRealSiteTelemetry(handleUpdate);
    return () => {
      window.removeEventListener('bandr_analytics_updated', handleUpdate);
      unsubFirestore();
    };
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await refreshTelemetryFromFirestore();
    setRefreshTick((prev) => prev + 1);
    setRefreshing(false);
  };

  const analytics = useMemo(
    () => getDashboardAnalytics(projects),
    [projects, refreshTick]
  );

  const {
    projectChartData,
    dailyTimelineData,
    categoryDistributionData,
    contactFunnelData,
    summary,
  } = analytics;

  const formattedProjectBars = useMemo(() => {
    return projectChartData.map((item) => ({
      ...item,
      displayName: isAr ? item.shortNameAr : item.shortNameEn,
      fullName: isAr ? item.nameAr : item.nameEn,
    }));
  }, [projectChartData, isAr]);

  const formattedDailyTimeline = useMemo(() => {
    return dailyTimelineData.map((pt) => ({
      ...pt,
      periodLabel: isAr ? pt.labelAr : pt.labelEn,
    }));
  }, [dailyTimelineData, isAr]);

  const formattedCategoryPie = useMemo(() => {
    return categoryDistributionData.map((c) => ({
      ...c,
      displayName: isAr ? c.nameAr : c.nameEn,
    }));
  }, [categoryDistributionData, isAr]);

  return (
    <div className="space-y-6">
      {/* Header & Real Telemetry Verification Badge */}
      <div className="theme-bg-surface border theme-border rounded-2xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono-tabular text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isAr
                ? 'إحصائيات حقيقية 100% متزامنة مع قاعدة البيانات · LIVE FIRESTORE TELEMETRY'
                : '100% REAL VERIFIED TELEMETRY · ZERO FABRICATED DATA'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold theme-text-primary">
            {isAr
              ? 'الإحصائيات الفعلية لزيارات المشاريع وتفاعل المستخدمين مع نماذج التواصل'
              : 'Real Project Visits, Assets & Contact Form Engagement Analytics'}
          </h2>
          <p className="text-xs theme-text-secondary">
            {isAr
              ? 'جميع الأرقام المعروضة أدناه مستمدة حصرياً من التفاعلات الفعلية المسجلة في المتصفح وقاعدة بيانات Firestore والبيانات الحقيقية للمشاريع المنشورة دون أي أرقام افتراضية أو وهمية.'
              : 'All metrics below reflect genuine user interactions persisted in Firestore and real portfolio database counts — zero fake or simulated numbers.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl theme-btn-primary text-xs font-bold cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
            />
            <span>
              {isAr ? 'مزامنة البيانات الحية' : 'Sync Live Telemetry'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => resetRealTelemetryCounters()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl theme-btn-secondary text-xs font-semibold cursor-pointer"
            title={
              isAr
                ? 'تصفير عدادات الزيارات والتفاعل المسجلة'
                : 'Reset recorded interaction counters to zero'
            }
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'تصفير العدادات' : 'Reset Counters'}</span>
          </button>
        </div>
      </div>

      {/* Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl theme-card-elevated space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-muted">
              {isAr
                ? 'الزيارات الفعلية للمشاريع'
                : 'Real Recorded Project Visits'}
            </span>
            <div className="w-8 h-8 rounded-lg theme-bg-surface border theme-border flex items-center justify-center">
              <Eye className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-tabular theme-text-primary">
            {summary.totalProjectVisits.toLocaleString()}
          </div>
          <div className="text-[11px] theme-text-secondary font-medium flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isAr
                ? `إجمالي تحميلات الصفحات: ${summary.totalPageLoads.toLocaleString()}`
                : `Total page loads: ${summary.totalPageLoads.toLocaleString()}`}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl theme-card-elevated space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-muted">
              {isAr
                ? 'فتح دراسات الحالة والروابط'
                : 'Case Study Opens & Link Clicks'}
            </span>
            <div className="w-8 h-8 rounded-lg theme-bg-surface border theme-border flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-tabular theme-text-primary">
            {(
              summary.totalCaseStudyOpens + summary.totalLiveLinkClicks
            ).toLocaleString()}
          </div>
          <div className="text-[11px] theme-text-secondary font-medium">
            {isAr
              ? `${summary.totalCaseStudyOpens} معاينة تفصيلية · ${summary.totalLiveLinkClicks} نقرة رابط حي`
              : `${summary.totalCaseStudyOpens} modal views · ${summary.totalLiveLinkClicks} live URL clicks`}
          </div>
        </div>

        <div className="p-5 rounded-2xl theme-card-elevated space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-muted">
              {isAr
                ? 'تفاعلات نموذج التواصل الفعلية'
                : 'Real Contact Form Events'}
            </span>
            <div className="w-8 h-8 rounded-lg theme-bg-surface border theme-border flex items-center justify-center">
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-tabular theme-text-primary">
            {(
              summary.totalFieldInteractions +
              summary.totalBriefsPrepared +
              summary.totalDirectChannelClicks
            ).toLocaleString()}
          </div>
          <div className="text-[11px] theme-text-secondary font-medium">
            {isAr
              ? `${summary.totalBriefsPrepared} ملخص مرسل · ${summary.totalContactFormViews} مشاهدة للنموذج`
              : `${summary.totalBriefsPrepared} briefs prepared · ${summary.totalContactFormViews} form views`}
          </div>
        </div>

        <div className="p-5 rounded-2xl theme-card-elevated space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-muted">
              {isAr
                ? 'إجمالي الصور الموثقة بالمشاريع'
                : 'Verified Project Screenshots'}
            </span>
            <div className="w-8 h-8 rounded-lg theme-bg-surface border theme-border flex items-center justify-center">
              <Images className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-tabular theme-accent-text">
            {summary.totalDocumentedScreenshots.toLocaleString()}
          </div>
          <div className="text-[11px] theme-text-secondary font-medium">
            {isAr
              ? `موزعة على ${projectChartData.length} مشروعاً في المعرض`
              : `Across ${projectChartData.length} real portfolio projects`}
          </div>
        </div>
      </div>

      {/* CHART 1: Real Project Visits, Case Study Opens & Documented Screenshots per Project */}
      <div className="theme-bg-surface border theme-border rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold theme-text-primary">
              {isAr
                ? 'إحصائيات المشاريع الحقيقية: الزيارات الفعلية، فتح دراسات الحالة، وعدد الصور والتقنيات'
                : 'Real Project Metrics: Visits, Case Study Opens, Documented Screenshots & Tech Stack'}
            </h3>
            <p className="text-xs theme-text-secondary mt-0.5">
              {isAr
                ? 'يعرض الزيارات الفعلية المسجلة لكل مشروع، إلى جانب العدد الحقيقي للصور الموثقة والتقنيات المستخدمة في كل مشروع'
                : 'Displays real recorded visitor interactions alongside actual documented screenshots and technologies per project'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {(
              [
                {
                  id: 'all',
                  labelAr: 'جميع المؤشرات الحقيقية',
                  labelEn: 'All Real Metrics',
                },
                {
                  id: 'interactions',
                  labelAr: 'الزيارات والتفاعل فقط',
                  labelEn: 'Visits & Clicks Only',
                },
                {
                  id: 'assets',
                  labelAr: 'الصور والتقنيات الموثقة',
                  labelEn: 'Screenshots & Tech Count',
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedMetricFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedMetricFilter === tab.id
                    ? 'theme-btn-primary'
                    : 'theme-btn-secondary'
                }`}
              >
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[350px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedProjectBars}
              margin={{ top: 12, right: 20, left: 0, bottom: 32 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148, 163, 184, 0.16)"
                vertical={false}
              />
              <XAxis
                dataKey="displayName"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-elevated, #0f172a)',
                  borderColor: 'var(--border-subtle, #1e293b)',
                  borderRadius: '12px',
                  color: 'var(--text-primary, #f8fafc)',
                  fontSize: '12px',
                }}
                labelFormatter={(_, payload) => {
                  const first = payload?.[0]?.payload;
                  return first?.fullName || '';
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              {(selectedMetricFilter === 'all' ||
                selectedMetricFilter === 'interactions') && (
                <Bar
                  dataKey="visits"
                  name={isAr ? 'الزيارات الفعلية' : 'Real Visits'}
                  fill="#38bdf8"
                  radius={[6, 6, 0, 0]}
                />
              )}
              {(selectedMetricFilter === 'all' ||
                selectedMetricFilter === 'interactions') && (
                <Bar
                  dataKey="caseStudyOpens"
                  name={
                    isAr ? 'فتح نافذة المشروع' : 'Modal Case Study Opens'
                  }
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              )}
              {(selectedMetricFilter === 'all' ||
                selectedMetricFilter === 'assets') && (
                <Bar
                  dataKey="documentedMediaCount"
                  name={
                    isAr ? 'عدد الصور الموثقة' : 'Documented Screenshots'
                  }
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              )}
              {(selectedMetricFilter === 'all' ||
                selectedMetricFilter === 'assets') && (
                <Bar
                  dataKey="techStackCount"
                  name={isAr ? 'عدد التقنيات المعتمدة' : 'Verified Tech Count'}
                  fill="#a855f7"
                  radius={[6, 6, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2 & CHART 3 Grid: Real Daily Interactions Timeline & Portfolio Domain Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AreaChart: Real Daily Activity & Contact Form Engagement (Last 7 Calendar Days) */}
        <div className="lg:col-span-7 theme-bg-surface border theme-border rounded-2xl p-5 sm:p-6 space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold theme-text-primary">
              {isAr
                ? 'السجل اليومي الفعلي للزيارات وتفاعل نماذج التواصل (آخر 7 أيام)'
                : 'Real Daily Sessions & Contact Form Engagement (Last 7 Days)'}
            </h3>
            <p className="text-xs theme-text-secondary mt-0.5">
              {isAr
                ? 'بيانات حقيقية مسجلة حسب التاريخ الفعلي لمشاهدات الموقع، معاينات المشاريع، وتفاعلات نموذج التواصل'
                : 'Authentic daily telemetry tracking page loads, project inspections, contact form views, and field interactions'}
            </p>
          </div>

          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedDailyTimeline}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="gradPageViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradProjViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient
                    id="gradContactEvents"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148, 163, 184, 0.16)"
                  vertical={false}
                />
                <XAxis
                  dataKey="periodLabel"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated, #0f172a)',
                    borderColor: 'var(--border-subtle, #1e293b)',
                    borderRadius: '12px',
                    color: 'var(--text-primary, #f8fafc)',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  name={isAr ? 'زيارات الصفحات' : 'Page Views'}
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gradPageViews)"
                />
                <Area
                  type="monotone"
                  dataKey="projectInspections"
                  name={isAr ? 'معاينات المشاريع' : 'Project Inspections'}
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gradProjViews)"
                />
                <Area
                  type="monotone"
                  dataKey="fieldInteractions"
                  name={
                    isAr ? 'تفاعلات نموذج التواصل' : 'Contact Form Interactions'
                  }
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gradContactEvents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PieChart + Real Contact Funnel */}
        <div className="lg:col-span-5 theme-bg-surface border theme-border rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold theme-text-primary">
              {isAr
                ? 'التوزيع الحقيقي لمشاريع المعرض حسب القطاع التقني'
                : 'Actual Portfolio Projects by Technical Domain'}
            </h3>
            <p className="text-xs theme-text-secondary mt-0.5">
              {isAr
                ? `التوزيع الفعلي لعدد المشاريع (${projects.length} مشروعاً) في قاعدة البيانات`
                : `Exact distribution of the ${projects.length} projects in the database`}
            </p>
          </div>

          <div className="h-[200px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedCategoryPie}
                  dataKey="projectCount"
                  nameKey="displayName"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={76}
                  paddingAngle={4}
                >
                  {formattedCategoryPie.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-elevated, #0f172a)',
                    borderColor: 'var(--border-subtle, #1e293b)',
                    borderRadius: '12px',
                    color: 'var(--text-primary, #f8fafc)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Real Contact Conversion Funnel Breakdown */}
          <div className="space-y-2.5 pt-3 border-t theme-border">
            <div className="flex items-center justify-between text-xs font-bold theme-text-primary">
              <span>
                {isAr
                  ? 'قمع التفاعل الحقيقي مع نموذج التواصل'
                  : 'Real Contact Form Conversion Funnel'}
              </span>
              <span className="font-mono-tabular theme-accent-text">
                {summary.conversionRatePercent}%
              </span>
            </div>
            {contactFunnelData.map((stage) => {
              const maxCount = Math.max(
                1,
                ...contactFunnelData.map((s) => s.count)
              );
              const pct =
                stage.count > 0
                  ? Math.min(100, Math.round((stage.count / maxCount) * 100))
                  : 0;
              return (
                <div key={stage.stageId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="theme-text-secondary">
                      {isAr ? stage.labelAr : stage.labelEn}
                    </span>
                    <span className="font-mono-tabular font-bold theme-text-primary">
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full theme-card-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
