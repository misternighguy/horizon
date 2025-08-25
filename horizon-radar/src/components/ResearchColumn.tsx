'use client';

import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  description: string;
  growthScore: number;
  opportunityScore: number;
  slug: string;
}

interface ResearchColumnProps {
  title: string;
  subtitle: string;
  icon: 'clock' | 'bookmark' | 'target';
  articles: Article[];
}

// Simple inline icons - no duplication
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const IconBookmark = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14l-7-4-7 4V7a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 3h-6a4 4 0 0 0-4 4v14l7-4 7 4V7a4 4 0 0 0-4-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const IconTarget = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" /></svg>;

export default function ResearchColumn({ title, subtitle, icon, articles }: ResearchColumnProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'clock': return <IconClock />;
      case 'bookmark': return <IconBookmark />;
      case 'target': return <IconTarget />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#f5f5dc] rounded-t-lg p-6 space-y-4">
      {/* Column Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#3C3C3C]">
            {getIcon(icon)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#3C3C3C]">{title}</h2>
            <p className="text-sm text-[#666]">{subtitle}</p>
          </div>
        </div>
        
        {/* Filter Icon */}
        <button className="text-[#3C3C3C] hover:text-[#3C3C3C]/80 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/article/${article.slug}`}
            className="block bg-[#3c352b] rounded-lg p-4 hover:bg-[#2a231c] transition-colors group"
          >
            {/* Article Header */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-medium text-sm leading-tight">
                {article.title}
              </h3>
              {/* Navigation Arrow */}
              <div className="text-white/60 group-hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/80 text-xs leading-relaxed mb-3">
              {article.description}
            </p>

            {/* Metrics */}
            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-[#2a231c] rounded-full px-2 py-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-green-400 text-xs font-medium">
                  Growth: {article.growthScore}
                </span>
              </div>
              
              <div className="flex items-center gap-1 bg-[#2a231c] rounded-full px-2 py-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-green-400 text-xs font-medium">
                  Opportunity: {article.opportunityScore}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
