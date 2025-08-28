'use client';

import { useState, useEffect } from 'react';
import { localStorageDB } from '@/data/localStorageDB';
import UnifiedCard from '@/components/UnifiedCard';
import ActionButtons from '@/components/landing/ActionButtons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UI_CONSTANTS } from '@/constants/ui';





export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastKeyPress, setLastKeyPress] = useState(0);
  const [protocolSummaries, setProtocolSummaries] = useState<any[]>([]);

  const handleNextCard = () => {
    if (isTransitioning || protocolSummaries.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % protocolSummaries.length);
      setIsTransitioning(false);
    }, UI_CONSTANTS.CAROUSEL_TRANSITION_DURATION);
  };

  const handlePreviousCard = () => {
    if (isTransitioning || protocolSummaries.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + protocolSummaries.length) % protocolSummaries.length);
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
    } else if (e.key === 'Escape') {
      // Reset focus states when Escape is pressed
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
    }
  };

  // Load protocol summaries from localStorageDB
  useEffect(() => {
    const summaries = localStorageDB.getProtocolSummaries();
    setProtocolSummaries(summaries);
  }, []);

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
      
             {/* Content with overlay - Centered on screen */}
       <div className="relative z-10 w-full py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8 sm:mt-[7.5vh]">
                 {/* Hero Section - Mobile responsive typography */}
         <section className="space-y-4 text-center px-4 sm:px-6 md:px-8">
           <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-medium drop-shadow-lg leading-tight">
             <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient">
               Clarity
             </span>
             <span className="text-white font-light ml-2 sm:ml-3 md:ml-4">for Crypto Research</span>
           </h1>
           <p className="text-base sm:text-lg max-w-3xl mx-auto text-white/90 drop-shadow-md px-4 sm:px-0">
             Leveraging AI insights and research to drive quality education investment decisions.
           </p>
         </section>

        {/* Product Cards Carousel Section */}
        {protocolSummaries.length > 0 && (
        <section className="space-y-3 w-full px-4 sm:px-6 md:px-8">
          {/* Mobile: Single Card with Simple Navigation */}
          <div className="block md:hidden">
            <div className="w-full flex justify-center px-4">
              <div className="w-full max-w-lg mx-auto">
                {/* Single Card - Perfectly Centered with Swipe Support */}
                <div 
                  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex justify-center touch-pan-y"
                  onClick={() => window.location.href = `/article/${protocolSummaries[currentIndex]?.slug}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${protocolSummaries[currentIndex]?.name}`}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    e.currentTarget.dataset.touchStartX = touch.clientX.toString();
                  }}
                  onTouchEnd={(e) => {
                    const touchStartX = parseInt(e.currentTarget.dataset.touchStartX || '0');
                    const touchEndX = e.changedTouches[0].clientX;
                    const diffX = touchStartX - touchEndX;
                    const minSwipeDistance = 50;
                    
                    if (Math.abs(diffX) > minSwipeDistance) {
                      if (diffX > 0) {
                        // Swiped left - next card
                        handleNextCard();
                      } else {
                        // Swiped right - previous card
                        handlePreviousCard();
                      }
                    }
                  }}
                >
                  <UnifiedCard protocol={protocolSummaries[currentIndex]} variant="product" isCenter={true} />
                </div>
                
                {/* Simple Arrow Navigation Below */}
                <div className="flex justify-between items-center mt-2 w-full">
                  <button 
                    className="p-2 transition-all duration-300 disabled:opacity-30 hover:opacity-100 active:scale-125"
                    onClick={handlePreviousCard}
                    disabled={isTransitioning}
                    aria-label="Previous protocol"
                  >
                    <img src="/LeftArrowLanding.png" alt="Previous" className="w-6 h-6 brightness-0 invert" />
                  </button>
                  
                  <button 
                    className="p-2 transition-all duration-300 disabled:opacity-30 hover:opacity-100 active:scale-125"
                    onClick={handleNextCard}
                    disabled={isTransitioning}
                    aria-label="Next protocol"
                  >
                    <img src="/RightArrowLanding.png" alt="Next" className="w-6 h-6 brightness-0 invert" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <div 
              className="relative flex items-center justify-center w-full"
              role="region"
              aria-label="Protocol showcase carousel"
            >
              {/* Left Arrow */}
              <button 
                className="absolute z-30 opacity-50 hover:opacity-100 focus:opacity-100 transition-all duration-300 disabled:opacity-30 hover:scale-110 focus:outline-none outline-none"
                style={{ left: UI_CONSTANTS.CAROUSEL_LEFT_ARROW_POSITION }}
                onClick={handlePreviousCard}
                disabled={isTransitioning}
                aria-label="View previous protocol"
              >
                <img src="/LeftArrowLanding.png" alt="Previous" className="w-12 h-12" />
              </button>

              {/* Right Arrow */}
              <button 
                className="absolute z-30 opacity-50 hover:opacity-100 focus:opacity-100 transition-all duration-300 disabled:opacity-30 hover:scale-110 focus:outline-none outline-none"
                style={{ right: UI_CONSTANTS.CAROUSEL_RIGHT_ARROW_POSITION }}
                onClick={handleNextCard}
                disabled={isTransitioning}
                aria-label="View next protocol"
              >
                <img src="/RightArrowLanding.png" alt="Next" className="w-12 h-12" />
              </button>

              {/* Carousel Cards Container - Extended padding to accommodate glow */}
              <div className="flex items-center justify-center gap-12 w-full px-8 py-8">
                {/* Left Card */}
                <div 
                  className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-60'} cursor-pointer hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
                  onClick={() => window.location.href = `/article/${protocolSummaries[(currentIndex - 1 + protocolSummaries.length) % protocolSummaries.length]?.slug}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = `/article/${protocolSummaries[(currentIndex - 1 + protocolSummaries.length) % protocolSummaries.length]?.slug}`;
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${protocolSummaries[(currentIndex - 1 + protocolSummaries.length) % protocolSummaries.length]?.name}`}
                >
                  <UnifiedCard protocol={protocolSummaries[(currentIndex - 1 + protocolSummaries.length) % protocolSummaries.length]} variant="product" />
                </div>
                
                {/* Center Card (Primary) */}
                <div 
                  className="transition-all duration-500 ease-in-out hover:scale-105 motion-safe:hover:scale-105 motion-reduce:hover:scale-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${protocolSummaries[currentIndex]?.name}`}
                  onClick={() => window.location.href = `/article/${protocolSummaries[currentIndex]?.slug}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = `/article/${protocolSummaries[currentIndex]?.slug}`;
                    }
                  }}
                >
                  <UnifiedCard protocol={protocolSummaries[currentIndex]} variant="product" isCenter={true} />
                </div>
                
                {/* Right Card */}
                <div 
                  className={`transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-60'} cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
                  onClick={() => window.location.href = `/article/${protocolSummaries[(currentIndex + 1) % protocolSummaries.length]?.slug}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = `/article/${protocolSummaries[(currentIndex + 1) % protocolSummaries.length]?.slug}`;
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${protocolSummaries[(currentIndex + 1) % protocolSummaries.length]?.name}`}
                >
                  <UnifiedCard protocol={protocolSummaries[(currentIndex + 1) % protocolSummaries.length]} variant="product" />
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

                 {/* Interactive glass buttons beneath the product cards - Mobile responsive spacing */}
         <section className="mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6 md:px-8">
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
