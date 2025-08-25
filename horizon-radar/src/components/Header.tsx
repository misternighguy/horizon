'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { UI_CONSTANTS } from '@/constants/ui';
import { Article } from '@/types';

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: '/about', label: 'About' },
  { href: '/premium', label: 'Premium' },
  { href: '/research', label: 'Research' },
  { href: '/request', label: 'Request' }
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > UI_CONSTANTS.SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in (check localStorage for admin session or other auth tokens)
    const adminSession = localStorage.getItem('adminSession');
    const userSession = localStorage.getItem('userSession');
    
    if (adminSession || userSession) {
      setIsLoggedIn(true);
      setUsername(adminSession || userSession || 'User');
    }
  }, []);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('userSession');
    setIsLoggedIn(false);
    setUsername('');
    // Redirect to home page after logout
    window.location.href = '/';
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 1000); // 1 second delay
  };

  // Spec: no header on About page
  if (pathname?.startsWith('/about')) return null;

  return (
    <header
      className={[
        'w-full bg-transparent', // REMOVED: sticky top-0 z-50
        'transition-shadow',
        scrolled ? 'shadow-sm' : ''
      ].join(' ')}
      aria-label="Primary"
    >
      <div className="w-full px-8 py-5">
        <div className="h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Brand />
            <DesktopNav />
          </div>
          <div className="flex items-center gap-5">
            <SearchBox />
            {isLoggedIn ? (
              <div 
                className="relative"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button 
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium text-[rgb(var(--color-horizon-green))] bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))] transition-colors cursor-pointer"
                  aria-label="User menu"
                >
                  {username}
                </button>
                {/* Dropdown menu with hover linger */}
                <div 
                  className={`absolute right-0 top-full mt-2 bg-[#3c352b] border border-[#263036] rounded-lg shadow-lg transition-all duration-300 z-50 min-w-[120px] ${
                    showDropdown 
                      ? 'opacity-100 pointer-events-auto' 
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Link
                    href="/profile"
                    className="block w-full px-4 py-2 text-left text-white hover:bg-[#4a4238] transition-colors text-sm rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block w-full px-4 py-2 text-left text-white hover:bg-[#4a4238] transition-colors text-sm border-t border-[#263036]"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-white hover:bg-[#4a4238] transition-colors text-sm border-t border-[#263036]"
                  >
                    Logout
                  </button>
                  {username === 'thenighguy' && (
                    <Link
                      href="/admin"
                      className="block w-full px-4 py-2 text-left text-white hover:bg-[#4a4238] transition-colors text-sm border-t border-[#263036]"
                    >
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown))] transition-colors"
                aria-label="Login to your account"
              >
                <IconProfile />
                Login
              </Link>
            )}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------- sub components ---------------------------- */

function Brand() {
  return (
    <Link href="/" className="shrink-0 hover:bg-[rgb(var(--color-horizon-brown))] transition-colors px-3 py-1.5 rounded-full mr-8" aria-label="Go to homepage">
      <img 
        src="/logo.png" 
        alt="Horizon Radar" 
        width="48" 
        height="48" 
        className="object-contain"
        onError={(e) => {
          console.error('Logo failed to load:', e);
          // Fallback to text if image fails
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling?.remove();
          const fallback = document.createElement('span');
          fallback.textContent = 'Horizon Radar';
          fallback.className = 'font-semibold tracking-tight text-lg';
          e.currentTarget.parentNode?.appendChild(fallback);
        }}
      />
    </Link>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-8">
      {NAV.map((n) => {
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={[
              'text-sm transition-colors text-white px-3 py-1.5 rounded-full',
              active ? 'bg-[rgb(var(--color-horizon-brown))]' : 'hover:bg-[rgb(var(--color-horizon-brown))]'
            ].join(' ')}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SearchBox() {
  const [q, setQ] = useState('');
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    article: Article;
    relevance: number;
    matchedFields: string[];
    highlightedText: string;
  }>>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const active = hover || focus;

  // Advanced search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const localStorageDB = (window as { localStorageDB?: typeof import('@/data/localStorageDB').localStorageDB }).localStorageDB;
      console.log('🔍 Search query:', query);
      console.log('🗄️ localStorageDB available:', !!localStorageDB);
      
      if (!localStorageDB) {
        console.log('❌ localStorageDB not available');
        setIsSearching(false);
        return;
      }

      const articles = localStorageDB.getArticles() || [];
      const results: Array<{
        article: Article;
        relevance: number;
        matchedFields: string[];
        highlightedText: string;
      }> = [];

      // const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

      articles.forEach((article: Article) => {
        let relevance = 0;
        const matchedFields: string[] = [];
        let highlightedText = '';

        // Search in title (highest priority)
        if (article.title && article.title.toLowerCase().includes(query.toLowerCase())) {
          relevance += 100;
          matchedFields.push('title');
          highlightedText = article.title;
        }

        // Search in ticker
        if (article.ticker && article.ticker.toLowerCase().includes(query.toLowerCase())) {
          relevance += 80;
          matchedFields.push('ticker');
          if (!highlightedText) highlightedText = `$${article.ticker}`;
        }

        // Search in team names
        if (article.team) {
          article.team.forEach((member: { name: string; role: string; twitter?: string; linkedin?: string }) => {
            if (member.name && member.name.toLowerCase().includes(query.toLowerCase())) {
              relevance += 60;
              matchedFields.push('team');
              if (!highlightedText) highlightedText = `${member.role}: ${member.name}`;
            }
          });
        }

        // Search in abstract
        if (article.abstract) {
          article.abstract.forEach((text: string) => {
            if (text.toLowerCase().includes(query.toLowerCase())) {
              relevance += 40;
              matchedFields.push('abstract');
              if (!highlightedText) highlightedText = text.substring(0, 100) + '...';
            }
          });
        }

        // Search in tags
        if (article.tags) {
          article.tags.forEach((tag: string) => {
            if (tag.toLowerCase().includes(query.toLowerCase())) {
              relevance += 30;
              matchedFields.push('tags');
              if (!highlightedText) highlightedText = tag;
            }
          });
        }

        // Search in classification and location
        if (article.classification && article.classification.toLowerCase().includes(query.toLowerCase())) {
          relevance += 20;
          matchedFields.push('classification');
          if (!highlightedText) highlightedText = article.classification;
        }

        if (article.location && article.location.toLowerCase().includes(query.toLowerCase())) {
          relevance += 20;
          matchedFields.push('location');
          if (!highlightedText) highlightedText = article.location;
        }

        if (relevance > 0) {
          results.push({
            article,
            relevance,
            matchedFields,
            highlightedText
          });
        }
      });

      // Sort by relevance and limit results
      results.sort((a, b) => b.relevance - a.relevance);
      setSearchResults(results.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const handleSearchChange = (value: string) => {
    setQ(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      const term = q.trim();
      if (term) {
        router.push(`/search?q=${encodeURIComponent(term)}`);
      } else {
        router.push('/search');
      }
      inputRef.current?.blur();
      setShowResults(false);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (article: Article) => {
    router.push(`/article/${article.slug}`);
    setShowResults(false);
    setQ('');
  };

  const handleInputFocus = () => {
    setFocus(true);
    if (q.trim()) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    setFocus(false);
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div
        className={[
          'relative hidden sm:flex items-center rounded-full border',
          'transition-all duration-200',
          active ? 'bg-white border-neutral-300 shadow' : 'bg-[#3c352b] border-transparent',
          active ? 'w-80' : 'w-44',
          'h-9'
        ].join(' ')}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span className="pl-3 pr-1 grid place-items-center">
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <IconSearch className={active ? "text-neutral-400" : "text-white/80"} />
          )}
        </span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={onKeyDown}
          placeholder={active ? "Search Research Database" : "Search"}
          aria-label="Search Research Database"
          className={[
            'peer bg-transparent outline-none w-full placeholder:opacity-60',
            active ? 'text-neutral-800' : 'text-white placeholder:text-white/80'
          ].join(' ')}
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#3c352b] border border-[#263036] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults.map((result, index) => (
            <div
              key={`${result.article.id}-${index}`}
              className="px-4 py-3 hover:bg-[#4a4238] transition-colors cursor-pointer border-b border-[#263036] last:border-b-0"
              onClick={() => handleResultClick(result.article)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-medium text-sm truncate flex-1">
                  {result.article.title}
                </h4>
                {result.article.ticker && (
                  <span className="text-[rgb(var(--color-horizon-green))] text-xs font-medium ml-2">
                    ${result.article.ticker}
                  </span>
                )}
              </div>
              
              <div className="text-xs text-gray-400 mb-1">
                {result.article.publishedAt ? 
                  new Date(result.article.publishedAt).toLocaleDateString() : 
                  'Draft'
                }
              </div>
              
              <div className="text-xs text-white/80 leading-relaxed">
                <HighlightedText 
                  text={result.highlightedText} 
                  searchTerm={q} 
                />
              </div>
            </div>
          ))}
          
          {searchResults.length > 0 && (
            <div className="px-4 py-2 text-center border-t border-[#263036]">
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(q)}`);
                  setShowResults(false);
                }}
                className="text-[rgb(var(--color-horizon-green))] text-xs hover:text-[rgb(var(--color-horizon-green))]/80 transition-colors"
              >
                View all results →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper component to highlight search terms
function HighlightedText({ text, searchTerm }: { text: string; searchTerm: string }) {
  if (!searchTerm.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <span key={index} className="text-orange-400 font-medium">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white/70 hover:bg-white"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <IconMenu />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <span className="font-medium">Menu</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
                <IconClose />
              </button>
            </div>

            <nav className="p-2">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={[
                      'block rounded-md px-3 py-2 text-sm',
                      active ? 'bg-neutral-100 font-medium' : 'hover:bg-neutral-50'
                    ].join(' ')}
                  >
                    {n.label}
                  </Link>
                );
              })}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-md px-3 py-2 text-sm hover:bg-neutral-50"
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

// Simple inline icons - no duplication, no extra files
const IconSearch = ({ className }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}><path d="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" stroke="currentColor" strokeWidth="2" /></svg>;
const IconMenu = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const IconClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const IconProfile = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

