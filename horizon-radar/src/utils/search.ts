import { Article } from '@/types';

export interface SearchResult {
  article: Article;
  relevance: number;
  matchedFields: string[];
  highlightedText: string;
}

export interface FilterOptions {
  classification: string[];
  location: string[];
  tags: string[];
  dateRange: string;
}

// Optimized search function used by both header and search page
export const performOptimizedSearch = (
  query: string, 
  articles: Article[], 
  filterOpts?: FilterOptions,
  filtersEnabled: boolean = false
): SearchResult[] => {
  if (!query.trim()) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const results: SearchResult[] = [];

  // Early termination for exact matches
  const exactMatches = articles.filter(article => 
    article.title?.toLowerCase() === queryLower ||
    article.ticker?.toLowerCase() === queryLower
  );

  if (exactMatches.length > 0) {
    const exactResults = exactMatches.map(article => ({
      article,
      relevance: 1000, // Highest priority for exact matches
      matchedFields: ['exact'],
      highlightedText: article.title || `$${article.ticker}`
    }));
    return exactResults;
  }

  // Optimized search with early termination
  for (const article of articles) {
    // Apply filters only if filters are enabled by user
    if (filterOpts && filtersEnabled) {
      if (filterOpts.classification.length > 0 && !filterOpts.classification.includes(article.classification)) {
        continue;
      }
      if (filterOpts.location.length > 0 && !filterOpts.location.includes(article.location)) {
        continue;
      }
      if (filterOpts.tags.length > 0 && !filterOpts.tags.some(tag => article.tags?.includes(tag))) {
        continue;
      }
    }

    let relevance = 0;
    const matchedFields: string[] = [];
    let highlightedText = '';

    // Title search (highest priority)
    if (article.title?.toLowerCase().includes(queryLower)) {
      relevance += 100;
      matchedFields.push('title');
      highlightedText = article.title;
    }

    // Ticker search
    if (article.ticker?.toLowerCase().includes(queryLower)) {
      relevance += 80;
      matchedFields.push('ticker');
      if (!highlightedText) highlightedText = `$${article.ticker}`;
    }

    // Early termination if we have a high-relevance match
    if (relevance >= 80) {
      results.push({ article, relevance, matchedFields, highlightedText });
      if (results.length >= 10) break; // Stop early if we have enough high-quality results
      continue;
    }

    // Team names search
    if (article.team) {
      for (const member of article.team) {
        if (member.name?.toLowerCase().includes(queryLower)) {
          relevance += 60;
          matchedFields.push('team');
          if (!highlightedText) highlightedText = `${member.role}: ${member.name}`;
          break; // Found one team member, move on
        }
      }
    }

    // Abstract search (limited to first match)
    if (article.abstract && relevance < 60) {
      for (const text of article.abstract) {
        if (text.toLowerCase().includes(queryLower)) {
          relevance += 40;
          matchedFields.push('abstract');
          if (!highlightedText) highlightedText = text.substring(0, 100) + '...';
          break; // Found one abstract match, move on
        }
      }
    }

    // Tags search
    if (article.tags && relevance < 40) {
      for (const tag of article.tags) {
        if (tag.toLowerCase().includes(queryLower)) {
          relevance += 30;
          matchedFields.push('tags');
          if (!highlightedText) highlightedText = tag;
          break; // Found one tag match, move on
        }
      }
    }

    // Classification and location (lowest priority)
    if (relevance < 30) {
      if (article.classification?.toLowerCase().includes(queryLower)) {
        relevance += 20;
        matchedFields.push('classification');
        if (!highlightedText) highlightedText = article.classification;
      }

      if (article.location?.toLowerCase().includes(queryLower)) {
        relevance += 20;
        matchedFields.push('location');
        if (!highlightedText) highlightedText = article.location;
      }
    }

    if (relevance > 0) {
      results.push({ article, relevance, matchedFields, highlightedText });
      
      // Early termination if we have enough results
      if (results.length >= 20) break;
    }
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);
  
  // Apply date filtering if filters are enabled
  if (filterOpts && filtersEnabled && filterOpts.dateRange !== 'all') {
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
    
    return results.filter(result => {
      const articleDate = new Date(result.article.publishedAt || result.article.createdAt);
      return articleDate >= cutoffDate;
    });
  }

  return results;
};
