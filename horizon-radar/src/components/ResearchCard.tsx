import Link from 'next/link';
import Image from 'next/image';

interface ResearchCardProps {
  title: string;
  subtitle: string;
  icon: string;
  articles: Array<{
    id: string;
    title: string;
    description: string;
    growthScore: number;
    opportunityScore: number;
    slug: string;
    bannerImage?: string;
  }>;
}

export default function ResearchCard({ title, subtitle, icon, articles }: ResearchCardProps) {
  return (
    <div className="space-y-4">
      <div className="text-left">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-white">
            {icon === 'clock' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            ) : icon === 'eye' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : icon === 'trending-up' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block">
                <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
                <polyline points="16,7 22,7 22,13"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white font-inter">{title}</h3>
            <p className="text-white/80 text-sm font-inter">{subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="block bg-white rounded-lg border border-gray-200 hover:shadow-md hover:shadow-white/50 transition-all overflow-hidden"
          >
            {/* Banner Image */}
            <div className="relative w-full h-24 bg-gray-100">
              {article.bannerImage ? (
                <Image
                  src={article.bannerImage}
                  alt={`Banner for ${article.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-inter">
                  No Banner
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h4 className="text-black font-light font-inter text-lg mb-2">{article.title}</h4>
              <p className="text-black font-medium font-inter text-sm mb-3 line-clamp-2">{article.description}</p>
              
              {/* Scores as buttons on the right */}
              <div className="flex justify-end gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 font-inter">
                  Growth: {article.growthScore}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-inter">
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
