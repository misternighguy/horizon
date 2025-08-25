import Link from 'next/link';

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
  }>;
}

export default function ResearchCard({ title, subtitle, icon, articles }: ResearchCardProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl mb-2">{icon === 'clock' ? '🕐' : icon === 'bookmark' ? '🔖' : '🎯'}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
      
      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="block p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all"
          >
            <h4 className="text-white font-medium mb-2">{article.title}</h4>
            <p className="text-white/70 text-sm mb-3 line-clamp-2">{article.description}</p>
            <div className="flex justify-between text-xs">
              <span className="text-green-400">Growth: {article.growthScore}</span>
              <span className="text-blue-400">Opportunity: {article.opportunityScore}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
