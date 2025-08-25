'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  ticker: string;
  category: string[];
  chains: string[];
  status: string;
  premium: boolean;
  radarRating?: number;
  lastUpdated: string;
  excerpt: string;
  author: string;
  readTime: string;
}

const mockBlogArticles: BlogArticle[] = [
  {
    id: '1',
    slug: 'uniswap-v4-revolution',
    title: 'Uniswap V4: The Future of Decentralized Trading',
    ticker: 'UNI',
    category: ['DeFi', 'DEX', 'Trading'],
    chains: ['Ethereum', 'Polygon', 'Arbitrum'],
    status: 'Mainnet',
    premium: false,
    radarRating: 92,
    lastUpdated: '2025-01-24',
    excerpt: 'Uniswap V4 introduces revolutionary features including hooks, native ETH support, and improved capital efficiency that could reshape the entire DeFi landscape.',
    author: 'Horizon Research Team',
    readTime: '8 min read'
  },
  {
    id: '2',
    slug: 'ethereum-pos-analysis',
    title: 'Ethereum Proof-of-Stake: A Deep Dive into the Merge',
    ticker: 'ETH',
    category: ['Layer 1', 'PoS', 'Infrastructure'],
    chains: ['Ethereum'],
    status: 'Mainnet',
    premium: true,
    radarRating: 95,
    lastUpdated: '2025-01-22',
    excerpt: 'Comprehensive analysis of Ethereum\'s transition to Proof-of-Stake, examining the technical implications, economic benefits, and future roadmap.',
    author: 'Dr. Sarah Chen',
    readTime: '12 min read'
  },
  {
    id: '3',
    slug: 'arbitrum-ecosystem-growth',
    title: 'Arbitrum Ecosystem: The Layer 2 Revolution Continues',
    ticker: 'ARB',
    category: ['Layer 2', 'Scaling', 'Ecosystem'],
    chains: ['Arbitrum', 'Ethereum'],
    status: 'Mainnet',
    premium: false,
    radarRating: 88,
    lastUpdated: '2025-01-20',
    excerpt: 'Exploring Arbitrum\'s rapid ecosystem growth, innovative projects, and the competitive advantages that make it a leading Layer 2 solution.',
    author: 'Marcus Rodriguez',
    readTime: '10 min read'
  },
  {
    id: '4',
    slug: 'solana-performance-analysis',
    title: 'Solana: Performance vs. Reliability Trade-offs',
    ticker: 'SOL',
    category: ['Layer 1', 'High Performance', 'Blockchain'],
    chains: ['Solana'],
    status: 'Mainnet',
    premium: true,
    radarRating: 78,
    lastUpdated: '2025-01-18',
    excerpt: 'Critical analysis of Solana\'s performance characteristics, network stability issues, and the trade-offs between speed and decentralization.',
    author: 'Alex Thompson',
    readTime: '15 min read'
  },
  {
    id: '5',
    slug: 'polygon-zk-evolution',
    title: 'Polygon ZK: Zero-Knowledge Scaling Solutions',
    ticker: 'MATIC',
    category: ['Layer 2', 'ZK-Rollups', 'Scaling'],
    chains: ['Polygon', 'Ethereum'],
    status: 'Mainnet',
    premium: false,
    radarRating: 85,
    lastUpdated: '2025-01-16',
    excerpt: 'Deep dive into Polygon\'s zero-knowledge rollup solutions, examining the technology, implementation challenges, and competitive positioning.',
    author: 'Dr. Elena Petrova',
    readTime: '11 min read'
  },
  {
    id: '6',
    slug: 'cosmos-interoperability',
    title: 'Cosmos: The Internet of Blockchains',
    ticker: 'ATOM',
    category: ['Interoperability', 'Cosmos SDK', 'Multi-chain'],
    chains: ['Cosmos Hub', 'Terra', 'Osmosis'],
    status: 'Mainnet',
    premium: false,
    radarRating: 82,
    lastUpdated: '2025-01-14',
    excerpt: 'Comprehensive overview of the Cosmos ecosystem, its interoperability solutions, and the vision for a connected blockchain future.',
    author: 'James Wilson',
    readTime: '9 min read'
  },
  {
    id: '7',
    slug: 'avalanche-subnet-architecture',
    title: 'Avalanche Subnets: Customizable Blockchain Networks',
    ticker: 'AVAX',
    category: ['Layer 1', 'Subnets', 'Customization'],
    chains: ['Avalanche C-Chain', 'Avalanche X-Chain'],
    status: 'Mainnet',
    premium: true,
    radarRating: 80,
    lastUpdated: '2025-01-12',
    excerpt: 'Technical deep dive into Avalanche\'s subnet architecture, exploring how organizations can create custom blockchain networks.',
    author: 'Dr. Michael Chang',
    readTime: '13 min read'
  },
  {
    id: '8',
    slug: 'polkadot-parachain-ecosystem',
    title: 'Polkadot Parachains: Building the Multi-Chain Future',
    ticker: 'DOT',
    category: ['Parachains', 'Interoperability', 'Governance'],
    chains: ['Polkadot', 'Kusama'],
    status: 'Mainnet',
    premium: false,
    radarRating: 87,
    lastUpdated: '2025-01-10',
    excerpt: 'Analysis of Polkadot\'s parachain ecosystem, governance mechanisms, and the competitive landscape of cross-chain solutions.',
    author: 'Lisa Park',
    readTime: '14 min read'
  },
  {
    id: '9',
    slug: 'chainlink-oracle-network',
    title: 'Chainlink: The Oracle Network Powering DeFi',
    ticker: 'LINK',
    category: ['Oracles', 'DeFi', 'Infrastructure'],
    chains: ['Ethereum', 'Polygon', 'BSC'],
    status: 'Mainnet',
    premium: false,
    radarRating: 90,
    lastUpdated: '2025-01-08',
    excerpt: 'Comprehensive analysis of Chainlink\'s oracle network, examining its role in DeFi, security features, and market dominance.',
    author: 'Robert Kim',
    readTime: '10 min read'
  },
  {
    id: '10',
    slug: 'filecoin-storage-economy',
    title: 'Filecoin: Decentralized Storage Economics',
    ticker: 'FIL',
    category: ['Storage', 'Web3', 'Infrastructure'],
    chains: ['Filecoin', 'Ethereum'],
    status: 'Mainnet',
    premium: true,
    radarRating: 75,
    lastUpdated: '2025-01-06',
    excerpt: 'Deep dive into Filecoin\'s decentralized storage economy, examining the tokenomics, network incentives, and competitive landscape.',
    author: 'Dr. Amanda Foster',
    readTime: '16 min read'
  }
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const categories = ['all', ...Array.from(new Set(mockBlogArticles.flatMap(article => article.category)))];
  
  const filteredArticles = mockBlogArticles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.ticker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else if (sortBy === 'rating') {
        return (b.radarRating || 0) - (a.radarRating || 0);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-light mb-6">
            <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
              Research
            </span>
            <span className="text-white font-light ml-4">Insights</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Deep-dive analysis of blockchain protocols, DeFi projects, and emerging technologies in the crypto ecosystem.
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article key={article.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group">
              {/* Article Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {article.premium && (
                      <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
                        PREMIUM
                      </span>
                    )}
                    <span className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-white/60 text-xs">
                      {article.status}
                    </span>
                  </div>
                  {article.radarRating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-white/60">Rating:</span>
                      <span className="text-[rgb(var(--color-horizon-green))] font-medium">{article.radarRating}</span>
                    </div>
                  )}
                </div>

                {/* Title and Ticker */}
                <h2 className="text-xl font-medium mb-2 group-hover:text-[rgb(var(--color-horizon-green))] transition-colors">
                  {article.title}
                </h2>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-[rgb(var(--color-horizon-green))] font-medium">{article.ticker}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60 text-sm">{article.readTime}</span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-white/60 text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Excerpt */}
                <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/50">
                    By {article.author}
                  </div>
                  <div className="text-sm text-white/50">
                    {new Date(article.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Read More Button */}
              <div className="px-6 pb-6">
                <Link
                  href={`/blog/${article.slug}`}
                  className="w-full py-3 px-4 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300 text-center block group-hover:scale-105 transform"
                >
                  Read Article
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No articles found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
