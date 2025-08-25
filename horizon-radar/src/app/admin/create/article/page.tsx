'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon, PlusIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

type ReadingLevel = 'beginner' | 'intermediate' | 'advanced';

interface DraftArticle {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

interface TestArticle {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

interface PublishedArticle {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

// SectionState interface removed - now using separate states for visibility and synchronization

interface ArticleFormData {
  id: string;
  title: string;
  slug: string;
  // Basic Info
  projectName: string;
  ticker: string;
  category: string[];
  chains: string[];
  status: string;
  premium: boolean;
  
  // Content Sections
  tldr: Record<ReadingLevel, string>;
  abstract: Record<ReadingLevel, string>;
  architecture: Record<ReadingLevel, string>;
  mechanics: Record<ReadingLevel, string>;
  problemUsersValue: Record<ReadingLevel, string>;
  tokenomics: Record<ReadingLevel, string>;
  authorSources: Record<ReadingLevel, string>;
  disclaimer: Record<ReadingLevel, string>;
  community: Record<ReadingLevel, string>;
  
  // Flexible Arrays
  teamMembers: string[];
  officialLinks: string[];
  sources: string[];
  
  // Custom Sections
  customSections: Array<{
    id: string;
    title: string;
    content: Record<ReadingLevel, string>;
    visible: boolean;
  }>;
  
  // Table of Contents
  tableOfContents: string[];
  
