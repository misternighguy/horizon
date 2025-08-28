'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleSidebar from '@/components/ArticleSidebar';
import ArticleHero from '@/components/article/ArticleHero';
import ArticleContent from '@/components/article/ArticleContent';
import CommentSystem from '@/components/article/CommentSystem';
import ReadingProgress from '@/components/article/ReadingProgress';
import GrainOverlay from '@/components/article/GrainOverlay';
import { useArticle } from '@/hooks/useArticle';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Use custom hook for article logic
  const {
    article,
    readingStyle,
    setReadingStyle,
    activeSection,
    readingProgress,
    parallaxOffset,
    articleRef,
    sectionsRef,
    scrollToSection
  } = useArticle(slug);

  // State for footer fade effect
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  // Handle sidebar sticky state changes
  const handleStickyChange = (isSticky: boolean) => {
    setIsFooterVisible(!isSticky);
  };









  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Article Not Found</h1>
          <p className="text-white/60 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/research" className="text-[rgb(var(--color-horizon-green))] hover:underline">
            Browse Research
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Reading Progress Bar */}
      <ReadingProgress progress={readingProgress} />

      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Main Content */}
      <main id="main-content" ref={articleRef} className="relative">
        {/* Hero Section */}
        <ArticleHero 
          article={article}
          readingStyle={readingStyle}
          setReadingStyle={setReadingStyle}
          parallaxOffset={parallaxOffset}
        />

        {/* Mobile Table of Contents - Only visible on mobile */}
        <div className="sidebar:hidden px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-3 mb-4">
              <button 
                className="w-full flex items-center justify-between text-left"
                onClick={() => {
                  // TODO: Implement expand/collapse functionality
                  const tocContent = document.getElementById('mobile-toc-content');
                  const arrow = document.getElementById('mobile-toc-arrow');
                  if (tocContent && arrow) {
                    const isExpanded = tocContent.classList.contains('hidden');
                    tocContent.classList.toggle('hidden');
                    arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
                  }
                }}
              >
                <h3 className="text-lg font-medium text-[rgb(var(--color-horizon-green))]">Table of Contents</h3>
                <svg 
                  id="mobile-toc-arrow"
                  className="w-5 h-5 text-[rgb(var(--color-horizon-green))] transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              </button>
              
              <div id="mobile-toc-content" className="hidden mt-3 pt-3 border-t border-white/20">
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const currentContent = article.content?.[readingStyle]?.sections || [];
                    
                    // If dynamic content exists, use it
                    if (currentContent.length > 0) {
                      return currentContent
                        .sort((a, b) => a.order - b.order)
                        .map((section) => ({
                          id: `section-${section.order}`,
                          label: section.title
                        }));
                    }
                    
                    // Fall back to static sections
                    return [
                      { id: 'abstract', label: 'Abstract' },
                      { id: 'architecture', label: 'Architecture' },
                      { id: 'mechanics', label: 'Mechanics' },
                      { id: 'problem-users-value', label: 'Problem & Value' },
                      { id: 'team', label: 'Team' },
                      { id: 'timeline', label: 'Timeline' },
                      { id: 'links', label: 'Links' },
                      { id: 'ecosystem', label: 'Ecosystem' },
                      { id: 'credentials', label: 'Credentials' },
                      { id: 'comments', label: 'Comments' }
                    ];
                  })().map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeSection === item.id
                          ? 'bg-[rgb(var(--color-horizon-green))] text-black font-medium'
                          : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content and Sidebar */}
        <section className="px-4 sm:px-6 sidebar:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sidebar:grid-cols-5 gap-6 sidebar:gap-12">
              {/* Main Content Column */}
              <div ref={sectionsRef} className="sidebar:col-span-4">
                <ArticleContent 
                  article={article}
                  readingStyle={readingStyle}
                />
              </div>

              {/* Right Aside - Hidden on mobile, shown on desktop */}
              <div className="hidden sidebar:block sidebar:col-span-1">
                <ArticleSidebar 
                  article={article}
                  activeSection={activeSection}
                  scrollToSection={scrollToSection}
                  readingStyle={readingStyle}
                  onStickyChange={handleStickyChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Sidebar Components - Only visible on mobile */}
        <div className="sidebar:hidden px-4 sm:px-6 mb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Radar Rating */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-medium text-white mb-4">Radar Rating</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Growth Potential</span>
                  <span className="text-white font-medium">{article.radarRating.growthPotential}/100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-[rgb(var(--color-horizon-green))] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${article.radarRating.growthPotential}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Investment Opportunity</span>
                  <span className="text-white font-medium">{article.radarRating.investmentOpportunity}/100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-[rgb(var(--color-horizon-green))] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${article.radarRating.investmentOpportunity}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Member Opinions</span>
                  <span className="text-white font-medium">{article.radarRating.memberOpinions}/100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-[rgb(var(--color-horizon-green))] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${article.radarRating.memberOpinions}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Notable Stats */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-medium text-white mb-4">Notable Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">TVL</span>
                  <span className="text-white font-medium">{article.stats.tvl}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">24h Volume</span>
                  <span className="text-white font-medium">{article.stats.volume}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Users</span>
                  <span className="text-white font-medium">{article.stats.users}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Capital Raised</span>
                  <span className="text-white font-medium">{article.stats.capital}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Opinions</span>
                  <span className="text-white font-medium">{article.stats.opinions}</span>
                </div>
              </div>
            </div>

            {/* Tokenomics */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-medium text-white mb-4">Tokenomics</h3>
              <div className="space-y-3">
                {article.tokenomics.map((item, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className={`text-sm ${
                      item.status === 'good' ? 'text-green-400' :
                      item.status === 'neutral' ? 'text-yellow-400' :
                      item.status === 'bad' ? 'text-red-400' :
                      'text-white/60'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-white font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <Link 
                  href={`/protocols/${article.slug}`}
                  className="text-[rgb(var(--color-horizon-green))] hover:underline text-sm"
                >
                  Read Tokenomics Strategy + Analysis →
                </Link>
              </div>
            </div>

            {/* CTA Block */}
            <div className="bg-gradient-to-br from-[rgb(var(--color-horizon-green))]/20 to-[rgb(var(--color-horizon-green))]/10 border border-[rgb(var(--color-horizon-green))]/30 rounded-xl p-4">
              <h3 className="text-lg font-medium text-white mb-3">Stay Updated</h3>
              <p className="text-white/80 text-sm mb-4">
                Get the latest insights on {article.title} and other protocols.
              </p>
              <Link 
                href="/premium"
                className="block w-full text-center bg-[rgb(var(--color-horizon-green))] text-black font-medium py-3 px-4 rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>

      </main>

      {/* Comments Section */}
      <CommentSystem 
        articleSlug={article.slug}
        articleId={article.id}
        articleTitle={article.title}
      />

      {/* Footer */}
      <div 
        className={`transition-opacity duration-500 ${
          isFooterVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Footer />
      </div>
    </div>
  );
}
