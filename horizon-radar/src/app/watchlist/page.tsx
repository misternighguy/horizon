'use client';

import { useState, useEffect } from 'react';
import { localStorageDB } from '@/data/localStorageDB';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Article, User } from '@/types';
import { Icons } from '@/components/ui/Icons';
import Link from 'next/link';

export default function WatchlistPage() {
  const [user, setUser] = useState<User | null>(null);
  const [watchlistArticles, setWatchlistArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing login sessions
    const adminSession = localStorage.getItem('adminSession');
    const userSession = localStorage.getItem('userSession');
    
    if (adminSession || userSession) {
      // Get user data from database
      const users = localStorageDB.getUsers();
      const currentUser = users.find(u => u.username === (adminSession || userSession));
      
      if (currentUser) {
        setUser(currentUser);
        
        // Get watchlist articles
        const watchlist = currentUser.watchlist || [];
        const articles = localStorageDB.getArticles();
        const watchlistArticles = articles.filter(article => 
          watchlist.includes(article.id) && article.status === 'published'
        );
        
        setWatchlistArticles(watchlistArticles);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleRemoveFromWatchlist = (articleId: string) => {
    if (!user) return;
    
    const adminSession = localStorage.getItem('adminSession');
    const userSession = localStorage.getItem('userSession');
    const username = adminSession || userSession;
    
    if (!username) return;
    
    const users = localStorageDB.getUsers();
    const currentUser = users.find(u => u.username === username);
    
    if (!currentUser) return;
    
    const watchlist = currentUser.watchlist || [];
    const newWatchlist = watchlist.filter(id => id !== articleId);
    
    // Update user in database
    const updatedUser = localStorageDB.updateUser(currentUser.id, {
      watchlist: newWatchlist
    });
    
    if (updatedUser) {
      setUser(updatedUser);
      setWatchlistArticles(prev => prev.filter(article => article.id !== articleId));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Not Logged In</h1>
          <p className="text-white/60 mb-6">You need to be logged in to view your watchlist.</p>
          <a href="/login" className="text-[rgb(var(--color-horizon-green))] hover:underline">
            Login to view your watchlist
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat"
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-black/40" />
      
      {/* Header positioned on top of background */}
      <div className="relative z-20">
        <Header />
      </div>
      
      {/* Content with overlay */}
      <div className="relative z-10 w-full py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Watchlist Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-medium drop-shadow-lg mb-4">
              <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient">
                Watchlist
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Your curated collection of research articles and protocols
            </p>
          </div>

          {/* Watchlist Stats */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Icons.Star className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Watchlist Summary</h3>
                  <p className="text-white/60">
                    {watchlistArticles.length} article{watchlistArticles.length !== 1 ? 's' : ''} saved
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Member since</p>
                <p className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Watchlist Content */}
          {watchlistArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-900/80 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Icons.Star className="w-12 h-12 text-white/40" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-4">Your watchlist is empty</h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Start building your watchlist by adding articles that interest you. 
                Look for the star icon on any research article to save it here.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Link
                  href="/research"
                  className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
                >
                  Browse Research
                </Link>
                <Link
                  href="/protocols"
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300"
                >
                  Explore Protocols
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Articles Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {watchlistArticles.map((article) => (
                  <div key={article.id} className="bg-gray-900/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-gray-800/90 transition-all duration-300 group">
                    {/* Article Header - Horizontal Layout */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-white mb-2 line-clamp-2 group-hover:text-[rgb(var(--color-horizon-green))] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-white/60 mb-2 line-clamp-2">
                          {article.subtitle}
                        </p>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80">
                            {article.ticker}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80">
                            {article.classification}
                          </span>
                        </div>
                        
                        {/* Article Preview - Inline with meta */}
                        <p className="text-sm text-white/80 line-clamp-2 mb-3">
                          {article.abstract?.[0] || 'No abstract available'}
                        </p>
                        
                        {/* Article Meta - Horizontal layout */}
                        <div className="flex items-center space-x-4 text-sm text-white/70">
                          <div>
                            <span className="text-white/40">Author:</span> {article.author}
                          </div>
                          <div>
                            <span className="text-white/40">Published:</span> {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                                            </div>
                      
                      {/* Remove from Watchlist Button */}
                      <button
                        onClick={() => handleRemoveFromWatchlist(article.id)}
                        className="flex-shrink-0 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300"
                        title="Remove from watchlist"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <Link 
                        href={`/article/${article.slug}`}
                        className="flex-1 py-2 px-4 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-center"
                      >
                        Read Article
                      </Link>

                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/research"
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300"
                  >
                    Browse More Research
                  </Link>
                  <Link
                    href="/search"
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300"
                  >
                    Advanced Search
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
