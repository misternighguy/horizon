import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, pgEnum, smallint, numeric, date } from 'drizzle-orm/pg-core';

// Enums
export const memberStyleEnum = pgEnum('member_style', ['free', 'premium', 'admin']);
export const articleStatusEnum = pgEnum('article_status', ['draft', 'published', 'archived']);
export const readingLevelEnum = pgEnum('reading_level', ['novice', 'technical', 'analyst']);
export const tokenomicsStatusEnum = pgEnum('tokenomics_status', ['good', 'neutral', 'bad']);
export const researchRequestTypeEnum = pgEnum('research_request_type', ['informal', 'formal']);
export const researchRequestStatusEnum = pgEnum('research_request_status', ['new', 'worth_considering', 'unworthy', 'completed']);
export const newsletterSourceEnum = pgEnum('newsletter_source', ['footer_popout', 'admin_add']);
export const newsletterStatusEnum = pgEnum('newsletter_status', ['subscribed', 'unsubscribed']);
export const researchCardCategoryEnum = pgEnum('research_card_category', ['recently-published', 'most-read', 'trending']);
export const eventTypeEnum = pgEnum('event_type', ['testnet', 'mainnet', 'raise', 'product_launch', 'chain_launch', 'audit', 'other']);
export const linkGroupEnum = pgEnum('link_group', ['social', 'technical']);
export const newsletterStatusActiveEnum = pgEnum('newsletter_status_active', ['active', 'unsubscribed']);
export const researchRequestStatusNewEnum = pgEnum('research_request_status_new', ['new', 'triaged', 'in_progress', 'published', 'rejected']);
export const protocolSectionKeyEnum = pgEnum('protocol_section_key', [
  'abstract', 'architecture', 'mechanics.deposit', 'mechanics.withdraw', 'mechanics.incentives', 
  'mechanics.riskEngine', 'problemUsersValue.problem', 'problemUsersValue.users', 'problemUsersValue.value', 
  'tokenomics', 'authorSources', 'disclaimer', 'community'
]);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  memberStyle: memberStyleEnum('member_style').notNull().default('free'),
  duration: integer('duration').notNull().default(1), // months
  durationMonths: integer('duration_months').notNull().default(1), // Added field
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  lastLogin: timestamp('last_login'),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// User profiles
export const userProfiles = pgTable('user_profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  avatar: varchar('avatar', { length: 500 }),
  avatarUrl: varchar('avatar_url', { length: 500 }), // Added field
  bio: text('bio'),
  twitter: varchar('twitter', { length: 255 }),
  twitterUrl: varchar('twitter_url', { length: 255 }), // Added field
  linkedin: varchar('linkedin', { length: 255 }),
  linkedinUrl: varchar('linkedin_url', { length: 255 }), // Added field
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// User preferences
export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  readingLevel: readingLevelEnum('reading_level').notNull().default('novice'),
  notifications: boolean('notifications').notNull().default(true),
  newsletter: boolean('newsletter').notNull().default(false),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Articles table
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  ticker: varchar('ticker', { length: 20 }),
  subtitle: text('subtitle'),
  classification: varchar('classification', { length: 100 }),
  location: varchar('location', { length: 100 }),
  status: articleStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(), // Added field
  updatedAt: timestamp('updated_at').notNull().defaultNow(), // Added field
  author: varchar('author', { length: 100 }).notNull(),
  featuredImage: varchar('featured_image', { length: 500 }),
  viewCount: integer('view_count').notNull().default(0),
  likeCount: integer('like_count').notNull().default(0),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Tags table
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article tags junction table
export const articleTags = pgTable('article_tags', {
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: { name: 'article_tags_pk', columns: [table.articleId, table.tagId] },
}));

// Article reading levels
export const articleReadingLevels = pgTable('article_reading_levels', {
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  readingLevel: readingLevelEnum('reading_level').notNull(),
  level: readingLevelEnum('level').notNull(), // Added field
}, (table) => ({
  pk: { name: 'article_reading_levels_pk', columns: [table.articleId, table.readingLevel] },
}));