  // Metadata
  lastModified: string;
  excerpt: string;
}

export default function CreateArticlePage() {
  const [currentLevel, setCurrentLevel] = useState<ReadingLevel>('beginner');
  const [formData, setFormData] = useState<ArticleFormData>({
    id: `article-${Date.now()}`,
    title: '',
    slug: '',
    projectName: '',
    ticker: '',
    category: [''],
    chains: [''],
    status: '',
    premium: false,
    tldr: { beginner: '', intermediate: '', advanced: '' },
    abstract: { beginner: '', intermediate: '', advanced: '' },
    architecture: { beginner: '', intermediate: '', advanced: '' },
    mechanics: { beginner: '', intermediate: '', advanced: '' },
    problemUsersValue: { beginner: '', intermediate: '', advanced: '' },
    tokenomics: { beginner: '', intermediate: '', advanced: '' },
    authorSources: { beginner: '', intermediate: '', advanced: '' },
    disclaimer: { beginner: '', intermediate: '', advanced: '' },
    community: { beginner: '', intermediate: '', advanced: '' },
    teamMembers: [''],
    officialLinks: [''],
    sources: [''],
    customSections: [],
    tableOfContents: [
      'Abstract',
      'Architecture',
      'Mechanics',
      'Problem, Users & Value',
      'Tokenomics',
      'Team',
      'Sources',
      'Disclaimer',
      'Community'
    ],
    lastModified: new Date().toISOString(),
    excerpt: ''
  });

  const [sectionStates, setSectionStates] = useState<Record<string, Record<ReadingLevel, boolean>>>({
    tldr: { beginner: true, intermediate: true, advanced: true },
    abstract: { beginner: true, intermediate: true, advanced: true },
    architecture: { beginner: true, intermediate: true, advanced: true },
    mechanics: { beginner: true, intermediate: true, advanced: true },
    problemUsersValue: { beginner: true, intermediate: true, advanced: true },
    tokenomics: { beginner: true, intermediate: true, advanced: true },
    authorSources: { beginner: true, intermediate: true, advanced: true },
    disclaimer: { beginner: true, intermediate: true, advanced: true },
    community: { beginner: true, intermediate: true, advanced: true },
  });

  const [synchronizedSections, setSynchronizedSections] = useState<Record<string, boolean>>({
    tldr: false,
    abstract: false,
    architecture: false,
    mechanics: false,
    problemUsersValue: false,
    tokenomics: false,
    authorSources: false,
    disclaimer: false,
    community: false,
  });

  const toggleSectionVisibility = (section: string, level: ReadingLevel) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: { ...prev[section], [level]: !prev[section][level] }
    }));
  };

  const syncFromAdvanced = (section: string) => {
    if (formData[section as keyof ArticleFormData] && typeof formData[section as keyof ArticleFormData] === 'object') {
      const sectionData = formData[section as keyof ArticleFormData] as Record<ReadingLevel, string>;
      if (sectionData.advanced) {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...sectionData,
            beginner: sectionData.advanced,
            intermediate: sectionData.advanced
          }
        }));
        // Enable synchronization after syncing
        setSynchronizedSections(prev => ({
          ...prev,
          [section]: true
        }));
      }
    }
  };

  const untetherSynchronization = (section: string) => {
    setSynchronizedSections(prev => ({
      ...prev,
      [section]: false
    }));
  };

  const addArrayItem = (field: keyof Pick<ArticleFormData, 'teamMembers' | 'officialLinks' | 'sources' | 'category' | 'chains'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: keyof Pick<ArticleFormData, 'teamMembers' | 'officialLinks' | 'sources' | 'category' | 'chains'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: keyof Pick<ArticleFormData, 'teamMembers' | 'officialLinks' | 'sources' | 'category' | 'chains'>, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      title: '',
      content: { beginner: '', intermediate: '', advanced: '' },
      visible: true
    };
    setFormData(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSection]
    }));
  };

  const removeCustomSection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== id)
    }));
  };

  const updateCustomSection = (id: string, field: string, value: string | Record<ReadingLevel, string> | boolean) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleSaveDraft = () => {
    try {
      // Generate title from project name if not set
      const title = formData.title || `${formData.projectName} Analysis`;
      
      // Generate excerpt from abstract
      const excerpt = formData.excerpt || formData.abstract[currentLevel]?.substring(0, 150) + '...' || '';
      
      const articleData = {
        ...formData,
        title,
        excerpt,
        lastModified: new Date().toISOString()
      };
      
      // Save to drafts
      const savedDrafts = localStorage.getItem('articleDrafts') || '[]';
      const draftsData = JSON.parse(savedDrafts);
      
      // Check if article already exists in drafts
      const existingIndex = draftsData.findIndex((draft: DraftArticle) => draft.id === articleData.id);
      if (existingIndex !== -1) {
        draftsData[existingIndex] = articleData;
      } else {
        draftsData.push(articleData);
      }
      
      localStorage.setItem('articleDrafts', JSON.stringify(draftsData));
      
      // Show success popup with option to view drafts
      const draftsUrl = `/admin/drafts`;
      if (confirm('Article saved to drafts successfully! Would you like to view your drafts?')) {
        window.open(draftsUrl, '_blank');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    }
  };

  const handleTestArticle = () => {
    try {
      // Generate title from project name if not set
      const title = formData.title || `${formData.projectName} Analysis`;
      
      // Generate excerpt from abstract if not set
      const excerpt = formData.excerpt || formData.abstract[currentLevel]?.substring(0, 150) + '...' || '';
      
      const articleData = {
        ...formData,
        title,
        excerpt,
        lastModified: new Date().toISOString()
      };
      
      // Save to test articles
      const testArticles = localStorage.getItem('testArticles') || '[]';
      const testData = JSON.parse(testArticles);
      
      // Check if article already exists in test
      const existingIndex = testData.findIndex((test: TestArticle) => test.id === articleData.id);
      if (existingIndex !== -1) {
        testData[existingIndex] = articleData;
      } else {
        testData.push(articleData);
      }
      
      localStorage.setItem('testArticles', JSON.stringify(testData));
      
      // Also save to drafts for backup
      const savedDrafts = localStorage.getItem('articleDrafts') || '[]';
      const draftsData = JSON.parse(savedDrafts);
      
      const existingDraftIndex = draftsData.findIndex((draft: DraftArticle) => draft.id === articleData.id);
      if (existingDraftIndex !== -1) {
        draftsData[existingDraftIndex] = articleData;
      } else {
        draftsData.push(articleData);
      }
      
      localStorage.setItem('articleDrafts', JSON.stringify(draftsData));
      
      // Show success popup with option to view test article
      const testArticleUrl = `/admin/test`;
      if (confirm('Article moved to test successfully! Would you like to view the test article?')) {
        window.open(testArticleUrl, '_blank');
      }
    } catch (error) {
      console.error('Error moving to test:', error);
      alert('Error moving to test. Please try again.');
    }
  };

  const handlePublish = () => {
    try {
      // Generate title from project name if not set
      const title = formData.title || `${formData.projectName} Analysis`;
      
      // Generate excerpt from abstract
      const excerpt = formData.excerpt || formData.abstract[currentLevel]?.substring(0, 150) + '...' || '';
      
      const articleData = {
        ...formData,
        title,
        excerpt,
        lastModified: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      };
      
      // Save to published articles
      const publishedArticles = localStorage.getItem('publishedArticles') || '[]';
      const publishedData = JSON.parse(publishedArticles);
      
      const existingIndex = publishedData.findIndex((published: PublishedArticle) => published.id === articleData.id);
      if (existingIndex !== -1) {
        publishedData[existingIndex] = articleData;
      } else {
        publishedData.push(articleData);
      }
      
      localStorage.setItem('publishedArticles', JSON.stringify(publishedData));
      
      // Also save to drafts for backup
      const savedDrafts = localStorage.getItem('articleDrafts') || '[]';
      const draftsData = JSON.parse(savedDrafts);
      
      const existingDraftIndex = draftsData.findIndex((draft: DraftArticle) => draft.id === articleData.id);
      if (existingDraftIndex !== -1) {
        draftsData[existingDraftIndex] = articleData;
      } else {
        draftsData.push(articleData);
      }
      
      localStorage.setItem('articleDrafts', JSON.stringify(draftsData));
      
      // Show success popup with option to view published article
      const publishedArticleUrl = `/article/${formData.slug || formData.projectName.toLowerCase().replace(/\s+/g, '-')}`;
      if (confirm('Article published successfully! Would you like to view the published article?')) {
        window.open(publishedArticleUrl, '_blank');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Error publishing article. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
                ← Back to Admin
              </Link>
              <h1 className="text-2xl font-light">
                <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
                  CREATE NEW ARTICLE
                </span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
              >
                SAVE ARTICLE
              </button>
              <button
                onClick={handleTestArticle}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all duration-300"
              >
                TEST ARTICLE
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
              >
                PUBLISH ARTICLE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Level Selector */}
      <div className="bg-white/3 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <span className="text-white/60">Reading Level:</span>
            {(['beginner', 'intermediate', 'advanced'] as ReadingLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setCurrentLevel(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentLevel === level
                    ? 'bg-[rgb(var(--color-horizon-green))] text-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Article Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="Enter article title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="e.g., glow-analysis, ethereum-pos, uniswap-v4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Project Name</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Ticker</label>
                <input
                  type="text"
                  value={formData.ticker}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticker: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="e.g., BTC, ETH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="Mainnet">Mainnet</option>
                  <option value="Testnet">Testnet</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="premium"
                  checked={formData.premium}
                  onChange={(e) => setFormData(prev => ({ ...prev, premium: e.target.checked }))}
                  className="w-5 h-5 text-[rgb(var(--color-horizon-green))] bg-white/10 border-white/20 rounded focus:ring-[rgb(var(--color-horizon-green))] focus:ring-2"
                />
                <label htmlFor="premium" className="text-white/80">Premium Article</label>
              </div>
            </div>
            
            {/* Excerpt */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Article Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                placeholder="Enter a brief excerpt/summary of the article (optional - will auto-generate from abstract if left empty)"
              />
            </div>

            {/* Categories */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Categories</label>
              {formData.category.map((cat, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={cat}
                    onChange={(e) => updateArrayItem('category', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter category"
                  />
                  {formData.category.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('category', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('category')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Chains */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Chains</label>
              {formData.chains.map((chain, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={chain}
                    onChange={(e) => updateArrayItem('chains', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter chain name"
                  />
                  {formData.chains.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('chains', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('chains')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Chain</span>
              </button>
            </div>
          </div>

          {/* Content Sections */}
          {(['tldr', 'abstract', 'architecture', 'mechanics', 'problemUsersValue', 'tokenomics', 'authorSources', 'disclaimer', 'community'] as const).map((section) => (
            <div key={section} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium capitalize">
                  {section === 'tldr' ? 'TLDR' : 
                   section === 'problemUsersValue' ? 'Problem, Users & Value' :
                   section === 'authorSources' ? 'Author Sources' :
                   section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <div className="flex items-center space-x-2">
                  {/* Visibility toggle for current level */}
                  <button
                    onClick={() => toggleSectionVisibility(section, currentLevel)}
                    className={`p-2 rounded-lg transition-colors ${
                      sectionStates[section][currentLevel]
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-white/50'
                    }`}
                    title={sectionStates[section][currentLevel] ? 'Hide section' : 'Show section'}
                  >
                    {sectionStates[section][currentLevel] ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                  </button>
                  
                  {/* Synchronization status and controls */}
                  <div className="flex items-center space-x-2">
                    {synchronizedSections[section] ? (
                      <>
                        <span className="px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium">
                          (Currently Synchronized)
                        </span>
                        <button
                          onClick={() => untetherSynchronization(section)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Untether Synchronization
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium">
                          (Currently Unsynchronized)
                        </span>
                        <button
                          onClick={() => syncFromAdvanced(section)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Sync From Advanced
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {sectionStates[section][currentLevel] && (
                <div className="space-y-4">
                  {synchronizedSections[section] ? (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Content (Synchronized across all levels)
                      </label>
                      <textarea
                        value={formData[section].advanced}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            [section]: { beginner: value, intermediate: value, advanced: value }
                          }));
                        }}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder={`Enter ${section} content...`}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Content for {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level
                      </label>
                      <textarea
                        value={formData[section][currentLevel]}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            [section]: { ...prev[section], [currentLevel]: e.target.value }
                          }));
                        }}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder={`Enter ${section} content for ${currentLevel} level...`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Flexible Arrays */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Team & Links</h2>
            
            {/* Team Members */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Team Members</label>
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => updateArrayItem('teamMembers', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter team member name and role"
                  />
                  {formData.teamMembers.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('teamMembers', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('teamMembers')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            {/* Official Links */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Official Links</label>
              {formData.officialLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateArrayItem('officialLinks', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter official link"
                  />
                  {formData.officialLinks.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('officialLinks', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('officialLinks')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Official Link</span>
              </button>
            </div>

            {/* Sources */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Sources</label>
              {formData.sources.map((source, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => updateArrayItem('sources', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter source reference"
                  />
                  {formData.sources.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('sources', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('sources')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Source</span>
              </button>
            </div>
          </div>

          {/* Custom Sections */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Custom Sections</h2>
              <button
                onClick={addCustomSection}
                className="px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Custom Section</span>
              </button>
            </div>
            
            {formData.customSections.map((section) => (
              <div key={section.id} className="border border-white/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent mr-4"
                    placeholder="Section title"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCustomSection(section.id, 'visible', !section.visible)}
                      className={`p-2 rounded-lg transition-colors ${
                        section.visible 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/10 text-white/50'
                      }`}
                      title={`${section.visible ? 'Hide' : 'Show'} section for all levels`}
                    >
                      {section.visible ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => removeCustomSection(section.id)}
                      className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {section.visible && (
                  <textarea
                    value={section.content[currentLevel]}
                    onChange={(e) => {
                      const newContent = { ...section.content, [currentLevel]: e.target.value };
                      updateCustomSection(section.id, 'content', newContent);
                    }}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder={`Enter content for ${currentLevel} level...`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Table of Contents */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Table of Contents</h2>
            <div className="space-y-2">
              {formData.tableOfContents.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newToc = [...formData.tableOfContents];
                      newToc[index] = e.target.value;
                      setFormData(prev => ({ ...prev, tableOfContents: newToc }));
                    }}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Table of contents item"
                  />
                  <button className="p-3 bg-white/10 border border-white/20 rounded-lg text-white/60 hover:bg-white/20 transition-colors cursor-move">
                    <ArrowsUpDownIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
