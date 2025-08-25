'use client';

import { useState, useEffect } from 'react';
import { mockSummaries } from '@/data/mock';
import UnifiedCard from '@/components/UnifiedCard';
import ActionButtons from '@/components/landing/ActionButtons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UI_CONSTANTS } from '@/constants/ui';





export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastKeyPress, setLastKeyPress] = useState(0);

  const handleNextCard = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockSummaries.length);
      setIsTransitioning(false);
    }, UI_CONSTANTS.CAROUSEL_TRANSITION_DURATION);
  };

  const handlePreviousCard = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + mockSummaries.length) % mockSummaries.length);
      setIsTransitioning(false);
    }, UI_CONSTANTS.CAROUSEL_TRANSITION_DURATION);
  };

  // Keyboard navigation with debouncing
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle arrow keys when not in input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
      return;
    }

    const now = Date.now();
    if (now - lastKeyPress < 250) return; // 250ms debounce

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextCard();
      setLastKeyPress(now);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePreviousCard();
      setLastKeyPress(now);
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastKeyPress]);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat"
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-black/20" />
      
      {/* Header positioned on top of background */}
      <div className="relative z-20">
        <Header />
      </div>
      
      {/* Content with overlay */}
      <div className="relative z-10 w-full py-10 space-y-8">
        <section className="space-y-4 text-center">
          <h1 className="text-6xl font-medium drop-shadow-lg">
            <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient">
              Clarity
            </span>
            <span className="text-white font-light ml-4">for Crypto Research</span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-white/90 drop-shadow-md">
            Leveraging AI insights and research to drive quality education investment decisions.
          </p>
        </section>

        {/* Product Cards Carousel Section */}
        <section className="space-y-3 w-full">
          <div 
            className="relative flex items-center justify-center w-screen"
            role="region"
            aria-label="Protocol showcase carousel"
          >
            {/* Left Arrow */}
            <button 
              className="absolute z-20 opacity-50 hover:opacity-100 transition-all duration-300 disabled:opacity-30 motion-safe:hover:scale-125 motion-reduce:hover:scale-100 disabled:hover:scale-100"
              style={{ left: UI_CONSTANTS.CAROUSEL_LEFT_ARROW_POSITION }}
              onClick={handlePreviousCard}
              disabled={isTransitioning}
              aria-label="View previous protocol"
            >
              <img src="/LeftArrowLanding.png" alt="Previous" className="w-12 h-12" />
            </button>

            {/* Right Arrow */}
            <button 
              className="absolute z-20 opacity-50 hover:opacity-100 transition-all duration-300 disabled:opacity-30 motion-safe:hover:scale-125 motion-reduce:hover:scale-100 disabled:hover:scale-100"
              style={{ right: UI_CONSTANTS.CAROUSEL_RIGHT_ARROW_POSITION }}
              onClick={handleNextCard}
              disabled={isTransitioning}
              aria-label="View next protocol"
            >
              <img src="/RightArrowLanding.png" alt="Next" className="w-12 h-12" />
            </button>

            {/* Carousel Cards Container - Extended padding to accommodate glow */}
            <div className="flex items-center justify-center gap-12 w-screen px-8 py-8">
              {/* Left Card */}
              <div 
                className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-60'} cursor-pointer hover:opacity-80`}
                onClick={() => window.location.href = `/research/${mockSummaries[(currentIndex - 1 + mockSummaries.length) % mockSummaries.length].slug}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = `/research/${mockSummaries[(currentIndex - 1 + mockSummaries.length) % mockSummaries.length].slug}`;
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${mockSummaries[(currentIndex - 1 + mockSummaries.length) % mockSummaries.length].name}`}
              >
                <UnifiedCard protocol={mockSummaries[(currentIndex - 1 + mockSummaries.length) % mockSummaries.length]} variant="product" />
              </div>
              
              {/* Center Card (Primary) */}
              <div 
                className="transition-all duration-500 ease-in-out hover:scale-110 motion-safe:hover:scale-110 motion-reduce:hover:scale-100 cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`View details for ${mockSummaries[currentIndex].name}`}
                onClick={() => window.location.href = `/research/${mockSummaries[currentIndex].slug}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = `/research/${mockSummaries[currentIndex].slug}`;
                  }
                }}
              >
                <UnifiedCard protocol={mockSummaries[currentIndex]} variant="product" isCenter={true} />
              </div>
              
              {/* Right Card */}
              <div 
                className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-60'} cursor-pointer hover:opacity-80`}
                onClick={() => window.location.href = `/research/${mockSummaries[(currentIndex + 1) % mockSummaries.length].slug}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = `/research/${mockSummaries[(currentIndex + 1) % mockSummaries.length].slug}`;
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${mockSummaries[(currentIndex + 1) % mockSummaries.length].name}`}
              >
                <UnifiedCard protocol={mockSummaries[(currentIndex + 1) % mockSummaries.length]} variant="product" />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive glass buttons beneath the product cards */}
        <section className="mt-16">
          <ActionButtons />
        </section>
      </div>
      
      {/* Footer positioned on top of background */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
