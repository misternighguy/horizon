'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { UI_CONSTANTS } from '@/constants/ui';
import { Article } from '@/types';
import { Icons } from '@/components/ui/Icons';
import { performOptimizedSearch, SearchResult } from '@/utils/search';

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: '/about', label: 'About' },
  { href: '/premium', label: 'Premium' },
  { href: '/research', label: 'Research' },
  { href: '/request', label: 'Request' },
  { href: '/watchlist', label: 'Watchlist' }
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > UI_CONSTANTS.SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Check for existing login sessions
    const adminSession = localStorage.getItem('adminSession')
    const userSession = localStorage.getItem('userSession')
    
    if (adminSession || userSession) {
      setIsLoggedIn(true)
      setUsername(adminSession || userSession || '')
      
      // Check if user is admin by looking up their role in the database
      try {
        const localStorageDB = (window as { localStorageDB?: any }).localStorageDB;
        if (localStorageDB) {
          const username = adminSession || userSession;
          const user = localStorageDB.getUserByUsername(username);
          if (user && user.memberStyle === 'admin') {
            setIsAdmin(true);
          }
          if (user?.profile?.avatar) {
            setUserAvatar(user.profile.avatar);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
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
    // Clear sessions
    localStorage.removeItem('adminSession')
    localStorage.removeItem('userSession')
    
    // Reset state
    setIsLoggedIn(false)
    setUsername('')
    
    // Redirect to home page
    window.location.href = '/'
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
    }, 300); // Reduced delay for better UX
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
           {/* Left side - Logo (hidden on mobile) and Menu button (mobile only) */}
           <div className="flex items-center gap-4">
             {/* Mobile Menu Button - Left side on mobile */}
             <div className="md:hidden">
               <MobileMenu />
             </div>
             
             {/* Logo - Hidden on mobile, visible on desktop */}
             <div className="hidden md:block">
               <Brand />
             </div>
             
             {/* Desktop Navigation - Hidden on mobile */}
             <div className="hidden md:block">
               <DesktopNav />
             </div>
           </div>
           
           {/* Right side - Search, Login/User, Desktop Menu */}
           <div className="flex items-center gap-5">
             {/* Search - Hidden on mobile, visible on desktop */}
             <div className="hidden md:block">
               <SearchBox />
             </div>
             
             {/* Login/User section */}
             {isLoggedIn ? (
               <div 
                 className="relative"
                 onMouseEnter={handleDropdownEnter}
                 onMouseLeave={handleDropdownLeave}
               >
                 <button 
                   className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium text-[rgb(var(--color-horizon-green))] bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))] transition-colors cursor-pointer"
                   aria-label="User menu"
                   onClick={() => setShowDropdown(!showDropdown)}
                 >
                   {userAvatar ? (
                     <img
                       src={userAvatar}
                       alt={`${username}'s profile picture`}
                       className="w-6 h-6 rounded-full object-cover"
                     />
                   ) : (
                     <div className="w-6 h-6 bg-[rgb(var(--color-horizon-green))] rounded-full flex items-center justify-center text-xs font-bold text-black">
                       {username.charAt(0).toUpperCase()}
                     </div>
                   )}
                   <span>{username}</span>
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
                     href="/watchlist"
                     className="block w-full px-4 py-2 text-left text-white hover:bg-[#4a4238] transition-colors text-sm border-t border-[#263036]"
                   >
                     Watchlist
                   </Link>
                   <button
                     onClick={handleLogout}
                     className="w-full px-4 py-2 text-left text-white hover:bg-[#4a4238] transition-colors text-sm border-t border-[#263036]"
                   >
                     Logout
                   </button>
                   {isAdmin && (
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
                 <Icons.Profile />
                 Login
               </Link>
             )}
             
             {/* Mobile Search Button - Right side on mobile */}
             <div className="md:hidden">
               <MobileSearchButton />
             </div>
             
             {/* Desktop Menu Button - Hidden on mobile */}
             <div className="hidden md:block">
               <MobileMenu />
             </div>
           </div>
         </div>
       </div>
    </header>
  );
}

/* ---------------------------- sub components ---------------------------- */

