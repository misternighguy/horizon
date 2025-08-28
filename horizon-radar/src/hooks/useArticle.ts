'use client';

import { useState, useEffect, useRef } from 'react';
import { Article, LocalStorageDB } from '@/types';
import { useLevel } from '@/contexts/LevelContext';

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  
  const articleRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  
  // Use LevelContext to get and set reading style
  const { level: readingStyle, setLevel: setReadingStyle } = useLevel();

  // Load article data
  useEffect(() => {
    if (slug) {
      try {
        const localStorageDB: LocalStorageDB | undefined = window.localStorageDB;
        if (localStorageDB) {
          const articleData = localStorageDB.getArticleBySlug(slug);
          console.log('Article data loaded:', articleData);
          console.log('Featured image:', articleData?.featuredImage);
          if (articleData) {
            setArticle(articleData);
          }
        }
      } catch (error) {
        console.error('Failed to load article:', error);
      }
    }
  }, [slug]);

  // Scroll event listeners
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;

      const scrollTop = window.scrollY;
      const articleHeight = articleRef.current.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate reading progress
      const progress = Math.min(100, Math.max(0, (scrollTop / (articleHeight - windowHeight)) * 100));
      setReadingProgress(progress);

      // Calculate parallax offset
      setParallaxOffset(scrollTop * 0.01);

      // Update active section for TOC
      if (sectionsRef.current) {
        const sections = sectionsRef.current.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;
          
          // Consider a section active if its top is near the top of the viewport
          // and it's not completely scrolled past
          if (sectionTop <= 150 && sectionBottom > 100) {
            currentSection = section.id;
          }
        });

        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop - 10; // Add 10px extra space above
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return {
    article,
    readingStyle,
    setReadingStyle,
    activeSection,
    readingProgress,
    parallaxOffset,
    articleRef,
    sectionsRef,
    scrollToSection
  };
}
