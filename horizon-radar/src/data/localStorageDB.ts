import { 
  DatabaseSchema, 
  Article, 
  User, 
  Comment, 
  Protocol, 
  ProtocolSummary,
  ResearchCard,
  ResearchRequest,
  NewsletterSubscription,
  STORAGE_KEYS
} from '@/types';

class LocalStorageDB {
  private static instance: LocalStorageDB;
  
  private constructor() {
    this.initializeDatabase();
  }

  public static getInstance(): LocalStorageDB {
    if (!LocalStorageDB.instance) {
      LocalStorageDB.instance = new LocalStorageDB();
    }
    return LocalStorageDB.instance;
  }

  // Initialize database with mock data if empty
  private initializeDatabase(): void {
    if (typeof window === 'undefined') return; // SSR check

    // Check if database already exists
    const existingSystem = localStorage.getItem(STORAGE_KEYS.SYSTEM);
    if (existingSystem) return;

    console.log('Initializing Horizon Radar Local Database...');
    
    // Initialize with comprehensive mock data
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize Articles
    const mockArticles: Article[] = [
      {
        id: '1',
        slug: 'glw',
        title: 'Glow Protocol',
        ticker: 'GLW',
        subtitle: 'Powering incentives to build real-world solar infrastructure through bitcoin-styled tokenomics.',
        classification: 'Decentralized Infrastructure',
        location: 'Ethereum',
        status: 'published',
        publishedAt: new Date('2024-12-01'),
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-12-01'),
        author: 'Horizon Research Team',
        readingLevels: ['novice', 'technical', 'analyst'],
        abstract: [
          'Glow Protocol represents a novel approach to financing renewable energy infrastructure through decentralized tokenomics. By leveraging blockchain technology and smart contracts, the protocol creates a sustainable incentive structure that aligns stakeholders across the solar energy value chain.',
          'The project introduces innovative mechanisms for token distribution, governance, and revenue sharing that mirror successful models from the Bitcoin ecosystem while addressing the specific needs of renewable energy financing.'
        ],
        productArchitecture: {
          sections: [
            'AMM/CLOB hybrid trading system for solar-backed tokens',
            'Dynamic fee model with revenue sharing to token holders',
            'Oracle network for real-time solar production data',
            'Cross-chain bridge support for multi-chain deployment',
            'Upgradeable smart contracts with governance controls',
            'High-performance settlement with sub-second finality',
            'External dependencies on weather APIs and energy markets'
          ],
          tags: ['Decentralized Infrastructure', 'Real-World Assets', 'Solar Finance']
        },
        mechanics: [
          'Deposit solar project tokens to earn yield from energy sales',
          'Withdraw tokens anytime with accumulated rewards',
          'Swap between different solar project tokens',
          'Trade solar futures and energy derivatives',
          'Earn incentives for providing liquidity',
          'Risk engine with automated circuit breakers',
          'MEV protection through fair ordering'
        ],
        problemUsersValue: {
          problem: 'Traditional solar infrastructure financing is fragmented, illiquid, and inaccessible to retail investors. Large capital requirements and long payback periods create barriers to entry.',
          users: ['Solar project developers', 'Institutional investors', 'Retail investors', 'Energy companies', 'Government entities'],
          approach: 'Tokenize solar projects and create liquid markets for renewable energy investments',
          differentiators: ['First-mover in solar tokenization', 'Bitcoin-style tokenomics', 'Real-time oracle integration', 'Cross-chain interoperability'],
          assumptions: ['Solar energy demand continues growing', 'Regulatory environment remains favorable', 'Blockchain adoption increases']
        },
        team: [
          { name: 'Dr. Sarah Chen', role: 'CEO & Co-founder', twitter: 'https://twitter.com/sarahchen', linkedin: 'https://linkedin.com/in/sarahchen' },
          { name: 'Marcus Rodriguez', role: 'CTO & Co-founder', twitter: 'https://twitter.com/marcusrod', linkedin: 'https://linkedin.com/in/marcusrod' },
          { name: 'Alex Thompson', role: 'Head of Research', twitter: 'https://twitter.com/alexthompson', linkedin: 'https://linkedin.com/in/alexthompson' }
        ],
        events: [
          { event: 'Testnet Launch', date: 'Q2 2024' },
          { event: 'Chain Launch', date: 'Q3 2024' },
          { event: 'Capital Raise', date: 'Q4 2024' },
          { event: 'Product Launch', date: 'Q1 2025' }
        ],
        officialLinks: {
          socials: [
            { platform: 'Twitter', url: 'https://twitter.com/glowprotocol' },
            { platform: 'Discord', url: 'https://discord.gg/glow' },
            { platform: 'Telegram', url: 'https://t.me/glowprotocol' },
            { platform: 'Website', url: 'https://glowprotocol.com' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/company/glowprotocol' }
          ],
          technical: [
            { type: 'Whitepaper', url: 'https://docs.glowprotocol.com/whitepaper' },
            { type: 'Contract Address', url: 'https://etherscan.io/address/0x...' },
            { type: 'Chart', url: 'https://dexscreener.com/ethereum/0x...' }
          ]
        },
        ecosystem: ['Ethereum', 'Polygon', 'Arbitrum', 'Uniswap', 'SushiSwap'],
        credentials: [
          'Backed by top-tier VCs including a16z and Paradigm',
          'Partnerships with major solar energy companies',
          'Regulatory compliance in key jurisdictions',
          'Academic research collaboration with MIT'
        ],
        radarRating: {
          growthPotential: 85,
          investmentOpportunity: 78,
          memberOpinions: 92
        },
        stats: {
          tvl: '$12.5M',
          volume: '$820K',
          users: '2.4K',
          capital: '$8.2M',
          opinions: '156'
        },
        tokenomics: [
          { category: 'Community Rewards', percentage: 40, status: 'good' },
          { category: 'Team & Advisors', percentage: 20, status: 'neutral' },
          { category: 'Development Fund', percentage: 25, status: 'good' },
          { category: 'Treasury', percentage: 15, status: 'neutral' }
        ],
        content: {
          novice: {
            sections: [
              {
                title: 'What is Glow Protocol?',
                content: 'Glow Protocol is a blockchain platform that helps fund solar energy projects by allowing people to invest in them using cryptocurrency. Think of it as a way to support green energy while potentially earning returns.',
                order: 1
              },
              {
                title: 'How does it work?',
                content: 'Users can buy tokens that represent ownership in solar projects. These projects generate electricity and revenue, which gets distributed back to token holders. The more solar energy produced, the more valuable the tokens become.',
                order: 2
              }
            ]
          },
          technical: {
            sections: [
              {
                title: 'Technical Architecture',
                content: 'The protocol uses smart contracts on Ethereum to manage token issuance, trading, and reward distribution. It integrates with real-time oracles to track solar production data and automatically adjusts rewards based on performance.',
                order: 1
              },
              {
                title: 'Tokenomics Model',
                content: 'GLW tokens follow a Bitcoin-style emission schedule with halving events. 40% goes to community rewards, 25% to development, 20% to team (with vesting), and 15% to treasury for future growth.',
                order: 2
              }
            ]
          },
          analyst: {
            sections: [
              {
                title: 'Mechanism Design',
                content: 'The protocol implements a sophisticated incentive structure using game theory principles. Staking mechanisms, liquidity mining, and governance tokens create aligned incentives between developers, investors, and users.',
                order: 1
              },
              {
                title: 'Risk Management',
                content: 'Advanced risk models account for weather variability, regulatory changes, and market volatility. Circuit breakers and insurance pools protect against extreme events while maintaining protocol stability.',
                order: 2
              }
            ]
          }
        },
        featuredImage: '/images/GlowBanner.png',
        tags: ['Solar Energy', 'DeFi', 'RWA', 'Sustainability', 'Tokenomics'],
        viewCount: 1247,
        likeCount: 89
      },
      {
        id: '2',
        slug: 'solar-xyz',
        title: 'SolarXYZ',
        ticker: 'SLR',
        subtitle: 'Decentralized solar infrastructure powered by blockchain incentives.',
        classification: 'DeFi Protocol',
        location: 'Ethereum, Base',
        status: 'published',
        publishedAt: new Date('2024-11-20'),
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-20'),
        author: 'Horizon Research Team',
        readingLevels: ['novice', 'technical', 'analyst'],
        abstract: [
          'SolarXYZ enables retail investors to fund real-world solar projects with crypto rewards.',
          'The protocol channels capital into solar infrastructure with bitcoin-style incentives.'
        ],
        productArchitecture: {
          sections: [
            'On-chain contracts hold capital',
            'Off-chain oracles track solar output',
            'Cross-chain settlement via messaging bridge'
          ],
          tags: ['DeFi', 'Real-World Assets', 'Solar Finance']
        },
        mechanics: [
          'Deposit tokens to earn SLR rewards',
          'Withdraw anytime with accumulated rewards',
          'Stake for additional yield',
          'Governance participation'
        ],
        problemUsersValue: {
          problem: 'Green energy needs funding and retail investors lack access to solar projects.',
          users: ['Retail investors', 'Solar operators', 'Yield seekers'],
          approach: 'Tokenize solar projects and create liquid markets',
          differentiators: ['First-mover advantage', 'Bitcoin-style tokenomics'],
          assumptions: ['Solar demand grows', 'Regulatory support continues']
        },
        team: [
          { name: 'Solar Team', role: 'Core Team', twitter: 'https://twitter.com/solarxyz' }
        ],
        events: [
          { event: 'Mainnet Launch', date: 'Q3 2024' }
        ],
        officialLinks: {
          socials: [
            { platform: 'Twitter', url: 'https://twitter.com/solarxyz' }
          ],
          technical: [
            { type: 'Website', url: 'https://solarxyz.com' }
          ]
        },
        ecosystem: ['Ethereum', 'Base'],
        credentials: [
          'Backed by major VCs',
          'Partnerships with solar companies'
        ],
        radarRating: {
          growthPotential: 78,
          investmentOpportunity: 72,
          memberOpinions: 85
        },
        stats: {
          tvl: '$8.2M',
          volume: '$450K',
          users: '1.8K',
          capital: '$5.1M',
          opinions: '98'
        },
        tokenomics: [
          { category: 'Community', percentage: 50, status: 'good' },
          { category: 'Team', percentage: 20, status: 'neutral' },
          { category: 'Development', percentage: 30, status: 'good' }
        ],
        content: {
          novice: {
            sections: [
              {
                title: 'Introduction',
                content: 'SolarXYZ makes it easy to invest in solar energy projects.',
                order: 1
              }
            ]
          },
          technical: {
            sections: [
              {
                title: 'Technical Overview',
                content: 'Smart contracts manage deposits and rewards distribution.',
                order: 1
              }
            ]
          },
          analyst: {
            sections: [
              {
                title: 'Deep Dive',
                content: 'Advanced mechanism design with cross-chain capabilities.',
                order: 1
              }
            ]
          }
        },
        tags: ['Solar', 'DeFi', 'Infrastructure'],
        viewCount: 892,
        likeCount: 67
      }
    ];

    // Initialize Users
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'thenighguy',
        email: 'admin@horizonradar.com',
        memberStyle: 'admin',
        duration: 12,
        createdAt: new Date('2024-01-01'),
        expiresAt: new Date('2025-01-01'),
        isActive: true,
        lastLogin: new Date(),
        profile: {
          avatar: '/images/default-avatar.svg',
          bio: 'Horizon Radar Administrator',
          twitter: 'https://twitter.com/thenighguy',
          linkedin: ''
        },
        preferences: {
          readingLevel: 'analyst',
          notifications: true,
          newsletter: false
        }
      },
      {
        id: '2',
        username: 'john_doe',
        email: 'john@example.com',
        memberStyle: 'premium',
        duration: 6,
        createdAt: new Date('2024-12-01'),
        expiresAt: new Date('2025-06-01'),
        isActive: true,
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
        profile: {
          avatar: '/images/default-avatar.svg',
          bio: '',
          twitter: '',
          linkedin: ''
        },
        preferences: {
          readingLevel: 'technical',
          notifications: true,
          newsletter: true
        }
      },
      {
        id: '3',
        username: 'alice_smith',
        email: 'alice@example.com',
        memberStyle: 'free',
        duration: 1,
        createdAt: new Date('2024-12-15'),
        expiresAt: new Date('2025-01-15'),
        isActive: true,
        lastLogin: new Date(Date.now() - 48 * 60 * 60 * 1000),
        profile: {
          avatar: '/images/default-avatar.svg',
          bio: '',
          twitter: '',
          linkedin: ''
        },
        preferences: {
          readingLevel: 'novice',
          notifications: false,
          newsletter: true
        }
      },
      {
        id: '4',
        username: 'test_user',
        email: 'test@gmail.com',
        memberStyle: 'free',
        duration: 1,
        createdAt: new Date('2024-12-20'),
        expiresAt: new Date('2025-01-20'),
        isActive: true,
        lastLogin: new Date(),
        profile: {
          avatar: '/images/default-avatar.svg',
          bio: '',
          twitter: '',
          linkedin: ''
        },
        preferences: {
          readingLevel: 'novice',
          notifications: true,
          newsletter: false
        }
      }
    ];

