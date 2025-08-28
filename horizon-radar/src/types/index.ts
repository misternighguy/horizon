export interface ProtocolSummary {
  slug: string;
  name: string;
  ticker?: string;
  category: string[];
  chains: string | string[];
  status?: string;
  premium: boolean;
  radarRating?: number;
  growthPotential?: string;
  lastUpdated: string;
}

export interface Protocol extends ProtocolSummary {
  investmentOpportunityText?: string;
  sections?: {
    abstract?: SectionCopy;
    architecture?: SectionCopy;
    mechanics?: {
      deposit?: SectionCopy;
      withdraw?: SectionCopy;
      incentives?: SectionCopy;
      riskEngine?: SectionCopy;
    };
    problemUsersValue?: {
      problem?: SectionCopy;
      users?: SectionCopy;
      value?: SectionCopy;
    };
    tokenomics?: SectionCopy;
    authorSources?: SectionCopy;
    disclaimer?: SectionCopy;
    community?: SectionCopy;
  };
  metricSnapshots?: Array<{
    asOf: string;
    tvl: number;
    volume24h: number;
  }>;
}

export interface SectionCopy {
  novice?: string;
  technical?: string;
  analyst?: string;
}

export type ReadingLevel = 'novice' | 'technical' | 'analyst';

// Article System Types
export interface Article {
  id: string;
  slug: string;
  title: string;
  ticker: string;
  subtitle: string;
  classification: string;
  location: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  readingLevels: ReadingLevel[];
  abstract: string[];
  productArchitecture: {
    sections: string[];
    tags: string[];
  };
  mechanics: string[];
  problemUsersValue: {
    problem: string;
    users: string[];
    approach: string;
    differentiators: string[];
    assumptions: string[];
  };
  team: Array<{
    name: string;
    role: string;
    twitter?: string;
    linkedin?: string;
  }>;
  events: Array<{
    event: string;
    date?: string;
  }>;
  officialLinks: {
    socials: Array<{ platform: string; url: string }>;
    technical: Array<{ type: string; url: string }>;
  };
  ecosystem: string[];
  credentials: string[];
  radarRating: {
    growthPotential: number;
    investmentOpportunity: number;
    memberOpinions: number;
  };
  stats: {
    tvl: string;
    volume: string;
    users: string;
    capital: string;
    opinions: string;
  };
  tokenomics: Array<{
    category: string;
    percentage: number;
    status: 'good' | 'neutral' | 'bad';
  }>;
  content: {
    [key in ReadingLevel]: {
      sections: Array<{
        title: string;
        content: string;
        order: number;
      }>;
    };
  };
  featuredImage?: string;
  interTextImages?: Array<{
    id: string;
    title: string;
    imageUrl: string;
    aspectRatio: string;
    caption?: string;
    width: number;
    height: number;
  }>;
  tableOfContents?: string[];
  tags: string[];
  viewCount: number;
  likeCount: number;
}

// User System Types
export interface User {
  id: string;
  username: string;
  email: string;
  memberStyle: 'free' | 'premium' | 'admin';
  duration: number; // months
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  lastLogin?: Date;
  profile?: {
    avatar?: string; // URL to profile picture
    bio?: string;
    twitter?: string;
    linkedin?: string;
  };
  preferences?: {
    readingLevel: ReadingLevel;
    notifications: boolean;
    newsletter: boolean;
  };
  watchlist?: string[]; // Array of article IDs
}

export interface UserFormData {
  username: string;
  password: string;
  email: string;
  memberStyle: 'free' | 'premium' | 'admin';
  duration: number;
}

export interface ProfileUpdateData {
  avatar?: string;
  bio?: string;
  twitter?: string;
  linkedin?: string;
}

// Comment System Types
export interface Comment {
  id: string;
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  author: string;
  authorId?: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  timestamp: Date;
  replies: Comment[];
  isHidden: boolean;
  isFlagged: boolean;
  isAdmin?: boolean;
  likeCount: number;
  parentId?: string; // for replies
}

export interface CommentFormData {
  content: string;
  replyTo?: string;
}

// Research/Protocol Card Types
export interface ResearchCard {
  id: string;
  title: string;
  description: string;
  growthScore: number;
  opportunityScore: number;
  slug: string;
  bannerImage?: string;
  category: 'recently-published' | 'most-read' | 'trending';
  publishedAt: Date;
  viewCount: number;
  author: string;
  tags: string[];
}

// Database Schema Types
export interface DatabaseSchema {
  articles: Article[];
  users: User[];
  comments: Comment[];
  protocols: Record<string, Protocol>;
  researchCards: ResearchCard[];
  newsletterSubscriptions: NewsletterSubscription[];
  system: {
    lastBackup: Date;
    version: string;
    stats: {
      totalArticles: number;
      totalUsers: number;
      totalComments: number;
      totalProtocols: number;
      totalNewsletterSubscriptions: number;
    };
  };
}

// Newsletter Subscription Types
export interface NewsletterSubscription {
  id: string;
  userId?: string; // nullable for guest subscriptions
  email: string;
  name: string;
  subscribedAt: Date;
  source: 'footer_popout' | 'admin_add';
  status: 'subscribed' | 'unsubscribed';
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ARTICLES: 'horizon_radar_articles',
  USERS: 'horizon_radar_users',
  COMMENTS: 'horizon_radar_comments',
  PROTOCOLS: 'horizon_radar_protocols',
  RESEARCH_CARDS: 'horizon_radar_research_cards',
  NEWSLETTER_SUBSCRIPTIONS: 'horizon_radar_newsletter_subscriptions',
  SYSTEM: 'horizon_radar_system',
  SESSIONS: 'horizon_radar_sessions',
} as const;

export interface LocalStorageDB {
  getArticleBySlug: (slug: string) => Article | null;
  getCommentsByArticle: (slug: string) => Comment[];
  createComment: (commentData: Omit<Comment, 'id' | 'timestamp'>) => Comment;
}

declare global {
  interface Window {
    localStorageDB?: LocalStorageDB;
  }
} 