// Article abstracts
export const articleAbstracts = pgTable('article_abstracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  text: text('text').notNull(), // Added field
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article product architecture sections
export const articleArchitectureSections = pgTable('article_architecture_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  text: text('text').notNull(), // Added field
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Product architecture tags map
export const productArchitectureTagsMap = pgTable('product_architecture_tags_map', {
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: { name: 'product_architecture_tags_map_pk', columns: [table.articleId, table.tagId] },
}));

// Article mechanics
export const articleMechanics = pgTable('article_mechanics', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  text: text('text').notNull(), // Added field
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article team members
export const articleTeamMembers = pgTable('article_team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(),
  twitter: varchar('twitter', { length: 255 }),
  twitterUrl: varchar('twitter_url', { length: 255 }), // Added field
  linkedin: varchar('linkedin', { length: 255 }),
  linkedinUrl: varchar('linkedin_url', { length: 255 }), // Added field
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article events
export const articleEvents = pgTable('article_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  eventName: varchar('event_name', { length: 255 }).notNull(),
  eventDate: varchar('event_date', { length: 50 }),
  type: eventTypeEnum('type').notNull().default('other'), // Added field
  title: varchar('title', { length: 255 }).notNull(), // Added field
  dateText: varchar('date_text', { length: 50 }).notNull(), // Added field
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article official links
export const articleOfficialLinks = pgTable('article_official_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  linkType: varchar('link_type', { length: 20 }).notNull(), // 'social' or 'technical'
  platform: varchar('platform', { length: 50 }),
  url: varchar('url', { length: 500 }).notNull(),
  group: linkGroupEnum('group').notNull().default('social'), // Added field
  kind: varchar('kind', { length: 100 }).notNull(), // Added field
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article ecosystem
export const articleEcosystem = pgTable('article_ecosystem', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  ecosystemItem: varchar('ecosystem_item', { length: 100 }).notNull(),
  label: varchar('label', { length: 100 }).notNull(), // Added field
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article credentials
export const articleCredentials = pgTable('article_credentials', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  credential: text('credential').notNull(),
  text: text('text').notNull(), // Added field
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article tokenomics
export const articleTokenomics = pgTable('article_tokenomics', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(),
  percentage: integer('percentage').notNull(),
  status: tokenomicsStatusEnum('status').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Tokenomics allocations (new table)
export const tokenomicsAllocations = pgTable('tokenomics_allocations', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(),
  percentage: numeric('percentage', { precision: 5, scale: 2 }).notNull(),
  status: tokenomicsStatusEnum('status').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article content sections (by reading level)
export const articleContentSections = pgTable('article_content_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  readingLevel: readingLevelEnum('reading_level').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article inter-text images
export const articleImages = pgTable('article_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  aspectRatio: varchar('aspect_ratio', { length: 20 }),
  caption: text('caption'),
  width: integer('width'),
  height: integer('height'),
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article table of contents
export const articleTableOfContents = pgTable('article_table_of_contents', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  content: varchar('content', { length: 255 }).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article radar ratings
export const articleRadarRatings = pgTable('article_radar_ratings', {
  articleId: uuid('article_id').primaryKey().references(() => articles.id, { onDelete: 'cascade' }),
  growthPotential: integer('growth_potential').notNull(),
  investmentOpportunity: integer('investment_opportunity').notNull(),
  memberOpinions: integer('member_opinions').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Article stats
export const articleStats = pgTable('article_stats', {
  articleId: uuid('article_id').primaryKey().references(() => articles.id, { onDelete: 'cascade' }),
  tvl: varchar('tvl', { length: 50 }),
  volume: varchar('volume', { length: 50 }),
  users: varchar('users', { length: 50 }),
  capital: varchar('capital', { length: 50 }),
  opinions: varchar('opinions', { length: 50 }),
  tvlText: varchar('tvl_text', { length: 50 }), // Added field
  volumeText: varchar('volume_text', { length: 50 }), // Added field
  usersText: varchar('users_text', { length: 50 }), // Added field
  capitalText: varchar('capital_text', { length: 50 }), // Added field
  opinionsText: varchar('opinions_text', { length: 50 }), // Added field
  tvlUsd: numeric('tvl_usd', { precision: 20, scale: 2 }), // Added field
  volumeUsd: numeric('volume_usd', { precision: 20, scale: 2 }), // Added field
  usersCount: integer('users_count'), // Added field
  capitalRaisedUsd: numeric('capital_raised_usd', { precision: 20, scale: 2 }), // Added field
  opinionsCount: integer('opinions_count'), // Added field
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Article problem users value (new table)
export const articleProblemUsersValue = pgTable('article_problem_users_value', {
  articleId: uuid('article_id').primaryKey().references(() => articles.id, { onDelete: 'cascade' }),
  problem: text('problem').notNull(),
  approach: text('approach').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article PUV users (new table)
export const articlePuvUsers = pgTable('article_puv_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  userLabel: varchar('user_label', { length: 255 }).notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article PUV differentiators (new table)
export const articlePuvDifferentiators = pgTable('article_puv_differentiators', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  differentiator: text('differentiator').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Article PUV assumptions (new table)
export const articlePuvAssumptions = pgTable('article_puv_assumptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  assumption: text('assumption').notNull(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Comments table - using a different approach to avoid self-reference issues
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  articleSlug: varchar('article_slug', { length: 100 }).notNull(),
  articleTitle: varchar('article_title', { length: 255 }).notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
  authorInitials: varchar('author_initials', { length: 10 }).notNull(),
  authorColor: varchar('author_color', { length: 7 }).notNull(), // hex color
  content: text('content').notNull(),
  parentId: uuid('parent_id'), // Will be handled in application logic
  authorName: varchar('author_name', { length: 100 }), // Added field
  isHidden: boolean('is_hidden').notNull().default(false),
  isFlagged: boolean('is_flagged').notNull().default(false),
  isAdmin: boolean('is_admin').notNull().default(false),
  likeCount: integer('like_count').notNull().default(0),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Research cards
export const researchCards = pgTable('research_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  growthScore: decimal('growth_score', { precision: 3, scale: 1 }),
  opportunityScore: decimal('opportunity_score', { precision: 3, scale: 1 }),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  bannerImage: varchar('banner_image', { length: 500 }),
  category: researchCardCategoryEnum('category').notNull(),
  publishedAt: timestamp('published_at'),
  viewCount: integer('view_count').notNull().default(0),
  author: varchar('author', { length: 100 }).notNull(),
  authorText: varchar('author_text', { length: 100 }).notNull(), // Added field
  articleId: uuid('article_id').references(() => articles.id, { onDelete: 'set null' }), // Added field
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Research card tags
export const researchCardTags = pgTable('research_card_tags', {
  researchCardId: uuid('research_card_id').notNull().references(() => researchCards.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: { name: 'research_card_tags_pk', columns: [table.researchCardId, table.tagId] },
}));

// Research card tags map (new table)
export const researchCardTagsMap = pgTable('research_card_tags_map', {
  cardId: uuid('card_id').notNull().references(() => researchCards.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: { name: 'research_card_tags_map_pk', columns: [table.cardId, table.tagId] },
}));

// Research requests
export const researchRequests = pgTable('research_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: researchRequestTypeEnum('type').notNull(),
  projectName: varchar('project_name', { length: 255 }).notNull(),
  website: varchar('website', { length: 500 }),
  twitter: varchar('twitter', { length: 255 }),
  docsLink: varchar('docs_link', { length: 500 }),
  helpfulLink1: varchar('helpful_link1', { length: 500 }),
  helpfulLink2: varchar('helpful_link2', { length: 500 }),
  notes: text('notes'),
  contractAddress: varchar('contract_address', { length: 255 }),
  chain: varchar('chain', { length: 100 }),
  category: varchar('category', { length: 100 }),
  problemStatement: text('problem_statement'),
  keyRisks: text('key_risks'),
  docsLinks: text('docs_links'),
  submittedBy: uuid('submitted_by').references(() => users.id, { onDelete: 'set null' }),
  status: researchRequestStatusEnum('status').notNull().default('new'),
  email: varchar('email', { length: 255 }).notNull(), // Added field
  topic: varchar('topic', { length: 255 }).notNull(), // Added field
  details: text('details').notNull(), // Added field
  priority: smallint('priority').notNull().default(0), // Added field
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Newsletter subscriptions
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  source: newsletterSourceEnum('source').notNull().default('footer_popout'),
  status: newsletterStatusEnum('status').notNull().default('subscribed'),
  sourceText: varchar('source_text', { length: 100 }), // Added field
  subscribedAt: timestamp('subscribed_at').notNull().defaultNow(), // Added field
  unsubscribedAt: timestamp('unsubscribed_at'), // Added field
  statusActive: newsletterStatusActiveEnum('status_active').notNull().default('active'), // Added field
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Protocols
export const protocols = pgTable('protocols', {
  slug: varchar('slug', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ticker: varchar('ticker', { length: 20 }),
  status: varchar('status', { length: 100 }),
  premium: boolean('premium').notNull().default(false),
  radarRating: integer('radar_rating'),
  growthPotential: varchar('growth_potential', { length: 50 }),
  lastUpdated: timestamp('last_updated'),
  investmentOpportunityText: text('investment_opportunity_text'),
  id: uuid('id').defaultRandom(), // Added field
  lastUpdatedDate: date('last_updated_date'), // Added field
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// Protocol categories
export const protocolCategories = pgTable('protocol_categories', {
  protocolSlug: varchar('protocol_slug', { length: 100 }).notNull().references(() => protocols.slug, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(),
}, (table) => ({
  pk: { name: 'protocol_categories_pk', columns: [table.protocolSlug, table.category] },
}));

// Protocol categories (new table)
export const protocolCategoriesNew = pgTable('protocol_categories_new', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Protocol category map (new table)
export const protocolCategoryMap = pgTable('protocol_category_map', {
  protocolId: uuid('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => protocolCategoriesNew.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: { name: 'protocol_category_map_pk', columns: [table.protocolId, table.categoryId] },
}));

// Protocol chains
export const protocolChains = pgTable('protocol_chains', {
  protocolSlug: varchar('protocol_slug', { length: 100 }).notNull().references(() => protocols.slug, { onDelete: 'cascade' }),
  chain: varchar('chain', { length: 100 }).notNull(),
}, (table) => ({
  pk: { name: 'protocol_chains_pk', columns: [table.protocolSlug, table.chain] },
}));

// Chains (new table)
export const chains = pgTable('chains', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Protocol chain map (new table)
export const protocolChainMap = pgTable('protocol_chain_map', {
  protocolId: uuid('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  chainId: uuid('chain_id').notNull().references(() => chains.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: { name: 'protocol_chain_map_pk', columns: [table.protocolId, table.chainId] },
}));

// Protocol metric snapshots
export const protocolMetricSnapshots = pgTable('protocol_metric_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  protocolSlug: varchar('protocol_slug', { length: 100 }).notNull().references(() => protocols.slug, { onDelete: 'cascade' }),
  asOf: timestamp('as_of').notNull(),
  tvl: integer('tvl'),
  volume24h: integer('volume_24h'),
  protocolId: uuid('protocol_id').references(() => protocols.id, { onDelete: 'cascade' }), // Added field
  asOfDate: date('as_of_date').notNull(), // Added field
  tvlUsd: numeric('tvl_usd', { precision: 20, scale: 2 }), // Added field
  volume24hUsd: numeric('volume_24h_usd', { precision: 20, scale: 2 }), // Added field
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Protocol section copies (new table)
export const protocolSectionCopies = pgTable('protocol_section_copies', {
  id: uuid('id').primaryKey().defaultRandom(),
  protocolId: uuid('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  sectionKey: protocolSectionKeyEnum('section_key').notNull(),
  readingLevel: readingLevelEnum('reading_level').notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),
  orderIndex: integer('order_index').notNull().default(1),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// System stats
export const systemStats = pgTable('system_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  totalArticles: integer('total_articles').notNull().default(0),
  totalUsers: integer('total_users').notNull().default(0),
  totalComments: integer('total_comments').notNull().default(0),
  totalProtocols: integer('total_protocols').notNull().default(0),
  totalResearchRequests: integer('total_research_requests').notNull().default(0),
  totalNewsletterSubscriptions: integer('total_newsletter_subscriptions').notNull().default(0),
  lastBackup: timestamp('last_backup').notNull().defaultNow(),
  version: varchar('version', { length: 20 }).notNull().default('1.0.0'),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
  updatedAtUtc: timestamp('updated_at_utc').notNull().defaultNow(),
});

// System meta (new table)
export const systemMeta = pgTable('system_meta', {
  id: smallint('id').primaryKey().default(1),
  version: varchar('version', { length: 20 }).notNull(),
  lastBackup: timestamp('last_backup').notNull().defaultNow(),
  totalArticles: integer('total_articles').notNull().default(0),
  totalUsers: integer('total_users').notNull().default(0),
  totalComments: integer('total_comments').notNull().default(0),
  totalProtocols: integer('total_protocols').notNull().default(0),
  totalResearchRequests: integer('total_research_requests').notNull().default(0),
  totalNewsletterSubscriptions: integer('total_newsletter_subscriptions').notNull().default(0),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Admin activities
export const adminActivities = pgTable('admin_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(),
  data: jsonb('data'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// Database migrations tracking
export const databaseMigrations = pgTable('database_migrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  migrationName: varchar('migration_name', { length: 255 }).notNull().unique(),
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
});

// User watchlists
export const userWatchlists = pgTable('user_watchlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  articleId: uuid('article_id').notNull(), // Will reference articles table
  createdAtUtc: timestamp('created_at_utc').notNull().defaultNow(),
}, (table) => ({
  unique: { name: 'user_watchlists_unique', columns: [table.userId, table.articleId] },
}));

// Export all tables for Drizzle
export const schema = {
  users,
  userProfiles,
  userPreferences,
  articles,
  tags,
  articleTags,
  articleReadingLevels,
  articleAbstracts,
  articleArchitectureSections,
  productArchitectureTagsMap,
  articleMechanics,
  articleTeamMembers,
  articleEvents,
  articleOfficialLinks,
  articleEcosystem,
  articleCredentials,
  articleTokenomics,
  tokenomicsAllocations,
  articleContentSections,
  articleImages,
  articleTableOfContents,
  articleRadarRatings,
  articleStats,
  articleProblemUsersValue,
  articlePuvUsers,
  articlePuvDifferentiators,
  articlePuvAssumptions,
  comments,
  researchCards,
  researchCardTags,
  researchCardTagsMap,
  researchRequests,
  newsletterSubscriptions,
  protocols,
  protocolCategories,
  protocolCategoriesNew,
  protocolCategoryMap,
  protocolChains,
  chains,
  protocolChainMap,
  protocolMetricSnapshots,
  protocolSectionCopies,
  systemStats,
  systemMeta,
  adminActivities,
  databaseMigrations,
  userWatchlists,
};
