'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { localStorageDB } from '@/data/localStorageDB';
import { ResearchCard } from '@/types';

export default function ResearchPage() {
  const [recentlyPublished, setRecentlyPublished] = useState<ResearchCard[]>([]);
  const [mostRead, setMostRead] = useState<ResearchCard[]>([]);
  const [trending, setTrending] = useState<ResearchCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorageDB) {
      setRecentlyPublished(localStorageDB.getResearchCardsByCategory('recently-published') || []);
      setMostRead(localStorageDB.getResearchCardsByCategory('most-read') || []);
      setTrending(localStorageDB.getResearchCardsByCategory('trending') || []);
    }
    setIsLoading(false);
  }, []);

  // Filter functions for each section
  const filterCards = (cards: ResearchCard[], query: string) => {
    console.log('Filtering cards:', { cards: cards?.length, query });
    if (!query.trim()) return cards || [];
    
    const filtered = cards?.filter(card => 
      card.title.toLowerCase().includes(query.toLowerCase()) ||
      card.description.toLowerCase().includes(query.toLowerCase())
    ) || [];
    
    console.log('Filtered results:', filtered.length);
    return filtered;
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full">
        <div className="fixed inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="fixed inset-0 z-0 bg-black/20" />
        <div className="relative z-20">
          <Header />
        </div>
        <div className="relative z-10 w-full py-10 flex flex-col min-h-screen">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-horizon-green))]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat bg-fixed" />
      <div className="fixed inset-0 z-0 bg-black/20" />
      
      <div className="relative z-20">
        <Header />
      </div>
      
      <div className="relative z-10 w-full py-10 flex flex-col min-h-screen">
        {/* Page Title and Search */}
        <section className="text-center space-y-8 mb-12">
          <h1 className="text-6xl font-medium drop-shadow-lg">
            <span className="text-white font-light">Research</span>
            <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient">Scope</span>
          </h1>
          
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Search all research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))]"
              />
            </div>
          </div>
        </section>

        {/* Research Categories */}
        <div className="max-w-7xl mx-auto px-4 grid gap-8 md:grid-cols-3 mb-24">
          {/* Recently Published */}
          <div className="glass-container p-6 min-h-[800px]">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-[rgb(var(--color-horizon-green))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Recently Published</h2>
            </div>
            <p className="text-white/70 text-sm mb-4">Discover our more recent analyses.</p>
            
            <div className="space-y-3 max-h-[800px] overflow-y-auto">
              {filterCards(recentlyPublished, searchQuery).length > 0 ? (
                filterCards(recentlyPublished, searchQuery).map((card) => (
                  <Link key={card.id} href={`/article/${card.slug}`} className="block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden hover:bg-white/20 transition-colors">
                    {/* Banner Image */}
                    <div className="relative w-full h-24 bg-gray-100">
                      {card.bannerImage ? (
                        <img
                          src={card.bannerImage}
                          alt={`Banner for ${card.title}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          No Banner
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm mb-1">{card.title}</h3>
                      <p className="text-white/70 text-xs">{card.description}</p>
                    </div>
                  </Link>
                ))
              ) : null}
            </div>
          </div>

          {/* Most Read */}
          <div className="glass-container p-6 min-h-[800px]">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-[rgb(var(--color-horizon-green))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Most Read</h2>
            </div>
            <p className="text-white/70 text-sm mb-4">Popular research that resonates with our community.</p>
            
            <div className="space-y-3 max-h-[800px] overflow-y-auto">
              {filterCards(mostRead, searchQuery).length > 0 ? (
                filterCards(mostRead, searchQuery).map((card) => (
                  <Link key={card.id} href={`/article/${card.slug}`} className="block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden hover:bg-white/20 transition-colors">
                    {/* Banner Image */}
                    <div className="relative w-full h-24 bg-gray-100">
                      {card.bannerImage ? (
                        <img
                          src={card.bannerImage}
                          alt={`Banner for ${card.title}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          No Banner
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm mb-1">{card.title}</h3>
                      <p className="text-white/70 text-xs">{card.description}</p>
                    </div>
                  </Link>
                ))
              ) : null}
            </div>
          </div>

          {/* Trending */}
          <div className="glass-container p-6 min-h-[800px]">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-[rgb(var(--color-horizon-green))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Trending</h2>
            </div>
            <p className="text-white/70 text-sm mb-4">Hot topics and emerging trends in crypto.</p>
            
            <div className="space-y-3 max-h-[800px] overflow-y-auto">
              {filterCards(trending, searchQuery).length > 0 ? (
                filterCards(trending, searchQuery).map((card) => (
                  <Link key={card.id} href={`/article/${card.slug}`} className="block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden hover:bg-white/20 transition-colors">
                    {/* Banner Image */}
                    <div className="relative w-full h-24 bg-gray-100">
                      {card.bannerImage ? (
                        <img
                          src={card.bannerImage}
                          alt={`Banner for ${card.title}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          No Banner
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm mb-1">{card.title}</h3>
                      <p className="text-white/70 text-xs">{card.description}</p>
                    </div>
                  </Link>
                ))
              ) : null}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with higher z-index to appear above research cards */}
      <div className="relative z-30">
        <Footer />
      </div>
    </div>
  );
} 