function Brand() {
  return (
    <Link href="/" className="shrink-0 hover:bg-[rgb(var(--color-horizon-brown))] transition-colors px-3 py-1.5 rounded-full mr-8 flex items-center justify-center" aria-label="Go to homepage">
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
  
  // Separate state for loading animation that runs continuously
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);

  const active = hover || focus;

  // Use shared optimized search function
  const performSearch = (query: string) => {
    try {
      const localStorageDB = (window as { localStorageDB?: typeof import('@/data/localStorageDB').localStorageDB }).localStorageDB;
      console.log('🔍 Search query:', query);
      console.log('🗄️ localStorageDB available:', !!localStorageDB);
      
      if (!localStorageDB) {
        console.log('❌ localStorageDB not available');
        return;
      }

      const articles = localStorageDB.getArticles() || [];
      const results = performOptimizedSearch(query, articles);
      
      // Limit to 5 results for header dropdown
      const limitedResults = results.slice(0, 5);
      setSearchResults(limitedResults);
      
      console.log('🔍 Search completed:', {
        query,
        totalResults: results.length,
        limitedResults: limitedResults.length,
        results: limitedResults.map(r => r.article.title)
      });
      
      // Always hide loading animation after search completes
      setShowLoadingAnimation(false);
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
    
    // Show loading animation immediately when typing
    if (value.trim()) {
      setShowLoadingAnimation(true);
      setIsSearching(true);
    } else {
      setShowLoadingAnimation(false);
      setIsSearching(false);
      setSearchResults([]);
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 150); // Reduced from 300ms to 150ms for faster response
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
  
  // Hide loading animation and show results when they're available
  useEffect(() => {
    if (searchResults.length > 0) {
      setShowLoadingAnimation(false);
      setShowResults(true);
    } else if (q.trim() && !isSearching) {
      // Show "no results" message after search completes
      setShowLoadingAnimation(false);
      setShowResults(true);
    } else if (q.trim()) {
      setShowResults(false);
    }
  }, [searchResults, q, isSearching]);

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
          <Icons.Search className={active ? "text-neutral-400" : "text-white/80"} />
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
            'peer bg-transparent outline-none w-full placeholder:opacity-60 pr-10',
            active ? 'text-neutral-800' : 'text-white placeholder:text-white/80'
          ].join(' ')}
        />
        {/* Loading indicator on the right side */}
        {q.trim() && showLoadingAnimation && (
          <span className="absolute right-3 grid place-items-center">
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-pulse-glow"></div>
          </span>
        )}
      </div>

      {/* Search Results Dropdown */}
      {q.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#3c352b] border border-[#263036] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <div className="mb-3 flex justify-center">
                <Icons.Search className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60 text-sm mb-2">No search results found</p>
              <p className="text-white/40 text-xs mb-4">Try different keywords or check spelling</p>
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(q)}`);
                  setShowResults(false);
                }}
                className="px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black text-xs font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
              >
                Use Advanced Search
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
           className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
           aria-label="Open menu"
           onClick={() => setOpen(true)}
         >
           <Icons.Menu />
         </button>

       {open && (
         <div
           role="dialog"
           aria-modal="true"
           className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm"
           onClick={() => setOpen(false)}
           style={{ zIndex: 99999 }}
         >
           <div
             className="absolute left-0 top-0 h-full w-80 bg-[#3c352b] shadow-xl border-r border-[#263036]"
             onClick={(e) => e.stopPropagation()}
             style={{ zIndex: 99999 }}
           >
             <div className="flex items-center justify-between p-4 border-b border-[#263036]">
               <span className="font-medium text-white text-lg">Menu</span>
               <button 
                 aria-label="Close menu" 
                 onClick={() => setOpen(false)} 
                 className="p-2 rounded-md hover:bg-[#4a4238] transition-colors"
               >
                 <span className="text-white">
                   <Icons.Close />
                 </span>
               </button>
             </div>

             <nav className="p-4 space-y-3">
               {/* Home link - First option */}
               <Link
                 href="/"
                 onClick={() => setOpen(false)}
                 className={[
                   'flex items-center gap-3 rounded-md px-4 py-3 text-base transition-colors',
                   pathname === '/' ? 'bg-[#4a4238] font-medium text-white' : 'text-white/80 hover:bg-[#4a4238] hover:text-white'
                 ].join(' ')}
               >
                 <Icons.Home />
                 Home
               </Link>
               
               {NAV.map((n) => {
                 const active = pathname === n.href;
                 return (
                   <Link
                     key={n.href}
                     href={n.href}
                     onClick={() => setOpen(false)}
                     className={[
                       'flex items-center gap-3 rounded-md px-4 py-3 text-base transition-colors',
                       active ? 'bg-[#4a4238] font-medium text-white' : 'text-white/80 hover:bg-[#4a4238] hover:text-white'
                     ].join(' ')}
                   >
                     {n.href === '/about' && <Icons.Info />}
                     {n.href === '/premium' && <Icons.Shield />}
                     {n.href === '/research' && <Icons.Grid />}
                     {n.href === '/request' && <Icons.Users />}
                     {n.href === '/watchlist' && <Icons.Eye />}
                     {n.label}
                   </Link>
                 );
               })}
               
               {/* Search link for mobile */}
               <Link
                 href="/search"
                 onClick={() => setOpen(false)}
                 className="flex items-center gap-3 rounded-md px-4 py-3 text-base text-white/80 hover:bg-[#4a4238] hover:text-white transition-colors"
               >
                 <Icons.Search />
                 Search
               </Link>
               
               <Link
                 href="/login"
                 onClick={() => setOpen(false)}
                 className="mt-4 flex items-center gap-3 rounded-md px-4 py-3 text-base text-white/80 hover:bg-[#4a4238] hover:text-white transition-colors"
               >
                 <Icons.Profile />
                 Login
               </Link>
             </nav>
           </div>
         </div>
       )}
    </>
  );
}

function MobileSearchButton() {
  const router = useRouter();
  
  return (
    <button
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
      aria-label="Open search"
      onClick={() => {
        // On mobile, redirect to search page instead of showing dropdown
        router.push('/search');
      }}
    >
      <Icons.Search />
    </button>
  );
}