    // Initialize Comments
    const mockComments: Comment[] = [
      {
        id: '1',
        articleId: '1',
        articleSlug: 'glw',
        articleTitle: 'Glow Protocol ($GLW)',
        author: 'John Doe',
        authorId: '2',
        authorInitials: 'JD',
        authorColor: '#95EC6E',
        content: 'This is a really interesting take on solar infrastructure tokenization. The Bitcoin-style tokenomics approach could work well for renewable energy projects.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        replies: [
          {
            id: '1-1',
            articleId: '1',
            articleSlug: 'glw',
            articleTitle: 'Glow Protocol ($GLW)',
            author: 'Admin',
            authorId: '1',
            authorInitials: 'A',
            authorColor: '#FFB34D',
            content: 'Great observation! The Bitcoin model provides excellent incentives for long-term holding.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            replies: [],
            isHidden: false,
            isFlagged: false,
            isAdmin: true,
            likeCount: 3,
            parentId: '1'
          }
        ],
        isHidden: false,
        isFlagged: false,
        likeCount: 7,
        parentId: undefined
      },
      {
        id: '2',
        articleId: '1',
        articleSlug: 'glw',
        articleTitle: 'Glow Protocol ($GLW)',
        author: 'Alice Smith',
        authorId: '3',
        authorInitials: 'AS',
        authorColor: '#FFB34D',
        content: 'I\'m curious about the regulatory compliance aspects. How does this work across different jurisdictions?',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        replies: [],
        isHidden: false,
        isFlagged: true,
        likeCount: 2,
        parentId: undefined
      }
    ];

    // Initialize Research Cards
    const mockResearchCards: ResearchCard[] = [
      {
        id: 'glw-card',
        title: 'Glow Protocol ($GLW)',
        description: 'Powering incentives to build solar infra through bitcoin-styled tokenomics.',
        growthScore: 7.8,
        opportunityScore: 7.8,
        slug: 'glw',
        category: 'recently-published',
        publishedAt: new Date('2024-12-01'),
        viewCount: 1247,
        author: 'Horizon Research Team',
        tags: ['Solar Energy', 'DeFi', 'RWA']
      },
      {
        id: 'solar-xyz-card',
        title: 'SolarXYZ',
        description: 'Decentralized solar infrastructure powered by blockchain incentives.',
        growthScore: 9.9,
        opportunityScore: 8.2,
        slug: 'solar-xyz',
        category: 'most-read',
        publishedAt: new Date('2024-11-20'),
        viewCount: 892,
        author: 'Horizon Research Team',
        tags: ['Solar', 'DeFi', 'Infrastructure']
      },
      {
        id: 'green-chain-card',
        title: 'GreenChain',
        description: 'Sustainable blockchain solutions for renewable energy markets.',
        growthScore: 8.5,
        opportunityScore: 7.9,
        slug: 'green-chain',
        category: 'trending',
        publishedAt: new Date('2024-11-10'),
        viewCount: 1567,
        author: 'Horizon Research Team',
        tags: ['Sustainability', 'Blockchain', 'Energy']
      }
    ];

    // Initialize Protocols (legacy support)
    const mockProtocols: Record<string, Protocol> = {
      solarxyz: {
        slug: 'solarxyz',
        name: 'SolarXYZ',
        ticker: 'SLR',
        category: ['DeFi', 'Real-World Assets'],
        chains: ['Ethereum', 'Base'],
        status: 'Mainnet',
        premium: false,
        radarRating: 78,
        growthPotential: 'Medium-High',
        lastUpdated: '2025-08-01',
        investmentOpportunityText: 'Compelling if RWA execution continues; see risks.',
        sections: {
          abstract: {
            novice: 'SolarXYZ enables retail to fund real-world solar projects with crypto rewards.',
            technical: 'SolarXYZ channels capital into solar infra with bitcoin-style incentives.',
            analyst: 'Mechanism design mirrors UTXO-era issuance; collateralized RWAs back yield streams.',
          },
                      architecture: {
              novice: 'On-chain contracts hold capital; off-chain oracles track solar output.',
              technical: 'Core contracts manage deposits, rewards; oracles feed production data.',
              analyst: 'UUPS proxies for upgradeability; cross-chain settlement via messaging bridge.',
            },
          mechanics: {
            deposit: {
              novice: 'Users deposit tokens.',
              technical: 'LP deposits accrue rewards.',
              analyst: 'AMM routing + staking adapters.',
            },
            withdraw: {
              novice: 'Users can withdraw anytime.',
              technical: 'Fees may apply.',
              analyst: 'Timelocks protect liquidity shocks.',
            },
            incentives: {
              novice: 'Earn SLR tokens.',
              technical: 'Rewards decay over time.',
              analyst: 'Emissions curve matches growth targets.',
            },
            riskEngine: {
              novice: 'Risks are monitored.',
              technical: 'Oracle failures handled.',
              analyst: 'Circuit breakers & TWA oracles.',
            },
          },
          problemUsersValue: {
            problem: {
              novice: 'Green energy needs funding.',
              technical: 'Capex heavy infra underfunded.',
              analyst: 'Fragmented financing & volatility.',
            },
            users: {
              novice: 'Retail and solar operators.',
              technical: 'Yield seekers & providers.',
              analyst: 'Creditworthy operators + DeFi LPs.',
            },
            value: {
              novice: 'Simple yield from solar.',
              technical: 'Transparent metrics.',
              analyst: 'Capital-efficient RWA on-chain exposures.',
            },
          },
          tokenomics: {
            novice: 'SLR rewards early users.',
            technical: 'Vesting and cliffs protect long-term holders.',
            analyst: 'Allocation: Team 20% (48m, 12m cliff); Emissions decay; fee buybacks.',
          },
          authorSources: {
            novice: 'Compiled from docs & dashboards.',
            technical: 'Citations with timestamps.',
            analyst: 'Snapshot block recorded for metrics.',
          },
          disclaimer: {
            novice: 'Not financial advice.',
            technical: 'Use at your own risk.',
            analyst: 'Methodology notes & caveats available.',
          },
          community: {
            novice: 'Member ratings coming soon.',
            technical: 'Bull/Bear theses stubs.',
            analyst: 'Opinion data stored separately.',
          },
        },
        metricSnapshots: [
          {
            asOf: '2025-08-01',
            tvl: 12500000,
            volume24h: 820000,
          },
        ],
      },
      oraclia: {
        slug: 'oraclia',
        name: 'Oraclia',
        category: ['Oracle'],
        chains: ['Arbitrum'],
        premium: true,
        lastUpdated: '2025-07-15',
        radarRating: 85,
        growthPotential: 'High',
        investmentOpportunityText: 'Strong oracle infrastructure play.',
      },
      dexterm: {
        slug: 'dexterm',
        name: 'DEXTerm',
        category: ['Trading Terminal'],
        chains: ['Web App'],
        premium: false,
        lastUpdated: '2025-08-10',
        radarRating: 72,
        growthPotential: 'Medium',
        investmentOpportunityText: 'Competitive trading terminal market.',
      }
    };

    // Initialize System
    const system = {
      lastBackup: new Date(),
      version: '1.0.0',
      stats: {
        totalArticles: mockArticles.length,
        totalUsers: mockUsers.length,
        totalComments: mockComments.length,
        totalProtocols: Object.keys(mockProtocols).length
      }
    };

    // Save to localStorage
    this.saveToStorage(STORAGE_KEYS.ARTICLES, mockArticles);
    this.saveToStorage(STORAGE_KEYS.USERS, mockUsers);
    this.saveToStorage(STORAGE_KEYS.COMMENTS, mockComments);
    this.saveToStorage(STORAGE_KEYS.RESEARCH_CARDS, mockResearchCards);
    this.saveToStorage(STORAGE_KEYS.PROTOCOLS, mockProtocols);
    this.saveToStorage(STORAGE_KEYS.SYSTEM, system);

    console.log('✅ Horizon Radar Local Database initialized successfully!');
  }

  // Generic storage methods
  private saveToStorage<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data, this.dateReplacer));
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error);
    }
  }

  private getFromStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item, this.dateReviver) : null;
    } catch (error) {
      console.error(`Failed to read from localStorage (${key}):`, error);
      return null;
    }
  }

  // Date serialization helpers
  private dateReplacer(key: string, value: unknown): unknown {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  private dateReviver(key: string, value: unknown): unknown {
    if (value && typeof value === 'object' && value !== null && '__type' in value && value.__type === 'Date' && 'value' in value) {
      return new Date(value.value as string);
    }
    return value;
  }

  // Article CRUD Operations
  public getArticles(): Article[] {
    return this.getFromStorage<Article[]>(STORAGE_KEYS.ARTICLES) || [];
  }

  public getArticleBySlug(slug: string): Article | null {
    const articles = this.getArticles();
    return articles.find(article => article.slug === slug) || null;
  }

  public createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article {
    const articles = this.getArticles();
    
    // Ensure article has required stats structure
    const articleWithStats = {
      ...article,
      stats: article.stats || {
        tvl: '$0',
        volume: '$0',
        users: '0',
        capital: '$0',
        opinions: '0'
      }
    };
    
    const newArticle: Article = {
      ...articleWithStats,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    articles.unshift(newArticle);
    this.saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    this.updateSystemStats();
    
    return newArticle;
  }

  public updateArticle(id: string, updates: Partial<Article>): Article | null {
    const articles = this.getArticles();
    const index = articles.findIndex(article => article.id === id);
    
    if (index === -1) return null;
    
    // Ensure stats structure is maintained
    const updatedArticle = {
      ...articles[index],
      ...updates,
      stats: {
        ...articles[index].stats,
        ...(updates.stats || {})
      },
      updatedAt: new Date()
    };
    
    articles[index] = updatedArticle;
    this.saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    this.updateSystemStats();
    
    return articles[index];
  }

  public deleteArticle(id: string): boolean {
    const articles = this.getArticles();
    const filtered = articles.filter(article => article.id !== id);
    
    if (filtered.length === articles.length) return false;
    
    this.saveToStorage(STORAGE_KEYS.ARTICLES, filtered);
    this.updateSystemStats();
    
    return true;
  }

  // User CRUD Operations
  public getUsers(): User[] {
    return this.getFromStorage<User[]>(STORAGE_KEYS.USERS) || [];
  }

  public getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  public getUserByUsername(username: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.username === username) || null;
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt' | 'expiresAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + userData.duration * 30 * 24 * 60 * 60 * 1000),
              profile: {
          avatar: '/images/default-avatar.svg',
          bio: '',
          twitter: '',
          linkedin: '',
          ...userData.profile
        },
      preferences: {
        readingLevel: 'novice',
        notifications: true,
        newsletter: false,
        ...userData.preferences
      }
    };
    
    users.unshift(newUser);
    this.saveToStorage(STORAGE_KEYS.USERS, users);
    this.updateSystemStats();
    
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...updates,
      ...(updates.duration && {
        expiresAt: new Date(Date.now() + updates.duration * 30 * 24 * 60 * 60 * 1000)
      })
    };
    
    this.saveToStorage(STORAGE_KEYS.USERS, users);
    this.updateSystemStats();
    
    return users[index];
  }

  public updateUserProfile(id: string, profileUpdates: Partial<User['profile']>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;
    
    const user = users[index];
    const updatedProfile = { ...user.profile, ...profileUpdates };
    const updatedUser = { ...user, profile: updatedProfile };
    
    users[index] = updatedUser;
    this.saveToStorage(STORAGE_KEYS.USERS, users);
    this.updateSystemStats();
    
    return updatedUser;
  }

  public deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter(user => user.id !== id);
    
    if (filtered.length === users.length) return false;
    
    this.saveToStorage(STORAGE_KEYS.USERS, filtered);
    this.updateSystemStats();
    
    return true;
  }

  // Comment CRUD Operations
  public getComments(): Comment[] {
    return this.getFromStorage<Comment[]>(STORAGE_KEYS.COMMENTS) || [];
  }

  public getCommentsByArticle(articleSlug: string): Comment[] {
    const comments = this.getComments();
    return comments.filter(comment => comment.articleSlug === articleSlug);
  }

  public createComment(commentData: Omit<Comment, 'id' | 'timestamp' | 'likeCount'>): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      timestamp: new Date(),
      likeCount: 0
    };
    
    comments.unshift(newComment);
    this.saveToStorage(STORAGE_KEYS.COMMENTS, comments);
    this.updateSystemStats();
    
    return newComment;
  }

  public updateComment(id: string, updates: Partial<Comment>): Comment | null {
    const comments = this.getComments();
    const index = comments.findIndex(comment => comment.id === id);
    
    if (index === -1) return null;
    
    comments[index] = {
      ...comments[index],
      ...updates
    };
    
    this.saveToStorage(STORAGE_KEYS.COMMENTS, comments);
    this.updateSystemStats();
    
    return comments[index];
  }

  public deleteComment(id: string): boolean {
    const comments = this.getComments();
    const filtered = comments.filter(comment => comment.id !== id);
    
    if (filtered.length === comments.length) return false;
    
    this.saveToStorage(STORAGE_KEYS.COMMENTS, filtered);
    this.updateSystemStats();
    
    return true;
  }

  // Research Cards Operations
  public getResearchCards(): ResearchCard[] {
    return this.getFromStorage<ResearchCard[]>(STORAGE_KEYS.RESEARCH_CARDS) || [];
  }

  public getResearchCardsByCategory(category: ResearchCard['category']): ResearchCard[] {
    // Get articles and convert them to research cards with banner images
    const articles = this.getArticles();
    const researchCards: ResearchCard[] = articles.map(article => ({
      id: `${article.slug}-card`,
      title: article.title,
      description: article.subtitle || 'No description available',
      growthScore: 7.5, // Default score, can be enhanced later
      opportunityScore: 7.5, // Default score, can be enhanced later
      slug: article.slug,
      bannerImage: article.featuredImage, // Use the article's featured image
      category: 'recently-published' as ResearchCard['category'], // Default category
      publishedAt: article.publishedAt || new Date(),
      viewCount: 0, // Default view count
      author: article.author,
      tags: article.productArchitecture?.tags || []
    }));
    
    // Filter by category if specified
    if (category) {
      return researchCards.filter(card => card.category === category);
    }
    
    return researchCards;
  }

  // Protocol Operations
  public getProtocols(): Record<string, Protocol> {
    return this.getFromStorage<Record<string, Protocol>>(STORAGE_KEYS.PROTOCOLS) || {};
  }

  public getProtocolBySlug(slug: string): Protocol | null {
    const protocols = this.getProtocols();
    return protocols[slug] || null;
  }

  // Newsletter Operations
  public getNewsletterSubscriptions(): NewsletterSubscription[] {
    return this.getFromStorage<NewsletterSubscription[]>(STORAGE_KEYS.NEWSLETTER_SUBSCRIPTIONS) || [];
  }

  public createNewsletterSubscription(subscription: Omit<NewsletterSubscription, 'id' | 'subscribedAt'>): NewsletterSubscription {
    const subscriptions = this.getNewsletterSubscriptions();
    const newSubscription: NewsletterSubscription = {
      ...subscription,
      id: Date.now().toString(),
      subscribedAt: new Date()
    };
    
    subscriptions.unshift(newSubscription);
    this.saveToStorage(STORAGE_KEYS.NEWSLETTER_SUBSCRIPTIONS, subscriptions);
    this.updateSystemStats();
    
    return newSubscription;
  }

  public updateNewsletterSubscription(id: string, updates: Partial<NewsletterSubscription>): NewsletterSubscription | null {
    const subscriptions = this.getNewsletterSubscriptions();
    const index = subscriptions.findIndex(sub => sub.id === id);
    
    if (index === -1) return null;
    
    subscriptions[index] = {
      ...subscriptions[index],
      ...updates
    };
    
    this.saveToStorage(STORAGE_KEYS.NEWSLETTER_SUBSCRIPTIONS, subscriptions);
    this.updateSystemStats();
    
    return subscriptions[index];
  }

  public getNewsletterSubscriptionByEmail(email: string): NewsletterSubscription | null {
    const subscriptions = this.getNewsletterSubscriptions();
    return subscriptions.find(sub => sub.email === email) || null;
  }

  // System Operations
  public getSystemStats() {
    return this.getFromStorage<DatabaseSchema['system']>(STORAGE_KEYS.SYSTEM);
  }

  private updateSystemStats(): void {
    const articles = this.getArticles();
    const users = this.getUsers();
    const comments = this.getComments();
    const protocols = this.getFromStorage<Record<string, Protocol>>(STORAGE_KEYS.PROTOCOLS) || {};
    const newsletterSubscriptions = this.getNewsletterSubscriptions();
    
    const system: DatabaseSchema['system'] = {
      lastBackup: new Date(),
      version: '1.0.0',
      stats: {
        totalArticles: articles.length,
        totalUsers: users.length,
        totalComments: comments.length,
        totalProtocols: Object.keys(protocols).length,
        totalResearchRequests: 0,
        totalNewsletterSubscriptions: newsletterSubscriptions.length
      }
    };
    
    this.saveToStorage(STORAGE_KEYS.SYSTEM, system);
  }

  // Utility Methods
  public exportDatabase(): DatabaseSchema {
    const systemStats = this.getSystemStats();
    return {
      articles: this.getArticles(),
      users: this.getUsers(),
      comments: this.getComments(),
      protocols: this.getFromStorage<Record<string, Protocol>>(STORAGE_KEYS.PROTOCOLS) || {},
      researchCards: this.getResearchCards(),
      researchRequests: this.getResearchRequests(),
      newsletterSubscriptions: this.getNewsletterSubscriptions(),
      system: systemStats || {
        lastBackup: new Date(),
        version: '1.0.0',
        stats: { totalArticles: 0, totalUsers: 0, totalComments: 0, totalProtocols: 0, totalResearchRequests: 0, totalNewsletterSubscriptions: 0 }
      }
    };
  }

  public clearDatabase(): void {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🗑️ Horizon Radar Local Database cleared');
  }

  public forceReinitialize(): void {
    if (typeof window === 'undefined') return;
    
    console.log('🔄 Force reinitializing Horizon Radar Local Database...');
    this.clearDatabase();
    this.initializeMockData();
    console.log('✅ Database reinitialized with updated data');
  }

  public backupDatabase(): string {
    const data = this.exportDatabase();
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data
    };
    
    return JSON.stringify(backup, null, 2);
  }

  public restoreFromBackup(backupData: string): boolean {
    try {
      const backup = JSON.parse(backupData);
      if (!backup.data || !backup.timestamp) {
        throw new Error('Invalid backup format');
      }
      
      // Restore all data
      Object.entries(backup.data).forEach(([key, value]) => {
        if (key in STORAGE_KEYS) {
          this.saveToStorage(key, value);
        }
      });
      
      console.log('✅ Database restored from backup:', backup.timestamp);
      return true;
    } catch (error) {
      console.error('Failed to restore database:', error);
      return false;
    }
  }

  // Research Request Methods
  public getResearchRequests(): ResearchRequest[] {
    return this.getFromStorage<ResearchRequest[]>(STORAGE_KEYS.RESEARCH_REQUESTS) || [];
  }

  public createResearchRequest(requestData: Omit<ResearchRequest, 'id' | 'submittedAt'>): ResearchRequest {
    const requests = this.getResearchRequests();
    const newRequest: ResearchRequest = {
      ...requestData,
      id: Date.now().toString(),
      submittedAt: new Date()
    };
    
    requests.push(newRequest);
    this.saveToStorage(STORAGE_KEYS.RESEARCH_REQUESTS, requests);
    return newRequest;
  }

  public updateResearchRequest(id: string, updates: Partial<ResearchRequest>): ResearchRequest | null {
    const requests = this.getResearchRequests();
    const index = requests.findIndex(req => req.id === id);
    
    if (index === -1) return null;
    
    requests[index] = { ...requests[index], ...updates };
    this.saveToStorage(STORAGE_KEYS.RESEARCH_REQUESTS, requests);
    return requests[index];
  }

  public deleteResearchRequest(id: string): boolean {
    const requests = this.getResearchRequests();
    const filteredRequests = requests.filter(req => req.id !== id);
    
    if (filteredRequests.length === requests.length) return false;
    
    this.saveToStorage(STORAGE_KEYS.RESEARCH_REQUESTS, filteredRequests);
    return true;
  }

  // Convert Articles to ProtocolSummaries for landing page
  public getProtocolSummaries(): ProtocolSummary[] {
    const articles = this.getArticles();
    return articles.map(article => {
      // Handle updatedAt which might be a Date object or string from localStorage
      let lastUpdated: string;
      const updatedAt = article.updatedAt as any; // Type assertion to handle localStorage serialization
      
      if (updatedAt instanceof Date) {
        lastUpdated = updatedAt.toISOString().split('T')[0];
      } else if (typeof updatedAt === 'string') {
        lastUpdated = updatedAt.split('T')[0];
      } else {
        // Fallback to current date if updatedAt is invalid
        lastUpdated = new Date().toISOString().split('T')[0];
      }

      return {
        slug: article.slug,
        name: article.title,
        ticker: article.ticker,
        category: [article.classification],
        chains: article.location,
        status: article.status === 'published' ? 'Mainnet' : 'Development',
        premium: false, // Default to false, can be enhanced later
        radarRating: Math.round((article.radarRating.growthPotential + article.radarRating.investmentOpportunity) / 2),
        lastUpdated
      };
    });
  }
}

// Export singleton instance
export const localStorageDB = LocalStorageDB.getInstance();

// Export types for convenience
export type { LocalStorageDB };
