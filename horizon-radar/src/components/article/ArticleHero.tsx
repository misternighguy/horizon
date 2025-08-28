'use client';

import { useRef, useState, useEffect } from 'react';
import { Article, ReadingLevel } from '@/types';
import WatchlistButton from '@/components/WatchlistButton';

interface ArticleHeroProps {
  article: Article;
  readingStyle: ReadingLevel;
  setReadingStyle: (level: ReadingLevel) => void;
  parallaxOffset: number;
}

export default function ArticleHero({ 
  article, 
  readingStyle, 
  setReadingStyle, 
  parallaxOffset 
}: ArticleHeroProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [showReadingDropdown, setShowReadingDropdown] = useState(false);
  const [showVideoDropdown, setShowVideoDropdown] = useState(false);
  const readingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (readingTimeoutRef.current) clearTimeout(readingTimeoutRef.current);
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    };
  }, []);

  const handleReadingMouseEnter = () => {
    if (readingTimeoutRef.current) clearTimeout(readingTimeoutRef.current);
    setShowReadingDropdown(true);
  };

  const handleReadingMouseLeave = () => {
    readingTimeoutRef.current = setTimeout(() => setShowReadingDropdown(false), 700);
  };

  const handleVideoMouseEnter = () => {
    if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    setShowVideoDropdown(true);
  };

  const handleVideoMouseLeave = () => {
    videoTimeoutRef.current = setTimeout(() => setShowVideoDropdown(false), 700);
  };

  return (
    <section className="relative pt-4 sm:pt-12 md:pt-14 lg:pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title and Subtitle */}
        <div className="mb-6">
          <h1 className="text-6xl font-light mb-4">
            <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
              {article.title}
            </span>
            <span className="text-white font-medium ml-4">({article.ticker})</span>
          </h1>
          <p className="text-white/80 text-lg max-w-4xl leading-relaxed mb-4">
            {article.subtitle}
          </p>
          
          {/* Classification and Location - Single line below subtitle */}
          <div className="flex items-center space-x-6 text-sm text-white/60">
            <span>Classification: {article.classification}</span>
            <span>Located on: {article.location}</span>
          </div>
        </div>

        {/* Reading Style and Video Buttons - Below classification/location */}
        <div className="flex items-center space-x-4 mb-8">
            {/* Reading Style Pills */}
            <div 
              className="relative"
              onMouseEnter={handleReadingMouseEnter}
              onMouseLeave={handleReadingMouseLeave}
            >
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 h-10">
                <span className="text-white/80 text-sm">Reading Style:</span>
                <span className="text-white/80 text-sm">{
                  readingStyle === 'novice' ? 'Novice' :
                  readingStyle === 'technical' ? 'Technical' :
                  readingStyle === 'analyst' ? 'Analyst' :
                  'Technical'
                }</span>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Expanded Options */}
              <div className={`absolute right-0 top-full mt-2 bg-black border border-white/20 rounded-xl p-2 transition-all duration-300 z-10 min-w-[200px] ${
                showReadingDropdown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}>
                {(['novice', 'technical', 'analyst'] as ReadingLevel[]).map((level) => {
                  const getDisplayName = (level: ReadingLevel) => {
                    switch (level) {
                      case 'novice': return 'Novice';
                      case 'technical': return 'Technical';
                      case 'analyst': return 'Analyst';
                      default: return 'Technical';
                    }
                  };
                  
                  return (
                    <button
                      key={level}
                      onClick={() => setReadingStyle(level)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        readingStyle === level
                          ? 'bg-[rgb(var(--color-horizon-green))] text-black'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {getDisplayName(level)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Watch Video Button */}
            <div 
              className="relative"
              onMouseEnter={handleVideoMouseEnter}
              onMouseLeave={handleVideoMouseLeave}
            >
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 h-10">
                <span className="text-white/80 text-sm">Watch Video instead?</span>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Expanded Options */}
              <div className={`absolute right-0 top-full mt-2 bg-black border border-white/20 rounded-xl p-2 transition-all duration-300 z-10 min-w-[200px] ${
                showVideoDropdown ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}>
                <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors">
                  Video Overview
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors">
                  Technical Deep Dive
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors">
                  Interview with Team
                </button>
              </div>
            </div>

            {/* Watchlist Button */}
            <div className="h-10">
              <WatchlistButton articleId={article.id} />
            </div>
          </div>

        {/* Hero Image */}
        <div 
          ref={imageRef}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ 
            transform: `translateY(${parallaxOffset}px)`,
            aspectRatio: '3/1',
            maxHeight: '500px'
          }}
        >
          <img
            src={article.featuredImage || '/images/GlowBanner.png'}
            alt={`${article.title} featured image`}
            className="w-full h-full object-cover"
            onError={(e) => console.error('Image failed to load:', (e.target as HTMLImageElement).src)}
            onLoad={() => console.log('Image loaded successfully:', article.featuredImage || '/images/GlowBanner.png')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
