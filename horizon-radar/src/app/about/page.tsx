'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Icons } from '@/components/ui/Icons';

export default function AboutPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [footerOpacity, setFooterOpacity] = useState(1);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollThreshold = useRef(0);

  // Hide scrollbar for the entire page
  useEffect(() => {
    document.documentElement.classList.add('scrollbar-hide');
    document.body.classList.add('scrollbar-hide');
    
    return () => {
      document.documentElement.classList.remove('scrollbar-hide');
      document.body.classList.remove('scrollbar-hide');
    };
  }, []);

  // Handle wheel scrolling with smooth section navigation
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let wheelTimeout: NodeJS.Timeout;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      // Clear any existing wheel timeout
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }
      
      // Accumulate scroll delta for threshold-based navigation
      scrollThreshold.current += e.deltaY;
      
      // Calculate how many sections to advance based on scroll magnitude
      const absDelta = Math.abs(scrollThreshold.current);
      let sectionsToAdvance = 1; // Default: advance one section
      
      // Thresholds for different scroll behaviors:
      // - Small scroll (50-150px): advance 1 section
      // - Medium scroll (150-300px): advance 2 sections  
      // - Large scroll (300px+): advance 3 sections
      if (absDelta >= 300) {
        sectionsToAdvance = 3;
      } else if (absDelta >= 150) {
        sectionsToAdvance = 2;
      } else if (absDelta >= 50) {
        sectionsToAdvance = 1;
      } else {
        // Below threshold, don't advance
        return;
      }
      
      const direction = scrollThreshold.current > 0 ? 1 : -1;
      const nextSection = Math.max(0, Math.min(6, currentSection + (direction * sectionsToAdvance)));
      
      if (nextSection !== currentSection) {
        setIsScrolling(true);
        setCurrentSection(nextSection);
        
        // Smooth scroll to section with consistent timing
        sectionRefs.current[nextSection]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Reset scrolling flag after animation completes
        scrollTimeout = setTimeout(() => setIsScrolling(false), 800);
      }
      
      // Reset threshold after section change
      scrollThreshold.current = 0;
      
      // Reset threshold after a delay if no more scrolling
      wheelTimeout = setTimeout(() => {
        scrollThreshold.current = 0;
      }, 200);
    };

    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextSection = Math.min(6, currentSection + 1);
        if (nextSection !== currentSection) {
          setIsScrolling(true);
          setCurrentSection(nextSection);
          sectionRefs.current[nextSection]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          setTimeout(() => setIsScrolling(false), 800);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevSection = Math.max(0, currentSection - 1);
        if (prevSection !== currentSection) {
          setIsScrolling(true);
          setCurrentSection(prevSection);
          sectionRefs.current[prevSection]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          setTimeout(() => setIsScrolling(false), 800);
        }
      }
    };

    const container = sectionsRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(scrollTimeout);
      clearTimeout(wheelTimeout);
    };
  }, [currentSection, isScrolling]);

  // Auto-scroll to current section on mount
  useEffect(() => {
    if (sectionRefs.current[currentSection]) {
      sectionRefs.current[currentSection]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentSection]);

  // Control footer visibility based on current section
  useEffect(() => {
    if (currentSection === 0 || currentSection === 4) {
      // Show footer on first and last sections
      setFooterOpacity(1);
    } else {
      // Hide footer on middle sections
      setFooterOpacity(0);
    }
  }, [currentSection]);

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsVisible) {
            setStatsVisible(true);
            animateStats();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  // Animate stats counting up
  const animateStats = () => {
    const targetStats = {
      users: 10000,
      portfolio: 50,
      accuracy: 95
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      // This function is no longer used, but keeping it for now as per instructions
      // setAnimatedStats({
      //   users: Math.floor(targetStats.users * easeOutQuart),
      //   portfolio: Math.floor(targetStats.portfolio * easeOutQuart),
      //   accuracy: Math.floor(targetStats.accuracy * easeOutQuart)
      // });
    }, stepDuration);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background with animated particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => {
            // Deterministic positioning and animation based on index
            const left = ((i * 7) % 100) + (i % 3) * 15;
            const top = ((i * 11) % 100) + (i % 5) * 12;
            const delay = (i * 0.3) % 5;
            const duration = 4 + (i % 6);
            
            return (
              <div
                key={i}
                className={`absolute rounded-full animate-float ${
                  i % 3 === 0 ? 'w-2 h-2 bg-purple-400/30' :
                  i % 3 === 1 ? 'w-1 h-1 bg-blue-400/40' :
                  'w-0.5 h-0.5 bg-white/50'
                }`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`
                }}
              />
            );
          })}
        </div>
        
        {/* Animated grid lines with vertical gradient opacity */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.5) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.5) 100%)'
          }} />
        </div>
        
        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-3/4 left-3/4 w-24 h-24 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Return Home Button */}
      <div className="fixed top-8 left-8 z-50">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white text-sm font-medium transition-all duration-300 hover:bg-white/5 rounded-full border border-white/10 hover:border-white/20 backdrop-blur-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Return Home
        </Link>
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Vertical Navigation Pill - Right Side - Hidden on Mobile */}
      <div className="hidden min-[900px]:block fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1.5 shadow-lg">
          {/* Up Arrow */}
          <button
            onClick={() => {
              const prevSection = Math.max(0, currentSection - 1);
              setCurrentSection(prevSection);
              setIsScrolling(true);
              setTimeout(() => setIsScrolling(false), 800);
            }}
            className={`p-2 rounded-full transition-all duration-300 ${
              currentSection === 0 
                ? 'text-white/30' 
                : 'text-white hover:text-[rgb(var(--color-horizon-green))] hover:bg-white/20'
            }`}
            aria-label="Previous section"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Section Indicator */}
          <div className="flex flex-col items-center gap-1 my-1.5">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSection(index);
                  setIsScrolling(true);
                  setTimeout(() => setIsScrolling(false), 800);
                }}
                className={`w-2 rounded-full transition-all duration-300 ${
                  index === currentSection
                    ? 'h-3 bg-[rgb(var(--color-horizon-green))]'
                    : 'h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to section ${index + 1}`}
              />
            ))}
          </div>

          {/* Down Arrow */}
          <button
            onClick={() => {
              const nextSection = Math.min(4, currentSection + 1);
              setCurrentSection(nextSection);
              setIsScrolling(true);
              setTimeout(() => setIsScrolling(false), 800);
            }}
            className={`p-2 rounded-full transition-all duration-300 ${
              currentSection === 4 
                ? 'text-white/30' 
                : 'text-white hover:text-[rgb(var(--color-horizon-green))] hover:bg-white/20'
            }`}
            aria-label="Next section"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content sections */}
      <div ref={sectionsRef} className="relative z-10">
        {/* Section 1: Hero */}
        <div 
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          <div className="text-center max-w-6xl px-8 relative z-10">
            <div className="animate-fade-in-up">
              {/* Horizon Logo */}
              <div className="mb-8">
                <Image src="/logo.png" alt="Horizon Radar" width={360} height={120} className="mx-auto" />
              </div>
              
              <h1 className="text-6xl mb-8 font-inter">
                <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient font-medium">
                  Clarity
                </span>
                <span className="text-white font-light ml-4">for Crypto Research</span>
              </h1>
              
              <p className="text-2xl text-black mb-16 max-w-4xl mx-auto leading-relaxed font-inter">
                Scouting the horizon of formidable blockchain technology for Web3 savants.
              </p>
              
              {/* LEARN MORE CTA Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setCurrentSection(1);
                    setIsScrolling(true);
                    setTimeout(() => setIsScrolling(false), 800);
                  }}
                  className="group inline-flex items-center gap-4 px-8 py-4 text-lg font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white font-inter hover:bg-white/30 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <Icons.ArrowDown className="w-5 h-5" />
                  <span>LEARN MORE</span>
                  <Icons.ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rotate-45 animate-float-slow" />
            <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-purple-400/30 rounded-full animate-spin-slow" />
            <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-12 h-12 border border-cyan-400/20 rotate-12 animate-float-slow" style={{ animationDelay: '3s' }} />
          </div>
          

        </div>

        {/* Section 2: The Problem */}
        <div 
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          <div className="max-w-6xl px-8 text-center">
            <div className="animate-fade-in-up">
              <h2 className="text-6xl mb-8 font-inter">
                <span className="text-white font-light">Crypto Research is </span>
                <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient font-medium">
                  fractionalized
                </span>
              </h2>
              
              <p className="text-2xl text-black mb-16 max-w-4xl mx-auto leading-relaxed font-inter">
                The issue with Web3 Research: the whole story is never in one place.
              </p>
              
              {/* Full Story Graphic */}
              <div className="flex justify-center mb-12">
                <Image 
                  src="/images/FullStoryGraphic.png" 
                  alt="Full Story Graphic - Web3 Research Fragmentation" 
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              
              {/* OUR SOLUTION CTA Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setCurrentSection(2);
                    setIsScrolling(true);
                    setTimeout(() => setIsScrolling(false), 800);
                  }}
                  className="group inline-flex items-center gap-4 px-8 py-4 text-lg font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white font-inter hover:bg-white/30 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <Icons.ArrowDown className="w-5 h-5" />
                  <span>OUR SOLUTION</span>
                  <Icons.ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: The Solution */}
        <div 
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          <div className="max-w-6xl px-8 text-center">
            <div className="animate-fade-in-up">
              <h2 className="text-6xl mb-8 font-inter">
                <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient font-medium">
                  Stitching
                </span>
                <span className="text-white font-light ml-4">the story together</span>
              </h2>
              
              <p className="text-2xl text-black mb-16 max-w-4xl mx-auto leading-relaxed font-inter">
                while amplifying its depth and eliminating its bias with AI agents.
              </p>
              
              {/* Stiching Story Graphic */}
              <div className="flex justify-center mb-16">
                <Image 
                  src="/images/StichingStory.png" 
                  alt="Stiching Story - AI Agents Amplifying Research Depth" 
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
              
              {/* HOW IT WORKS CTA Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setCurrentSection(3);
                    setIsScrolling(true);
                    setTimeout(() => setIsScrolling(false), 800);
                  }}
                  className="group inline-flex items-center gap-4 px-8 py-4 text-lg font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white font-inter hover:bg-white/30 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <Icons.ArrowDown className="w-5 h-5" />
                  <span>HOW IT WORKS</span>
                  <Icons.ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: How It Works */}
        <div 
          ref={(el) => { sectionRefs.current[3] = el; }}
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          <div className="max-w-6xl px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-6xl mb-8 font-inter">
                <span className="text-white font-light">The </span>
                <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient font-medium">
                  perfect
                </span>
                <span className="text-white font-light ml-4">reading experience</span>
              </h2>
              <p className="text-xl text-black mb-8 max-w-3xl mx-auto leading-relaxed font-inter">
                Made for the curious, the informed and the savy (all in one place).
              </p>
              
              {/* How It Works Graphic */}
              <div className="flex justify-center mb-16">
                <Image 
                  src="/images/HowItWorks.png" 
                  alt="How It Works - Perfect Reading Experience" 
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
              
              {/* I'M READY CTA Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setCurrentSection(4);
                    setIsScrolling(true);
                    setTimeout(() => setIsScrolling(false), 800);
                  }}
                  className="group inline-flex items-center gap-4 px-8 py-4 text-lg font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white font-inter hover:bg-white/30 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  <Icons.ArrowDown className="w-5 h-5" />
                  <span>I&apos;M READY</span>
                  <Icons.ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>





        {/* Section 5: Call to Action */}
        <div 
          ref={(el) => { sectionRefs.current[4] = el; }}
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          <div className="text-center max-w-6xl px-8 relative z-10">
            <div className="animate-fade-in-up">
              <h2 className="text-6xl mb-8 font-inter">
                <span className="text-white font-light">Are you </span>
                <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient font-medium">
                  Ready
                </span>
                <span className="text-white font-light">?</span>
              </h2>
              <p className="text-2xl text-black mb-12 max-w-4xl mx-auto leading-relaxed font-inter">
                Level up your research game, for $0.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                <Link 
                  href="/login" 
                  className="px-10 py-4 bg-white/20 border border-white/30 text-white rounded-full font-medium text-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 font-inter"
                >
                  Create Account
                </Link>
                <Link 
                  href="/research" 
                  className="px-10 py-4 border border-white/30 text-white rounded-full font-medium text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 font-inter"
                >
                  Browse Research
                </Link>
                <button 
                  onClick={() => window.showSubscribePopout && window.showSubscribePopout()}
                  className="px-10 py-4 border border-white/30 text-white rounded-full font-medium text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 font-inter"
                >
                  Subscribe to Newsletter
                </button>
              </div>
              
              <div className="text-white/60 text-lg font-inter">
                <p>No commitment • Cancel anytime • Start protecting your capital today</p>
              </div>
            </div>
          </div>
          
          {/* Final floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-32 right-32 w-40 h-40 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-32 left-32 w-32 h-32 border border-white/10 rotate-12 animate-float-slow" />
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="relative z-20 transition-opacity duration-500"
        style={{ opacity: footerOpacity }}
      >
        <Footer />
      </div>
    </div>
  );
}
