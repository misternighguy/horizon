'use client';

import { useState, useEffect } from 'react';
import { localStorageDB } from '@/data/localStorageDB';
import { Icons } from '@/components/ui/Icons';

interface WatchlistButtonProps {
  articleId: string;
  className?: string;
}

export default function WatchlistButton({ articleId, className = '' }: WatchlistButtonProps) {
  const [isOnWatchlist, setIsOnWatchlist] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const adminSession = localStorage.getItem('adminSession');
    const userSession = localStorage.getItem('userSession');
    
    if (adminSession || userSession) {
      setIsLoggedIn(true);
      
      // Get user data and check if article is on watchlist
      const users = localStorageDB.getUsers();
      const currentUser = users.find(u => u.username === (adminSession || userSession));
      
      if (currentUser) {
        const watchlist = currentUser.watchlist || [];
        setIsOnWatchlist(watchlist.includes(articleId));
      }
    }
    
    setIsLoading(false);
  }, [articleId]);

  const handleToggleWatchlist = () => {
    if (!isLoggedIn) return;
    
    const adminSession = localStorage.getItem('adminSession');
    const userSession = localStorage.getItem('userSession');
    const username = adminSession || userSession;
    
    if (!username) return;
    
    const users = localStorageDB.getUsers();
    const currentUser = users.find(u => u.username === username);
    
    if (!currentUser) return;
    
    const watchlist = currentUser.watchlist || [];
    let newWatchlist: string[];
    
    if (isOnWatchlist) {
      // Remove from watchlist
      newWatchlist = watchlist.filter(id => id !== articleId);
    } else {
      // Add to watchlist
      newWatchlist = [...watchlist, articleId];
    }
    
    // Update user in database
    const updatedUser = localStorageDB.updateUser(currentUser.id, {
      watchlist: newWatchlist
    });
    
    if (updatedUser) {
      setIsOnWatchlist(!isOnWatchlist);
    }
  };

  const handleSignInClick = () => {
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className={`px-4 py-2 bg-white/10 rounded-full flex items-center justify-center ${className}`}>
        <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <button
        onClick={handleSignInClick}
        className={`group relative flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 ${className}`}
        title="Sign in to add to watchlist"
      >
        <Icons.Star className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          Sign in to add to watchlist
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleWatchlist}
      className={`group relative flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 ${className}`}
      title={isOnWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {isOnWatchlist ? (
        <Icons.Star className="w-5 h-5 text-orange-400 transition-colors" />
      ) : (
        <Icons.Star className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
        {isOnWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
      </div>
    </button>
  );
}
