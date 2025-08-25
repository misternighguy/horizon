'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, ArrowUpIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TestArticle {
  id: string;
  title: string;
  ticker: string;
  category: string[];
  lastModified: string;
  projectName: string;
  excerpt: string;
}

interface ArticleData {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

export default function TestPage() {
  const [testArticles, setTestArticles] = useState<TestArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTestArticles();
  }, []);

  const loadTestArticles = () => {
    try {
      const testData = localStorage.getItem('testArticles');
      if (testData) {
        const articles = JSON.parse(testData);
        setTestArticles(articles);
      }
    } catch (error) {
      console.error('Error loading test articles:', error);
    }
  };

  const publishArticle = (article: TestArticle) => {
    if (confirm(`Are you sure you want to publish "${article.title}"?`)) {
      try {
        // Remove from test articles
        const testData = localStorage.getItem('testArticles');
        if (testData) {
          const articles = JSON.parse(testData);
          const updatedTests = articles.filter((a: ArticleData) => a.id !== article.id);
          localStorage.setItem('testArticles', JSON.stringify(updatedTests));
        }
        
        // Add to published articles
        const publishedArticles = localStorage.getItem('publishedArticles') || '[]';
        const publishedData = JSON.parse(publishedArticles);
        const publishedArticle = { ...article, publishedAt: new Date().toISOString() };
        publishedData.push(publishedArticle);
        localStorage.setItem('publishedArticles', JSON.stringify(publishedData));
        
        // Also save to drafts for backup
        const savedDrafts = localStorage.getItem('articleDrafts') || '[]';
        const draftsData = JSON.parse(savedDrafts);
        draftsData.push({ ...article, lastModified: new Date().toISOString() });
        localStorage.setItem('articleDrafts', JSON.stringify(draftsData));
        
        loadTestArticles();
        alert('Article published successfully!');
      } catch (error) {
        console.error('Error publishing article:', error);
      }
    }
  };

  const moveToDrafts = (article: TestArticle) => {
    try {
      // Remove from test articles
      const testData = localStorage.getItem('testArticles');
      if (testData) {
        const articles = JSON.parse(testData);
                  const updatedTests = articles.filter((a: ArticleData) => a.id !== article.id);
        localStorage.setItem('testArticles', JSON.stringify(updatedTests));
      }
      
      // Add to drafts
      const savedDrafts = localStorage.getItem('articleDrafts') || '[]';
      const draftsData = JSON.parse(savedDrafts);
      draftsData.push({ ...article, lastModified: new Date().toISOString() });
      localStorage.setItem('articleDrafts', JSON.stringify(draftsData));
      
      loadTestArticles();
      alert('Article moved to drafts successfully!');
    } catch (error) {
      console.error('Error moving to drafts:', error);
    }
  };

  const deleteTestArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this test article?')) {
      try {
        const testData = localStorage.getItem('testArticles');
        if (testData) {
          const articles = JSON.parse(testData);
          const updatedTests = articles.filter((article: ArticleData) => article.id !== id);
          localStorage.setItem('testArticles', JSON.stringify(updatedTests));
          loadTestArticles();
        }
      } catch (error) {
        console.error('Error deleting test article:', error);
      }
    }
  };

  const filteredArticles = testArticles.filter(article => {
    return article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           article.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           article.ticker.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  TEST ARTICLES
                </span>
              </h1>
              <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm">
                TESTING MODE
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/create/article"
                className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
              >
                CREATE NEW ARTICLE
              </Link>
              <Link
                href="/admin/drafts"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
              >
                VIEW DRAFTS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Search test articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div className="text-sm text-white/60">
            {filteredArticles.length} test article{filteredArticles.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Test Articles List */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg mb-4">No test articles found.</p>
            <div className="space-y-3">
              <p className="text-white/40 text-sm">Test articles are articles that are being reviewed before publication.</p>
              <Link
                href="/admin/create/article"
                className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
              >
                Create New Article
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-medium">{article.title}</h3>
                      <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
                        TESTING
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-white/60 text-sm">Project:</span>
                        <p className="text-white font-medium">{article.projectName}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Ticker:</span>
                        <p className="text-white font-medium">{article.ticker}</p>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Last Modified:</span>
                        <p className="text-white font-medium">{new Date(article.lastModified).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-white/60 text-sm">Categories:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {article.category.map((cat, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-white/60 text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {article.excerpt && (
                      <div>
                        <span className="text-white/60 text-sm">Excerpt:</span>
                        <p className="text-white/70 text-sm mt-1">{article.excerpt}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    <Link
                      href={`/admin/edit/${article.id}`}
                      className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
                      title="Edit Article"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    
                    <button
                      onClick={() => publishArticle(article)}
                      className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-600/30 transition-colors"
                      title="Publish Article"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => moveToDrafts(article)}
                      className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
                      title="Move to Drafts"
                    >
                      <ArrowUpIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => deleteTestArticle(article.id)}
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
