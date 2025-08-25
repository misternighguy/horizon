'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { localStorageDB } from '@/data/localStorageDB';
import { Article, Comment, CommentFormData, ReadingLevel } from '@/types';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // State
  const [article, setArticle] = useState<Article | null>(null);
  const [readingStyle, setReadingStyle] = useState<ReadingLevel>('beginner');
  const [activeSection, setActiveSection] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState<CommentFormData>({ content: '' });
  const [replyForms, setReplyForms] = useState<Record<string, string>>({});
  const [dailyCommentCount, setDailyCommentCount] = useState(0);
  const [dailyReplyCount, setDailyReplyCount] = useState(0);

  // Refs
  const articleRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Load article data
  useEffect(() => {
    if (slug) {
      const articleData = localStorageDB.getArticleBySlug(slug);
      if (articleData) {
        setArticle(articleData);
        // Load comments for this article
        const articleComments = localStorageDB.getCommentsByArticle(slug);
        setComments(articleComments);
      }
    }
  }, [slug]);

  // Check daily limits
  useEffect(() => {
    const today = new Date().toDateString();
    const todayComments = comments.filter(comment => 
      new Date(comment.timestamp).toDateString() === today
    );
    const todayReplies = todayComments.reduce((total, comment) => 
      total + comment.replies.filter(reply => 
        new Date(reply.timestamp).toDateString() === today
      ).length, 0
    );
    
    setDailyCommentCount(todayComments.length);
    setDailyReplyCount(todayReplies);
  }, [comments]);

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
      setParallaxOffset(scrollTop * 0.1);

      // Update active section for TOC
      if (sectionsRef.current) {
        const sections = sectionsRef.current.querySelectorAll('h2, h3');
        let currentSection = '';

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'neutral': return 'text-yellow-400';
      case 'bad': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const formatTimeAgo = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handlePostComment = () => {
    if (!article || !commentForm.content.trim() || dailyCommentCount >= 100) return;

    const newComment = localStorageDB.createComment({
      articleId: article.id,
      articleSlug: article.slug,
      articleTitle: article.title,
      author: 'Anonymous User', // In real app, this would be the logged-in user
      authorInitials: 'AU',
      authorColor: '#95EC6E',
      content: commentForm.content.trim(),
      replies: [],
      isHidden: false,
      isFlagged: false,
      parentId: undefined
    });

    setComments(prev => [newComment, ...prev]);
    setCommentForm({ content: '' });
    setDailyCommentCount(prev => prev + 1);
  };

  const handlePostReply = (commentId: string) => {
    if (!article || !replyForms[commentId]?.trim() || dailyReplyCount >= 100) return;

    const parentComment = comments.find(c => c.id === commentId);
    if (!parentComment) return;

    const newReply = localStorageDB.createComment({
      articleId: article.id,
      articleSlug: article.slug,
      articleTitle: article.title,
      author: 'Anonymous User',
      authorInitials: 'AU',
      authorColor: '#FFB34D',
      content: replyForms[commentId].trim(),
      replies: [],
      isHidden: false,
      isFlagged: false,
      parentId: commentId
    });

    // Update the parent comment with the new reply
    const updatedComments = comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    );

    setComments(updatedComments);
    setReplyForms(prev => ({ ...prev, [commentId]: '' }));
    setDailyReplyCount(prev => prev + 1);
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
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-30">
        <div 
          className="h-full bg-gradient-to-r from-[rgb(var(--color-horizon-green))] to-[rgb(var(--color-horizon-green))]/80 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Main Content */}
      <main id="main-content" ref={articleRef} className="relative">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-8">
          <div className="max-w-7xl mx-auto">
            {/* Title and Subtitle */}
            <div className="mb-8">
              <h1 className="text-6xl font-light mb-4">
                <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
                  {article.title}
                </span>
                <span className="text-white font-medium ml-4">({article.ticker})</span>
              </h1>
              <p className="text-white/80 text-lg max-w-4xl leading-relaxed">
                {article.subtitle}
              </p>
            </div>

            {/* Meta Row */}
            <div className="flex items-center space-x-8 text-sm text-white/60 mb-8">
              <span>Classification: {article.classification}</span>
              <span>Located on: {article.location}</span>
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
                src={article.featuredImage || '/solar-panels.jpg'}
                alt={`${article.title} featured image`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* Control Row */}
        <section className="px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Reading Style Pills */}
              <div className="relative group">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                  <span className="text-white/80 text-sm">Reading Style:</span>
                  <span className="text-white font-medium">{readingStyle.charAt(0).toUpperCase() + readingStyle.slice(1)}</span>
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Expanded Options */}
                <div className="absolute left-0 top-full mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-10 min-w-[200px]">
                  {(['beginner', 'intermediate', 'advanced'] as ReadingLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setReadingStyle(level)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        readingStyle === level
                          ? 'bg-[rgb(var(--color-horizon-green))] text-black'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watch Video Button */}
              <div className="relative group">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                  <span className="text-white/80 text-sm">Watch Video instead?</span>
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Expanded Options */}
                <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-10 min-w-[200px]">
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
            </div>
          </div>
        </section>

        {/* Main Content and Sidebar */}
        <section className="px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content Column */}
              <div className="lg:col-span-3 space-y-16">
                {/* Abstract */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Abstract</h2>
                  <div className="space-y-4">
                    {article.abstract.map((paragraph, index) => (
                      <p key={index} className="text-white/80 text-lg leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>

                {/* Product Architecture */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Product Architecture</h2>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {article.productArchitecture.sections.map((section, index) => (
                        <li key={index} className="text-white/80 text-lg leading-relaxed flex items-start">
                          <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">•</span>
                          {section}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-6">
                      {article.productArchitecture.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Mechanics */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Core Mechanics</h2>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {article.mechanics.map((mechanic, index) => (
                        <li key={index} className="text-white/80 text-lg leading-relaxed flex items-start">
                          <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">•</span>
                          {mechanic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Problem, Users & Value */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Problem, Users & Value</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium text-white mb-3">Problem</h3>
                      <p className="text-white/80 text-lg leading-relaxed">{article.problemUsersValue.problem}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-3">Users</h3>
                      <ul className="space-y-2">
                        {article.problemUsersValue.users.map((user, index) => (
                          <li key={index} className="text-white/80 text-lg leading-relaxed flex items-start">
                            <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">•</span>
                            {user}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-3">Approach</h3>
                      <p className="text-white/80 text-lg leading-relaxed">{article.problemUsersValue.approach}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-3">Differentiators</h3>
                      <ul className="space-y-2">
                        {article.problemUsersValue.differentiators.map((diff, index) => (
                          <li key={index} className="text-white/80 text-lg leading-relaxed flex items-start">
                            <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">•</span>
                            {diff}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Team */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Team</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {article.team.map((member, index) => (
                      <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                        <h3 className="text-xl font-medium text-white mb-2">{member.name}</h3>
                        <p className="text-white/60 mb-4">{member.role}</p>
                        <div className="flex space-x-3">
                          {member.twitter && (
                            <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-[rgb(var(--color-horizon-green))] hover:underline">
                              Twitter
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[rgb(var(--color-horizon-green))] hover:underline">
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Events */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Timeline</h2>
                  <div className="space-y-4">
                    {article.events.map((event, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-[rgb(var(--color-horizon-green))] rounded-full"></div>
                        <div>
                          <span className="text-white font-medium">{event.event}</span>
                          {event.date && <span className="text-white/60 ml-2">({event.date})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Official Links */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Official Links</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium text-white mb-3">Social Media</h3>
                      <div className="flex flex-wrap gap-3">
                        {article.officialLinks.socials.map((social, index) => (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          >
                            {social.platform}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-3">Technical</h3>
                      <div className="flex flex-wrap gap-3">
                        {article.officialLinks.technical.map((tech, index) => (
                          <a
                            key={index}
                            href={tech.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          >
                            {tech.type}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Ecosystem */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Ecosystem</h2>
                  <div className="flex flex-wrap gap-3">
                    {article.ecosystem.map((item, index) => (
                      <span key={index} className="px-4 py-2 bg-white/10 text-white rounded-lg">
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Credentials */}
                <section>
                  <h2 className="text-3xl font-light text-white mb-6">Credentials</h2>
                  <div className="space-y-3">
                    {article.credentials.map((credential, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">✓</span>
                        <span className="text-white/80 text-lg leading-relaxed">{credential}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Reading Level Specific Content */}
                {article.content[readingStyle] && (
                  <section>
                    <h2 className="text-3xl font-light text-white mb-6">
                      {readingStyle.charAt(0).toUpperCase() + readingStyle.slice(1)} Level Content
                    </h2>
                    <div className="space-y-6">
                      {article.content[readingStyle].sections
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => (
                          <div key={index}>
                            <h3 className="text-xl font-medium text-white mb-3">{section.title}</h3>
                            <p className="text-white/80 text-lg leading-relaxed">{section.content}</p>
                          </div>
                        ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Aside */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-8">
                  {/* Table of Contents */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4">On This Page</h3>
                    <nav className="space-y-2">
                      {[
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
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left text-sm transition-colors ${
                            activeSection === item.id
                              ? 'text-[rgb(var(--color-horizon-green))]'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
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
                      {article.tokenomics.map((item, index) => (
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
              </div>
            </div>
          </div>
        </section>

        {/* Grain Overlay */}
        <div className="fixed inset-0 pointer-events-none z-10">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.015'/%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
      </main>

      {/* Comments Section */}
      <section id="comments" className="mt-16 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light text-white mb-8">Comments</h2>
          
          {/* Comment Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Leave a Comment</h3>
            <div className="space-y-4">
              <textarea
                value={commentForm.content}
                onChange={(e) => setCommentForm({ content: e.target.value })}
                placeholder="Share your thoughts on this article..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">
                  {dailyCommentCount}/100 comments today
                </span>
                <button
                  onClick={handlePostComment}
                  disabled={!commentForm.content.trim() || dailyCommentCount >= 100}
                  className="px-6 py-2 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: comment.authorColor }}
                    >
                      <span className="text-black text-sm font-medium">{comment.authorInitials}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{comment.author}</span>
                        {comment.isAdmin && (
                          <span className="px-2 py-1 bg-[rgb(var(--color-horizon-green))]/20 text-[rgb(var(--color-horizon-green))] text-xs rounded-full">Admin</span>
                        )}
                      </div>
                      <div className="text-sm text-white/60">
                        {formatTimeAgo(comment.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comment Content */}
                <div className="mb-4">
                  <p className="text-white/90 leading-relaxed">{comment.content}</p>
                </div>

                {/* Reply Form */}
                <div className="mb-4">
                  <button
                    onClick={() => setReplyForms(prev => ({ ...prev, [comment.id]: prev[comment.id] ? '' : ' ' }))}
                    className="text-[rgb(var(--color-horizon-green))] hover:underline text-sm"
                  >
                    {replyForms[comment.id] ? 'Cancel Reply' : 'Reply'}
                  </button>
                  
                  {replyForms[comment.id] && (
                    <div className="mt-3 space-y-3">
                      <textarea
                        value={replyForms[comment.id]}
                        onChange={(e) => setReplyForms(prev => ({ ...prev, [comment.id]: e.target.value }))}
                        placeholder="Write a reply..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none text-sm"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">
                          {dailyReplyCount}/100 replies today
                        </span>
                        <button
                          onClick={() => handlePostReply(comment.id)}
                          disabled={!replyForms[comment.id]?.trim() || dailyReplyCount >= 100}
                          className="px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded text-sm hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 space-y-3">
                    <h4 className="text-sm font-medium text-white/70 mb-2">Replies:</h4>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: reply.authorColor }}
                            >
                              <span className="text-black text-xs font-medium">{reply.authorInitials}</span>
                            </div>
                            <span className="font-medium text-white text-sm">{reply.author}</span>
                            {reply.isAdmin && (
                              <span className="px-2 py-1 bg-[rgb(var(--color-horizon-green))]/20 text-[rgb(var(--color-horizon-green))] text-xs rounded-full">Admin</span>
                            )}
                            <span className="text-xs text-white/60">{formatTimeAgo(reply.timestamp)}</span>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-12 text-white/60">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
