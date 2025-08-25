'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface ArticleDraft {
  id: string;
  title: string;
  ticker: string;
  category: string[];
  status: 'draft' | 'test' | 'published';
  lastModified: string;
  projectName: string;
  excerpt: string;
}

interface DraftData {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

interface TestData {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

interface PublishedData {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<ArticleDraft[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // Load drafts from localStorage
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    try {
      const savedDrafts = localStorage.getItem('articleDrafts');
      const testArticles = localStorage.getItem('testArticles');
      const publishedArticles = localStorage.getItem('publishedArticles');
      
      const allDrafts: ArticleDraft[] = [];
      
      if (savedDrafts) {
        const draftsData = JSON.parse(savedDrafts);
        allDrafts.push(...draftsData.map((draft: DraftData) => ({ ...draft, status: 'draft' as const })));
      }
      
      if (testArticles) {
        const testData = JSON.parse(testArticles);
        allDrafts.push(...testData.map((test: TestData) => ({ ...test, status: 'test' as const })));
      }
      
      if (publishedArticles) {
        const publishedData = JSON.parse(publishedArticles);
        allDrafts.push(...publishedData.map((published: PublishedData) => ({ ...published, status: 'published' as const })));
      }
      
      setDrafts(allDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const deleteDraft = (id: string, status: string) => {
    if (confirm(`Are you sure you want to delete this ${status} article?`)) {
      try {
        if (status === 'draft') {
          const savedDrafts = localStorage.getItem('articleDrafts');
          if (savedDrafts) {
            const draftsData = JSON.parse(savedDrafts);
            const updatedDrafts = draftsData.filter((draft: DraftData) => draft.id !== id);
            localStorage.setItem('articleDrafts', JSON.stringify(updatedDrafts));
          }
        } else if (status === 'test') {
          const testArticles = localStorage.getItem('testArticles');
          if (testArticles) {
            const testData = JSON.parse(testArticles);
            const updatedTests = testData.filter((test: TestData) => test.id !== id);
            localStorage.setItem('testArticles', JSON.stringify(updatedTests));
          }
        } else if (status === 'published') {
          const publishedArticles = localStorage.getItem('publishedArticles');
          if (publishedArticles) {
            const publishedData = JSON.parse(publishedArticles);
            const updatedPublished = publishedData.filter((published: PublishedData) => published.id !== id);
            localStorage.setItem('publishedArticles', JSON.stringify(updatedPublished));
          }
        }
        
        loadDrafts(); // Reload the list
      } catch (error) {
        console.error('Error deleting draft:', error);
      }
    }
  };

  const moveToTest = (draft: ArticleDraft) => {
    try {
      // Remove from current location
      if (draft.status === 'draft') {
        const savedDrafts = localStorage.getItem('articleDrafts');
        if (savedDrafts) {
          const draftsData = JSON.parse(savedDrafts);
          const updatedDrafts = draftsData.filter((d: DraftData) => d.id !== draft.id);
          localStorage.setItem('articleDrafts', JSON.stringify(updatedDrafts));
        }
      } else if (draft.status === 'published') {
        const publishedArticles = localStorage.getItem('publishedArticles');
        if (publishedArticles) {
          const publishedData = JSON.parse(publishedArticles);
          const updatedPublished = publishedData.filter((p: PublishedData) => p.id !== draft.id);
          localStorage.setItem('publishedArticles', JSON.stringify(updatedPublished));
        }
      }
      
      // Add to test articles
      const testArticles = localStorage.getItem('testArticles') || '[]';
      const testData = JSON.parse(testArticles);
      const updatedTest = { ...draft, status: 'test' as const };
      testData.push(updatedTest);
      localStorage.setItem('testArticles', JSON.stringify(testData));
      
      loadDrafts(); // Reload the list
      alert('Article moved to test successfully!');
    } catch (error) {
      console.error('Error moving to test:', error);
    }
  };

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || draft.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'test': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'published': return 'bg-green-500/20 border-green-500/30 text-green-400';
      default: return 'bg-white/10 border-white/20 text-white/60';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'DRAFT';
      case 'test': return 'TEST';
      case 'published': return 'PUBLISHED';
      default: return status.toUpperCase();
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
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  ARTICLE DRAFTS
                </span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/create/article"
                className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
              >
                CREATE NEW ARTICLE
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search drafts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Drafts</option>
              <option value="test">Test</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <div className="text-sm text-white/60">
            {filteredDrafts.length} article{filteredDrafts.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Drafts List */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {filteredDrafts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">No drafts found.</p>
            <Link
              href="/admin/create/article"
              className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
            >
              Create Your First Article
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDrafts.map((draft) => (
              <div key={draft.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-medium">{draft.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(draft.status)}`}>
                        {getStatusLabel(draft.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-white/60 text-sm">Project:</span>
                        <p className="text-white font-medium">{draft.projectName}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Ticker:</span>
                        <p className="text-white font-medium">{draft.ticker}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Last Modified:</span>
                        <p className="text-white font-medium">{new Date(draft.lastModified).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-white/60 text-sm">Categories:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {draft.category.map((cat, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-white/60 text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {draft.excerpt && (
                      <div>
                        <span className="text-white/60 text-sm">Excerpt:</span>
                        <p className="text-white/70 text-sm mt-1">{draft.excerpt}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    <Link
                      href={`/admin/edit/${draft.id}`}
                      className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
                      title="Edit Article"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    
                    {draft.status !== 'test' && (
                      <button
                        onClick={() => moveToTest(draft)}
                        className="p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-600/30 transition-colors"
                        title="Move to Test"
                      >
                        <ArrowUpIcon className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteDraft(draft.id, draft.status)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                      title="Delete Article"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
