import React, { useEffect, useState } from 'react';
import { MessageSquare, Calendar, Sparkles, Share2, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../data/portfolioData';
import { CommunityPost, subscribeCommunityPosts } from '../lib/communityService';

interface CommunitySectionProps {
  lang: Language;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = subscribeCommunityPosts((livePosts) => {
      setPosts(livePosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  return (
    <section className="py-20 theme-bg-base border-b theme-border" id="community">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold theme-accent-text theme-bg-surface border theme-border">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{isAr ? 'منتدى التحديثات والرؤى التقنية' : 'Community Updates & Insights Forum'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold theme-text-primary tracking-tight">
            {isAr ? 'آخر التحديثات، المقالات والرؤى الهندسية' : 'Latest Updates, Articles & Engineering Insights'}
          </h2>
          <p className="text-sm sm:text-base theme-text-secondary leading-relaxed">
            {isAr
              ? 'متابعة حية لأحدث الابتكارات، دراسات الحالة، والنصائح البرمجية المفيدة لرواد الأعمال والشركات.'
              : 'Live feed of latest engineering breakthroughs, case studies, and practical tech tips for founders and enterprises.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All Posts' },
            { id: 'announcement', labelAr: 'إعلانات', labelEn: 'Announcements' },
            { id: 'tech_tip', labelAr: 'نصائح تقنية', labelEn: 'Tech Tips' },
            { id: 'case_study', labelAr: 'دراسات حالة', labelEn: 'Case Studies' },
            { id: 'update', labelAr: 'تحديثات المنصة', labelEn: 'Platform Updates' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'theme-btn-primary'
                  : 'theme-bg-surface theme-text-secondary hover:theme-text-primary border theme-border'
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="py-16 text-center theme-text-muted">
            {isAr ? 'جاري تحميل التحديثات...' : 'Loading community updates...'}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center theme-bg-surface rounded-2xl border theme-border p-8 space-y-3">
            <MessageSquare className="w-10 h-10 mx-auto theme-accent-text opacity-50" />
            <h3 className="text-base font-bold theme-text-primary">
              {isAr ? 'لا توجد منشورات حالياً' : 'No posts published yet'}
            </h3>
            <p className="text-xs theme-text-secondary max-w-md mx-auto">
              {isAr
                ? 'سيقوم مالك الموقع بنشر التحديثات والمقالات المفيدة هنا قريباً. يمكنك إدارتها عبر لوحة التحكم.'
                : 'The site owner will publish updates and useful articles here soon. You can manage them in the Admin Dashboard.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const title = isAr ? post.titleAr || post.titleEn : post.titleEn || post.titleAr;
              const content = isAr ? post.contentAr || post.contentEn : post.contentEn || post.contentAr;
              return (
                <article
                  key={post.id}
                  className="theme-bg-surface border theme-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  {post.imageUrl && (
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={post.imageUrl}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {!post.imageUrl && (
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider theme-btn-secondary">
                            {post.category}
                          </span>
                        </div>
                      )}
                      <h3 className="text-lg font-bold theme-text-primary leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm theme-text-secondary line-clamp-3 leading-relaxed">
                        {content}
                      </p>
                    </div>

                    <div className="pt-4 border-t theme-border flex items-center justify-between text-xs theme-text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.authorName}</span>
                      </span>
                      <span className="font-mono-tabular">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
