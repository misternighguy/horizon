'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Article, ReadingLevel } from '@/types';

interface ArticleSidebarProps {
  article: Article;
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  readingStyle: ReadingLevel;
  getStatusClass?: (status: string) => string;
  onStickyChange?: (isSticky: boolean) => void;
}

export default function ArticleSidebar({ 
  article, 
  activeSection, 
  scrollToSection, 
  readingStyle,
  getStatusClass = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'neutral': return 'text-yellow-400';
      case 'bad': return 'text-red-400';
      default: return 'text-white/60';
    }
  },
  onStickyChange
}: ArticleSidebarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        
        // Become sticky when "On This Page" is 30px from top of screen
        const shouldBeSticky = rect.top <= 30;
        setIsSticky(shouldBeSticky);
        
        // Dynamic collapse logic: collapse when near comments section
        const commentsSection = document.querySelector('[data-section="comments"]') || 
                               Array.from(document.querySelectorAll('h2, h3')).find(el => 
                                 el.textContent?.includes('Comments') || 
                                 el.textContent?.includes('Community Discussion')
                               );
        
        if (commentsSection) {
          const commentsRect = commentsSection.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Calculate distance from top of page to comments section
          const distanceToComments = window.pageYOffset + commentsRect.top;
          
          // Collapse threshold: comments position minus 75% of viewport height
          const collapseThreshold = distanceToComments - (viewportHeight * 0.75);
          
          const shouldCollapse = scrollY > collapseThreshold;
          setIsCollapsed(shouldCollapse);
        } else {
          // Fallback: collapse after 1500px if comments section not found
          const shouldCollapse = scrollY > 1500;
          setIsCollapsed(shouldCollapse);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Call the callback when sticky state changes
  useEffect(() => {
    if (onStickyChange) {
      onStickyChange(isSticky);
    }
  }, [isSticky, onStickyChange]);

  return (
    <div className="lg:col-span-1" ref={sidebarRef}>
      {isCollapsed ? (
        // Collapsed state - thin low opacity green bar
        <div className={`${isSticky ? 'fixed top-8' : 'relative'} transition-all duration-300 ease-in-out`} style={{ 
          ...(isSticky && { 
            right: '2rem', 
            width: '2px',
            height: '100px'
          })
        }}>
          <div className="w-full h-full bg-[rgb(var(--color-horizon-green))] opacity-30 rounded-full"></div>
        </div>
      ) : (
        // Full sidebar state
        <div className={`${isSticky ? 'fixed top-8' : 'relative'} space-y-8 overflow-y-auto pb-8 scrollbar-hide transition-all duration-300 ease-in-out`} style={{ 
          ...(isSticky && { 
            right: '2rem', 
            width: '20rem',
            maxHeight: 'calc(100vh - 4rem)'
          })
        }}>
          {/* Table of Contents */}
          <div className="p-6 relative">
            <h3 className="text-lg font-medium text-white mb-4">On This Page</h3>
            <nav className="space-y-2 relative">
              {/* Left border line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20"></div>
              
              {/* Dynamic table of contents based on reading level */}
              {(() => {
                const currentContent = article.content?.[readingStyle]?.sections || [];
                
                // If dynamic content exists, use it
                if (currentContent.length > 0) {
                  return currentContent
                    .sort((a, b) => a.order - b.order)
                    .map((section) => ({
                      id: section.id || `section-${section.order}`,
                      label: section.title
                    }));
                }
                
                // Fall back to static sections
                return [
                  { id: 'abstract', label: 'Abstract' },
                  { id: 'architecture', label: 'Product Architecture' },
                  { id: 'mechanics', label: 'Core Mechanics' },
                  { id: 'problem-users-value', label: 'Problem, Users & Value' },
                  { id: 'team', label: 'Team' },
                  { id: 'timeline', label: 'Timeline' },
                  { id: 'links', label: 'Official Links' },
                  { id: 'ecosystem', label: 'Ecosystem' },
                  { id: 'credentials', label: 'Credentials' },
                  { id: 'comments', label: 'Comments' }
                ];
              })().map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-sm transition-colors pl-4 relative ${
                    activeSection === item.id
                      ? 'text-[rgb(var(--color-horizon-green))]'
                      : 'text-white/60 hover:text-white'
                  }`}
                  onMouseEnter={(e) => {
                    // Add hover indicator
                    const indicator = e.currentTarget.querySelector('.hover-indicator');
                    if (indicator) {
                      indicator.classList.remove('hidden');
                    }
                  }}
                  onMouseLeave={(e) => {
                    // Remove hover indicator if not active
                    const indicator = e.currentTarget.querySelector('.hover-indicator');
                    if (indicator && activeSection !== item.id) {
                      indicator.classList.add('hidden');
                    }
                  }}
                >
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[rgb(var(--color-horizon-green))] rounded-r"></div>
                  )}
                  {/* Hover indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-white/40 rounded-r hover-indicator ${activeSection === item.id ? 'hidden' : ''}`}></div>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Radar Rating */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
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
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
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

          {/* Tokenomics Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Tokenomics</h3>
            <div className="space-y-3">
              {article.tokenomics.map((item, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className={`text-sm ${getStatusClass(item.status)}`}>
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
          <div className="bg-gradient-to-br from-[rgb(var(--color-horizon-green))]/20 to-[rgb(var(--color-horizon-green))]/10 border border-[rgb(var(--color-horizon-green))]/30 rounded-xl p-6">
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
      )}
    </div>
  );
}
