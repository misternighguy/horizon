'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Article, ReadingLevel } from '@/types';

interface SearchResult {
  article: Article;
  relevance: number;
  matchedFields: string[];
  highlightedText: string;
}

interface FilterOptions {
  classification: string[];
  location: string[];
  readingLevel: ReadingLevel[];
  tags: string[];
  dateRange: string;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    classification: [],
    location: [],
    readingLevel: [],
    tags: [],
    dateRange: 'all'
  });
  const [availableFilters, setAvailableFilters] = useState<{
    classifications: string[];
    locations: string[];
    tags: string[];
  }>({
    classifications: [],
    locations: [],
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize available filter options
  useEffect(() => {
    try {
      const localStorageDB = (window as { localStorageDB?: typeof import('@/data/localStorageDB').localStorageDB }).localStorageDB;
      if (localStorageDB) {
        const articles = localStorageDB.getArticles() || [];
        
        const classifications = [...new Set(articles.map((a: Article) => a.classification).filter(Boolean))];
        const locations = [...new Set(articles.map((a: Article) => a.location).filter(Boolean))];
        const allTags = articles.flatMap((a: Article) => a.tags || []).filter(Boolean);
        const tags = [...new Set(allTags)];
        
        setAvailableFilters({ classifications, locations, tags });
      }
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  }, []);

  // Perform advanced search
  const performSearch = (query: string, filterOpts: FilterOptions = filters) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const localStorageDB = (window as { localStorageDB?: typeof import('@/data/localStorageDB').localStorageDB }).localStorageDB;
      if (!localStorageDB) return;

      const articles = localStorageDB.getArticles() || [];
      const results: SearchResult[] = [];

      articles.forEach((article: Article) => {
        // Apply filters first
        if (filterOpts.classification.length > 0 && !filterOpts.classification.includes(article.classification)) {
          return;
        }
        if (filterOpts.location.length > 0 && !filterOpts.location.includes(article.location)) {
          return;
        }
        if (filterOpts.readingLevel.length > 0 && !filterOpts.readingLevel.some(level => article.readingLevels.includes(level))) {
          return;
        }
        if (filterOpts.tags.length > 0 && !filterOpts.tags.some(tag => article.tags.includes(tag))) {
          return;
        }

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

      // Sort by relevance and apply date filter
      results.sort((a, b) => b.relevance - a.relevance);
      
      // Apply date filtering
      let filteredResults = results;
      if (filterOpts.dateRange !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (filterOpts.dateRange) {
          case '1week':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '1month':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
          case '3months':
            cutoffDate.setMonth(now.getMonth() - 3);
            break;
          case '6months':
            cutoffDate.setMonth(now.getMonth() - 6);
            break;
          case '1year':
            cutoffDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        filteredResults = results.filter(result => {
          const articleDate = new Date(result.article.publishedAt || result.article.createdAt);
          return articleDate >= cutoffDate;
        });
      }

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterOptions, value: string | string[]) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    if (searchQuery.trim()) {
      performSearch(searchQuery, newFilters);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      classification: [],
      location: [],
      readingLevel: [],
      tags: [],
      dateRange: 'all'
    };
    setFilters(clearedFilters);
    
    if (searchQuery.trim()) {
      performSearch(searchQuery, clearedFilters);
    }
  };

  // Navigate to article
  const handleResultClick = (article: Article) => {
    router.push(`/article/${article.slug}`);
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat"></div>
      <div className="absolute inset-0 z-0 bg-black/20"></div>
      
      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full py-10 space-y-8">
        {/* Hero Section */}
        <section className="space-y-4 text-center">
          <h1 className="text-6xl font-medium drop-shadow-lg">
            <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient">
              Search
            </span>
            <span className="text-white font-light ml-4">Research Database</span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-white/90 drop-shadow-md">
            Advanced search and filtering for crypto research articles, protocols, and insights.
          </p>
        </section>

        {/* Search Interface */}
        <section className="mx-auto max-w-6xl px-4 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center rounded-full border transition-all duration-200 bg-white border-neutral-300 shadow-lg w-full h-12">
              <span className="pl-4 pr-3 grid place-items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-neutral-400">
                  <path d="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search for projects, tickers, team members, keywords..."
                className="bg-transparent outline-none w-full placeholder:opacity-60 text-neutral-800 text-lg"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white bg-[rgb(var(--color-horizon-brown))] hover:bg-[rgb(var(--color-horizon-brown-dark))] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" stroke="currentColor" strokeWidth="2" />
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Classification */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Classification</label>
                  <select
                    multiple
                    value={filters.classification}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange('classification', values);
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    {availableFilters.classifications.map(classification => (
                      <option key={classification} value={classification} className="bg-[#3c352b] text-white">
                        {classification}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                  <select
                    multiple
                    value={filters.location}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange('location', values);
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    {availableFilters.locations.map(location => (
                      <option key={location} value={location} className="bg-[#3c352b] text-white">
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reading Level */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Reading Level</label>
                  <select
                    multiple
                    value={filters.readingLevel}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange('readingLevel', values);
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="beginner" className="bg-[#3c352b] text-white">Beginner</option>
                    <option value="intermediate" className="bg-[#3c352b] text-white">Intermediate</option>
                    <option value="advanced" className="bg-[#3c352b] text-white">Advanced</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="all" className="bg-[#3c352b] text-white">All Time</option>
                    <option value="1week" className="bg-[#3c352b] text-white">Last Week</option>
                    <option value="1month" className="bg-[#3c352b] text-white">Last Month</option>
                    <option value="3months" className="bg-[#3c352b] text-white">Last 3 Months</option>
                    <option value="6months" className="bg-[#3c352b] text-white">Last 6 Months</option>
                    <option value="1year" className="bg-[#3c352b] text-white">Last Year</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-6 text-center">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-4">
            {isSearching && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--color-horizon-green))]"></div>
                <p className="mt-2 text-white/60">Searching...</p>
              </div>
            )}

            {!isSearching && searchQuery && (
              <div className="text-center py-4">
                <p className="text-white/80">
                  Found <span className="text-[rgb(var(--color-horizon-green))] font-medium">{searchResults.length}</span> results
                  {filters.classification.length > 0 || filters.location.length > 0 || filters.readingLevel.length > 0 || filters.tags.length > 0 || filters.dateRange !== 'all' ? ' with filters applied' : ''}
                </p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.article.id}-${index}`}
                    className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    onClick={() => handleResultClick(result.article)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-medium text-white flex-1">
                        {result.article.title}
                      </h3>
                      {result.article.ticker && (
                        <span className="text-[rgb(var(--color-horizon-green))] text-lg font-medium ml-4">
                          ${result.article.ticker}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                      <span>{result.article.classification}</span>
                      <span>•</span>
                      <span>{result.article.location}</span>
                      <span>•</span>
                      <span>{result.article.publishedAt ? new Date(result.article.publishedAt).toLocaleDateString() : 'Draft'}</span>
                      <span>•</span>
                      <span>Relevance: {result.relevance}</span>
                    </div>
                    
                    <div className="text-white/80 leading-relaxed">
                      <HighlightedText 
                        text={result.highlightedText} 
                        searchTerm={searchQuery} 
                      />
                    </div>

                    {/* Matched Fields */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.matchedFields.map(field => (
                        <span
                          key={field}
                          className="px-2 py-1 text-xs bg-[rgb(var(--color-horizon-green))]/20 text-[rgb(var(--color-horizon-green))] rounded-full"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                <p className="text-white/60 mb-4">Try adjusting your search terms or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-[rgb(var(--color-horizon-green))] hover:text-[rgb(var(--color-horizon-green))]/80 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Loading Search...</h1>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
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
