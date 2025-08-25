'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResearchColumn from '@/components/ResearchColumn';
import { localStorageDB } from '@/data/localStorageDB';
import { ResearchCard } from '@/types';

export default function ResearchPage() {
  const [recentlyPublished, setRecentlyPublished] = useState<ResearchCard[]>([]);
  const [mostRead, setMostRead] = useState<ResearchCard[]>([]);
  const [trending, setTrending] = useState<ResearchCard[]>([]);

  useEffect(() => {
    // Load research cards from database
    const recentCards = localStorageDB.getResearchCardsByCategory('recently-published');
    const popularCards = localStorageDB.getResearchCardsByCategory('most-read');
    const trendingCards = localStorageDB.getResearchCardsByCategory('trending');
    
    setRecentlyPublished(recentCards);
    setMostRead(popularCards);
    setTrending(trendingCards);
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat bg-fixed"
      />
      
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-black/20" />
      
      {/* Header positioned on top of background */}
      <div className="relative z-20">
        <Header />
      </div>
      
      {/* Content with overlay */}
      <div className="relative z-10 w-full py-10 space-y-8">
        {/* Page Title */}
        <section className="text-center">
          <h1 className="text-6xl font-medium text-[rgb(var(--color-horizon-green))] drop-shadow-lg">
            Research
          </h1>
        </section>

        {/* Three Column Layout */}
        <section className="w-full px-8 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recently Published Column */}
            <ResearchColumn 
              title="Recently Published"
              subtitle="Discover our most recent analysis."
              icon="clock"
              articles={recentlyPublished.map(card => ({
                id: card.id,
                title: card.title,
                description: card.description,
                growthScore: card.growthScore,
                opportunityScore: card.opportunityScore,
                slug: card.slug
              }))}
            />

            {/* Most Read Column */}
            <ResearchColumn 
              title="Most Read"
              subtitle="Discover our most recent analysis."
              icon="bookmark"
              articles={mostRead.map(card => ({
                id: card.id,
                title: card.title,
                description: card.description,
                growthScore: card.growthScore,
                opportunityScore: card.opportunityScore,
                slug: card.slug
              }))}
            />

            {/* Trending Column */}
            <ResearchColumn 
              title="Trending"
              subtitle="Discover our most recent analysis."
              icon="target"
              articles={trending.map(card => ({
                id: card.id,
                title: card.title,
                description: card.description,
                growthScore: card.growthScore,
                opportunityScore: card.opportunityScore,
                slug: card.slug
              }))}
            />
          </div>
        </section>
      </div>
      
      {/* Footer positioned on top of background */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
} 