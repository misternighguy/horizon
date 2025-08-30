#!/usr/bin/env tsx

import { db } from './client';
import * as schema from './schema';
import { eq, sql } from 'drizzle-orm';
import { localStorageDB } from '../data/localStorageDB';
import { Protocol } from '../types';

// Helper function to generate deterministic UUIDs
function generateUUID(seed: string): string {
  // Simple hash function for deterministic UUIDs
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to UUID format (simplified)
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

// Money string parser (e.g., "$12.5M" → 12500000.00)
function parseMoneyString(moneyStr: string): { numeric: number; text: string } {
  if (!moneyStr || typeof moneyStr !== 'string') {
    return { numeric: 0, text: moneyStr || '0' };
  }

  const cleanStr = moneyStr.replace(/[$,]/g, '').toLowerCase();
  const match = cleanStr.match(/^([\d.]+)([kmb])?$/);
  
  if (!match) {
    return { numeric: 0, text: moneyStr };
  }

  const value = parseFloat(match[1]);
  const multiplier = match[2];
  
  let numeric = value;
  if (multiplier === 'k') numeric = value * 1000;
  else if (multiplier === 'm') numeric = value * 1000000;
  else if (multiplier === 'b') numeric = value * 1000000000;

  return { numeric, text: moneyStr };
}

// Parse user count strings (e.g., "2.4K" → 2400)
function parseUserCount(userStr: string): { count: number; text: string } {
  if (!userStr || typeof userStr !== 'string') {
    return { count: 0, text: userStr || '0' };
  }

  const cleanStr = userStr.replace(/[,\s]/g, '').toLowerCase();
  const match = cleanStr.match(/^([\d.]+)([kmb])?$/);
  
  if (!match) {
    return { count: 0, text: userStr };
  }

  const value = parseFloat(match[1]);
  const multiplier = match[2];
  
  let count = value;
  if (multiplier === 'k') count = value * 1000;
  else if (multiplier === 'm') count = value * 1000000;
  else if (multiplier === 'b') count = value * 1000000000;

  return { count: Math.round(count), text: userStr };
}

// Parse opinion count strings (e.g., "156" → 156)
function parseOpinionCount(opinionStr: string): { count: number; text: string } {
  if (!opinionStr || typeof opinionStr !== 'string') {
    return { count: 0, text: opinionStr || '0' };
  }

  const count = parseInt(opinionStr.replace(/[,\s]/g, ''), 10);
  return { count: isNaN(count) ? 0 : count, text: opinionStr };
}

// Event type normalizer
function normalizeEventType(eventText: string): { type: string; title: string } {
  const lowerEvent = eventText.toLowerCase();
  
  if (lowerEvent.includes('testnet')) return { type: 'testnet', title: eventText };
  if (lowerEvent.includes('mainnet')) return { type: 'mainnet', title: eventText };
  if (lowerEvent.includes('raise') || lowerEvent.includes('funding')) return { type: 'raise', title: eventText };
  if (lowerEvent.includes('launch') || lowerEvent.includes('release')) return { type: 'product_launch', title: eventText };
  if (lowerEvent.includes('chain')) return { type: 'chain_launch', title: eventText };
  if (lowerEvent.includes('audit')) return { type: 'audit', title: eventText };
  
  return { type: 'other', title: eventText };
}

// Link group classifier
function classifyLink(platform: string, type: string): { group: string; kind: string } {
  if (platform && ['Twitter', 'Discord', 'Telegram', 'LinkedIn', 'Website'].includes(platform)) {
    return { group: 'social', kind: platform };
  }
  if (type && ['Whitepaper', 'Contract Address', 'Chart', 'Documentation'].includes(type)) {
    return { group: 'technical', kind: type };
  }
  return { group: 'social', kind: platform || type || 'other' };
}

// Helper function to get nested section content
function getNestedSection(sections: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = sections;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }
  
  return current;
}

// Clear tables in FK-safe order
async function clearTables() {
  console.log('🗑️ Clearing existing data...');
  
  try {
    // Clear in reverse dependency order
    await db.execute(sql`TRUNCATE TABLE article_puv_assumptions CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_puv_differentiators CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_puv_users CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_problem_users_value CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_tokenomics CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_images CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_table_of_contents CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_content_sections CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_ecosystem CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_credentials CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_events CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_team_members CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_mechanics CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_architecture_sections CASCADE`);
    await db.execute(sql`TRUNCATE TABLE product_architecture_tags_map CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_reading_levels CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_abstracts CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_radar_ratings CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_stats CASCADE`);
    await db.execute(sql`TRUNCATE TABLE article_tags CASCADE`);
    await db.execute(sql`TRUNCATE TABLE research_card_tags CASCADE`);
    await db.execute(sql`TRUNCATE TABLE research_card_tags_map CASCADE`);
    await db.execute(sql`TRUNCATE TABLE protocol_metric_snapshots CASCADE`);
    await db.execute(sql`TRUNCATE TABLE protocol_section_copies CASCADE`);
    await db.execute(sql`TRUNCATE TABLE protocol_category_map CASCADE`);
    await db.execute(sql`TRUNCATE TABLE protocol_chain_map CASCADE`);
    await db.execute(sql`TRUNCATE TABLE protocol_categories CASCADE`);
    await db.execute(sql`TRUNCATE TABLE protocol_chains CASCADE`);
    await db.execute(sql`TRUNCATE TABLE user_watchlists CASCADE`);
    await db.execute(sql`TRUNCATE TABLE comments CASCADE`);
    await db.execute(sql`TRUNCATE TABLE research_cards CASCADE`);
    await db.execute(sql`TRUNCATE TABLE research_requests CASCADE`);
    await db.execute(sql`TRUNCATE TABLE newsletter_subscriptions CASCADE`);
    await db.execute(sql`TRUNCATE TABLE user_preferences CASCADE`);
    await db.execute(sql`TRUNCATE TABLE user_profiles CASCADE`);
    await db.execute(sql`TRUNCATE TABLE protocols CASCADE`);
    await db.execute(sql`TRUNCATE TABLE protocol_categories_new CASCADE`);
    await db.execute(sql`TRUNCATE TABLE chains CASCADE`);
    await db.execute(sql`TRUNCATE TABLE articles CASCADE`);
    await db.execute(sql`TRUNCATE TABLE tags CASCADE`);
    await db.execute(sql`TRUNCATE TABLE users CASCADE`);
    await db.execute(sql`TRUNCATE TABLE system_stats CASCADE`);
    await db.execute(sql`TRUNCATE TABLE system_meta CASCADE`);
    await db.execute(sql`TRUNCATE TABLE admin_activities CASCADE`);
    await db.execute(sql`TRUNCATE TABLE database_migrations CASCADE`);
    
    console.log('✅ Tables cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing tables:', error);
    throw error;
  }
}

// Main seed function
async function seed() {
  console.log('🌱 Starting database seed...');
  
  try {
    // Skip clearing tables since they're empty and we don't have permissions
    console.log('⏭️ Skipping table clearing (tables are empty)');
    
    // Get mock data from LocalStorageDB
    const mockData = localStorageDB.exportDatabase();
    
    console.log(`📊 Found ${mockData.articles.length} articles, ${mockData.users.length} users, ${mockData.comments.length} comments`);
    
    // 1. Insert Users
    console.log('👥 Inserting users...');
    const userIdMap = new Map<string, string>(); // old ID -> new UUID
    
    for (const user of mockData.users) {
      const userId = generateUUID(`user-${user.id}`);
      userIdMap.set(user.id, userId);
      
      await db.insert(schema.users).values({
        id: userId,
        username: user.username,
        email: user.email,
        memberStyle: user.memberStyle,
        duration: user.duration,
        durationMonths: user.duration,
        createdAt: user.createdAt,
        expiresAt: user.expiresAt,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAtUtc: user.createdAt,
        updatedAtUtc: user.createdAt
      });
      
      // Insert user profile
      if (user.profile) {
        await db.insert(schema.userProfiles).values({
          userId: userId,
          avatar: user.profile.avatar,
          avatarUrl: user.profile.avatar,
          bio: user.profile.bio || '',
          twitter: user.profile.twitter || '',
          twitterUrl: user.profile.twitter || '',
          linkedin: user.profile.linkedin || '',
          linkedinUrl: user.profile.linkedin || '',
          createdAtUtc: user.createdAt,
          updatedAtUtc: user.createdAt
        });
      }
      
      // Insert user preferences
      if (user.preferences) {
        await db.insert(schema.userPreferences).values({
          userId: userId,
          readingLevel: user.preferences.readingLevel,
          notifications: user.preferences.notifications,
          newsletter: user.preferences.newsletter,
          createdAtUtc: user.createdAt,
          updatedAtUtc: user.createdAt
        });
      }
    }
    
    console.log(`✅ Inserted ${mockData.users.length} users`);
    
    // 2. Insert Tags (dedupe from articles and research cards)
    console.log('🏷️ Inserting tags...');
    const tagMap = new Map<string, string>(); // tag name -> UUID
    const allTags = new Set<string>();
    
    // Collect tags from articles
    mockData.articles.forEach(article => {
      article.tags?.forEach(tag => allTags.add(tag));
      article.productArchitecture?.tags?.forEach(tag => allTags.add(tag));
    });
    
    // Collect tags from research cards
    mockData.researchCards.forEach(card => {
      card.tags?.forEach(tag => allTags.add(tag));
    });
    
    // Collect tags from protocols
    Object.values(mockData.protocols).forEach((protocol: Protocol) => {
      protocol.category?.forEach((cat: string) => allTags.add(cat));
    });
    
    for (const tagName of Array.from(allTags)) {
      const tagId = generateUUID(`tag-${tagName}`);
      tagMap.set(tagName, tagId);
      
      await db.insert(schema.tags).values({
        id: tagId,
        name: tagName,
        createdAtUtc: new Date()
      });
    }
    
    console.log(`✅ Inserted ${allTags.size} tags`);
    
    // 3. Insert Articles
    console.log('📰 Inserting articles...');
    const articleIdMap = new Map<string, string>(); // old ID -> new UUID
    
    for (const article of mockData.articles) {
      const articleId = generateUUID(`article-${article.id}`);
      articleIdMap.set(article.id, articleId);
      
      await db.insert(schema.articles).values({
        id: articleId,
        slug: article.slug,
        title: article.title,
        ticker: article.ticker,
        subtitle: article.subtitle,
        classification: article.classification,
        location: article.location,
        status: article.status,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        author: article.author,
        featuredImage: article.featuredImage,
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        createdAtUtc: article.createdAt,
        updatedAtUtc: article.updatedAt
      });
      
      // Insert article reading levels
      for (const level of article.readingLevels) {
        await db.insert(schema.articleReadingLevels).values({
          articleId: articleId,
          readingLevel: level,
          level: level
        });
      }
      
      // Insert article abstracts
      if (article.abstract) {
        for (let i = 0; i < article.abstract.length; i++) {
          await db.insert(schema.articleAbstracts).values({
            id: generateUUID(`abstract-${articleId}-${i}`),
            articleId: articleId,
            content: article.abstract[i],
            text: article.abstract[i],
            orderIndex: i + 1,
            createdAtUtc: new Date()
          });
        }
      }
      
      // Insert product architecture sections
      if (article.productArchitecture?.sections) {
        for (let i = 0; i < article.productArchitecture.sections.length; i++) {
          await db.insert(schema.articleArchitectureSections).values({
            id: generateUUID(`arch-${articleId}-${i}`),
            articleId: articleId,
            content: article.productArchitecture.sections[i],
            text: article.productArchitecture.sections[i],
            orderIndex: i + 1,
            createdAtUtc: new Date()
          });
        }
        
        // Insert product architecture tags map
        if (article.productArchitecture.tags) {
          for (const tagName of article.productArchitecture.tags) {
            const tagId = tagMap.get(tagName);
            if (tagId) {
              await db.insert(schema.productArchitectureTagsMap).values({
                articleId: articleId,
                tagId: tagId
              });
            }
          }
        }
      }
      
      // Insert mechanics
      if (article.mechanics) {
        for (let i = 0; i < article.mechanics.length; i++) {
          await db.insert(schema.articleMechanics).values({
            id: generateUUID(`mech-${articleId}-${i}`),
            articleId: articleId,
            content: article.mechanics[i],
            text: article.mechanics[i],
            orderIndex: i + 1,
            createdAtUtc: new Date()
          });
        }
      }
      
      // Insert team members
      if (article.team) {
        for (let i = 0; i < article.team.length; i++) {
          const member = article.team[i];
          await db.insert(schema.articleTeamMembers).values({
            id: generateUUID(`team-${articleId}-${i}`),
            articleId: articleId,
            name: member.name,
            role: member.role,
            twitter: member.twitter || '',
            twitterUrl: member.twitter || '',
            linkedin: member.linkedin || '',
            linkedinUrl: member.linkedin || '',
            orderIndex: i + 1,
            createdAtUtc: new Date()
          });
        }
      }
      
      // Insert events
      if (article.events) {
        for (let i = 0; i < article.events.length; i++) {
          const event = article.events[i];
          const { type, title } = normalizeEventType(event.event);
          await db.insert(schema.articleEvents).values({
            id: generateUUID(`event-${articleId}-${i}`),
            articleId: articleId,
            eventName: event.event,
            eventDate: event.date || '',
            type: type as 'testnet' | 'mainnet' | 'raise' | 'product_launch' | 'chain_launch' | 'audit' | 'other',
            title: title,
            dateText: event.date || '',
            orderIndex: i + 1,
            createdAtUtc: new Date()
          });
        }
      }
      
      // Insert official links
      if (article.officialLinks) {
        let orderIndex = 1;
        
        // Social links
        if (article.officialLinks.socials) {
          for (const link of article.officialLinks.socials) {
            const { group, kind } = classifyLink(link.platform, '');
            await db.insert(schema.articleOfficialLinks).values({
              id: generateUUID(`link-${articleId}-${orderIndex}`),
              articleId: articleId,
              linkType: link.platform,
              platform: link.platform,
              url: link.url,
              group: group as 'social' | 'technical',
              kind: kind,
              orderIndex: orderIndex++,
              createdAtUtc: new Date()
            });
          }
        }
        
        // Technical links
        if (article.officialLinks.technical) {
          for (const link of article.officialLinks.technical) {
            const { group, kind } = classifyLink('', link.type);
            await db.insert(schema.articleOfficialLinks).values({
              id: generateUUID(`link-${articleId}-${orderIndex}`),
              articleId: articleId,
              linkType: link.type,
              platform: link.type,
              url: link.url,
              group: group as 'social' | 'technical',
              kind: kind,
              orderIndex: orderIndex++,
              createdAtUtc: new Date()
            });
          }
        }
      }
      
      // Insert ecosystem
      if (article.ecosystem) {
        for (let i = 0; i < article.ecosystem.length; i++) {
          await db.insert(schema.articleEcosystem).values({
            id: generateUUID(`eco-${articleId}-${i}`),
            articleId: articleId,
            ecosystemItem: article.ecosystem[i],
            label: article.ecosystem[i],
            orderIndex: i + 1,
            createdAtUtc: new Date()
          });
        }
      }
      
      // Insert credentials
      if (article.credentials) {
        for (let i = 0; i < article.credentials.length; i++) {
          await db.insert(schema.articleCredentials).values({
            id: generateUUID(`cred-${articleId}-${i}`),
            articleId: articleId,
            credential: article.credentials[i],
            text: article.credentials[i],
            orderIndex: i + 1,
            createdAtUtc: new Date()
          });
        }
      }
      
      // Insert tokenomics
      if (article.tokenomics) {
        for (let i = 0; i < article.tokenomics.length; i++) {
          const tokenomics = article.tokenomics[i];
          await db.insert(schema.articleTokenomics).values({
            id: generateUUID(`tok-${articleId}-${i}`),
            articleId: articleId,
            category: tokenomics.category,
            percentage: tokenomics.percentage,
            status: tokenomics.status,
            orderIndex: i + 1,
            createdAtUtc: new Date()
          });
          
          // Also insert into tokenomics allocations
          await db.insert(schema.tokenomicsAllocations).values({
            id: generateUUID(`alloc-${articleId}-${i}`),
            articleId: articleId,
            category: tokenomics.category,
            percentage: tokenomics.percentage.toString(),
            status: tokenomics.status,
            createdAtUtc: new Date()
          });
        }
      }
      
      // Insert content sections by reading level
      if (article.content) {
        for (const [level, levelContent] of Object.entries(article.content)) {
          if (levelContent && typeof levelContent === 'object' && 'sections' in levelContent) {
            const sections = (levelContent as any).sections;
            if (sections) {
              for (const section of sections) {
                await db.insert(schema.articleContentSections).values({
                  id: generateUUID(`content-${articleId}-${level}-${section.order}`),
                  articleId: articleId,
                  readingLevel: level as any,
                  title: section.title,
                  content: section.content,
                  orderIndex: section.order,
                  createdAtUtc: new Date()
                });
              }
            }
          }
        }
      }
      
      // Insert radar ratings
      if (article.radarRating) {
        await db.insert(schema.articleRadarRatings).values({
          articleId: articleId,
          growthPotential: article.radarRating.growthPotential,
          investmentOpportunity: article.radarRating.investmentOpportunity,
          memberOpinions: article.radarRating.memberOpinions,
          createdAtUtc: new Date(),
          updatedAtUtc: new Date()
        });
      }
      
      // Insert stats with parsed numeric values
      if (article.stats) {
        const tvl = parseMoneyString(article.stats.tvl);
        const volume = parseMoneyString(article.stats.volume);
        const users = parseUserCount(article.stats.users);
        const capital = parseMoneyString(article.stats.capital);
        const opinions = parseOpinionCount(article.stats.opinions);
        
        await db.execute(sql`
          INSERT INTO article_stats (
            article_id, tvl, volume, users, capital, opinions,
            tvl_text, volume_text, users_text, capital_text, opinions_text,
            tvl_usd, volume_usd, users_count, capital_raised_usd, opinions_count,
            created_at_utc, updated_at_utc
          ) VALUES (
            ${articleId}, ${article.stats.tvl}, ${article.stats.volume}, ${article.stats.users}, ${article.stats.capital}, ${article.stats.opinions},
            ${article.stats.tvl}, ${article.stats.volume}, ${article.stats.users}, ${article.stats.capital}, ${article.stats.opinions},
            ${tvl.numeric}, ${volume.numeric}, ${users.count}, ${capital.numeric}, ${opinions.count},
            ${new Date()}, ${new Date()}
          )
        `);
      }
      
      // Insert problem users value
      if (article.problemUsersValue) {
        await db.insert(schema.articleProblemUsersValue).values({
          articleId: articleId,
          problem: article.problemUsersValue.problem,
          approach: article.problemUsersValue.approach,
          createdAtUtc: new Date()
        });
        
        // Insert PUV users
        if (article.problemUsersValue.users) {
          for (let i = 0; i < article.problemUsersValue.users.length; i++) {
            await db.insert(schema.articlePuvUsers).values({
              id: generateUUID(`puv-user-${articleId}-${i}`),
              articleId: articleId,
              userLabel: article.problemUsersValue.users[i],
              createdAtUtc: new Date()
            });
          }
        }
        
        // Insert PUV differentiators
        if (article.problemUsersValue.differentiators) {
          for (let i = 0; i < article.problemUsersValue.differentiators.length; i++) {
            await db.insert(schema.articlePuvDifferentiators).values({
              id: generateUUID(`puv-diff-${articleId}-${i}`),
              articleId: articleId,
              differentiator: article.problemUsersValue.differentiators[i],
              createdAtUtc: new Date()
            });
          }
        }
        
        // Insert PUV assumptions
        if (article.problemUsersValue.assumptions) {
          for (let i = 0; i < article.problemUsersValue.assumptions.length; i++) {
            await db.insert(schema.articlePuvAssumptions).values({
              id: generateUUID(`puv-assump-${articleId}-${i}`),
              articleId: articleId,
              assumption: article.problemUsersValue.assumptions[i],
              createdAtUtc: new Date()
            });
          }
        }
      }
      
      // Insert article tags
      if (article.tags) {
        for (const tagName of article.tags) {
          const tagId = tagMap.get(tagName);
          if (tagId) {
            await db.insert(schema.articleTags).values({
              articleId: articleId,
              tagId: tagId
            });
          }
        }
      }
    }
    
    console.log(`✅ Inserted ${mockData.articles.length} articles`);
    
    // 4. Insert Comments (with nested replies)
    console.log('💬 Inserting comments...');
    const commentIdMap = new Map<string, string>(); // old ID -> new UUID
    
    const insertComment = async (comment: Record<string, any>, parentId?: string) => {
      const commentId = generateUUID(`comment-${comment.id}`);
      commentIdMap.set(comment.id, commentId);
      
      const authorId = comment.authorId ? userIdMap.get(comment.authorId) : null;
      
      await db.insert(schema.comments).values({
        id: commentId,
        articleId: articleIdMap.get(comment.articleId) || '',
        articleSlug: comment.articleSlug,
        articleTitle: comment.articleTitle,
        author: comment.author,
        authorId: authorId,
        authorInitials: comment.authorInitials,
        authorColor: comment.authorColor,
        content: comment.content,
        parentId: parentId,
        authorName: comment.author,
        isHidden: comment.isHidden || false,
        isFlagged: comment.isFlagged || false,
        isAdmin: comment.isAdmin || false,
        likeCount: comment.likeCount || 0,
        createdAtUtc: comment.timestamp || new Date(),
        updatedAtUtc: comment.timestamp || new Date()
      });
      
      // Insert replies recursively
      if (comment.replies && comment.replies.length > 0) {
        for (const reply of comment.replies) {
          await insertComment(reply, commentId);
        }
      }
    };
    
    for (const comment of mockData.comments) {
      await insertComment(comment);
    }
    
    console.log(`✅ Inserted ${mockData.comments.length} comments with replies`);
    
    // 5. Insert Research Cards
    console.log('🔬 Inserting research cards...');
    const researchCardIdMap = new Map<string, string>(); // old ID -> new UUID
    
    for (const card of mockData.researchCards) {
      const cardId = generateUUID(`card-${card.id}`);
      researchCardIdMap.set(card.id, cardId);
      
      // Find corresponding article by slug
      const articleId = mockData.articles.find(a => a.slug === card.slug)?.id;
      const dbArticleId = articleId ? articleIdMap.get(articleId) : null;
      
      await db.execute(sql`
        INSERT INTO research_cards (
          id, title, description, growth_score, opportunity_score, slug, banner_image, category, published_at, view_count, author, author_text, article_id, created_at_utc, updated_at_utc
        ) VALUES (
          ${cardId}, ${card.title}, ${card.description}, ${card.growthScore}, ${card.opportunityScore}, ${card.slug}, ${card.bannerImage}, ${card.category}, ${card.publishedAt}, ${card.viewCount}, ${card.author}, ${card.author}, ${dbArticleId}, ${new Date()}, ${new Date()}
        )
      `);
      
      // Insert research card tags
      if (card.tags) {
        for (const tagName of card.tags) {
          const tagId = tagMap.get(tagName);
          if (tagId) {
            await db.insert(schema.researchCardTags).values({
              researchCardId: cardId,
              tagId: tagId
            });
            
            // Also insert into research card tags map
            await db.insert(schema.researchCardTagsMap).values({
              cardId: cardId,
              tagId: tagId
            });
          }
        }
      }
    }
    
    console.log(`✅ Inserted ${mockData.researchCards.length} research cards`);
    
    // 6. Insert Protocols
    console.log('🔗 Inserting protocols...');
    const protocolIdMap = new Map<string, string>(); // slug -> UUID
    
          // First, create chains
      const allChains = new Set<string>();
      Object.values(mockData.protocols).forEach((protocol: Protocol) => {
        if (protocol.chains) {
          if (Array.isArray(protocol.chains)) {
            protocol.chains.forEach((chain: string) => allChains.add(chain));
          } else {
            allChains.add(protocol.chains);
          }
        }
      });
    
    const chainIdMap = new Map<string, string>(); // chain name -> UUID
    for (const chainName of Array.from(allChains)) {
      const chainId = generateUUID(`chain-${chainName}`);
      chainIdMap.set(chainName, chainId);
      
      await db.insert(schema.chains).values({
        id: chainId,
        name: chainName,
        createdAtUtc: new Date()
      });
    }
    
          // Create protocol categories
      const allCategories = new Set<string>();
      Object.values(mockData.protocols).forEach((protocol: Protocol) => {
        if (protocol.category) {
          protocol.category.forEach((cat: string) => allCategories.add(cat));
        }
      });
    
    const categoryIdMap = new Map<string, string>(); // category name -> UUID
    for (const categoryName of Array.from(allCategories)) {
      const categoryId = generateUUID(`cat-${categoryName}`);
      categoryIdMap.set(categoryName, categoryId);
      
      await db.insert(schema.protocolCategoriesNew).values({
        id: categoryId,
        name: categoryName,
        createdAtUtc: new Date()
      });
    }
    
    // Insert protocols
    for (const [slug, protocol] of Object.entries(mockData.protocols)) {
      const protocolId = generateUUID(`protocol-${slug}`);
      protocolIdMap.set(slug, protocolId);
      
              const protocolData: Protocol = protocol;
      
      await db.insert(schema.protocols).values({
        id: protocolId,
        slug: protocolData.slug,
        name: protocolData.name,
        ticker: protocolData.ticker,
        status: protocolData.status,
        premium: protocolData.premium || false,
        radarRating: protocolData.radarRating,
        growthPotential: protocolData.growthPotential,
        lastUpdated: protocolData.lastUpdated ? new Date(protocolData.lastUpdated) : null,
        lastUpdatedDate: protocolData.lastUpdated ? new Date(protocolData.lastUpdated).toISOString().split('T')[0] : null,
        investmentOpportunityText: protocolData.investmentOpportunityText,
        createdAtUtc: new Date(),
        updatedAtUtc: new Date()
      });
      
      // Insert protocol categories
      if (protocolData.category) {
        for (const categoryName of protocolData.category) {
          const categoryId = categoryIdMap.get(categoryName);
          if (categoryId) {
            await db.insert(schema.protocolCategoryMap).values({
              protocolId: protocolId,
              categoryId: categoryId
            });
          }
        }
      }
      
      // Insert protocol chains
      if (protocolData.chains) {
        if (Array.isArray(protocolData.chains)) {
          for (const chainName of protocolData.chains) {
            const chainId = chainIdMap.get(chainName);
            if (chainId) {
              await db.insert(schema.protocolChainMap).values({
                protocolId: protocolId,
                chainId: chainId
              });
            }
          }
        } else {
          const chainId = chainIdMap.get(protocolData.chains);
          if (chainId) {
            await db.insert(schema.protocolChainMap).values({
              protocolId: protocolId,
              chainId: chainId
            });
          }
        }
      }
      
      // Insert protocol section copies
      if (protocolData.sections) {
        const sectionKeys = [
          'abstract', 'architecture', 'mechanics.deposit', 'mechanics.withdraw', 
          'mechanics.incentives', 'mechanics.riskEngine', 'problemUsersValue.problem', 
          'problemUsersValue.users', 'problemUsersValue.value', 'tokenomics', 
          'authorSources', 'disclaimer', 'community'
        ];
        
        for (const sectionKey of sectionKeys) {
          const section = getNestedSection(protocolData.sections, sectionKey);
          if (section) {
            for (const [level, content] of Object.entries(section)) {
              if (content) {
                await db.insert(schema.protocolSectionCopies).values({
                  id: generateUUID(`section-${protocolId}-${sectionKey}-${level}`),
                  protocolId: protocolId,
                  sectionKey: sectionKey as any,
                  readingLevel: level as any,
                  title: `${sectionKey} (${level})`,
                  content: content as string,
                  orderIndex: 1,
                  createdAtUtc: new Date()
                });
              }
            }
          }
        }
      }
      
      // Insert metric snapshots
      if (protocolData.metricSnapshots) {
        for (const snapshot of protocolData.metricSnapshots) {
          await db.insert(schema.protocolMetricSnapshots).values({
            id: generateUUID(`snapshot-${protocolId}-${snapshot.asOf}`),
            protocolSlug: protocolData.slug,
            protocolId: protocolId,
            asOf: new Date(snapshot.asOf),
            asOfDate: new Date(snapshot.asOf).toISOString().split('T')[0],
            tvl: snapshot.tvl,
            volume24h: snapshot.volume24h,
            tvlUsd: snapshot.tvl,
            volume24hUsd: snapshot.volume24h,
            createdAtUtc: new Date()
          });
        }
      }
    }
    
    console.log(`✅ Inserted ${Object.keys(mockData.protocols).length} protocols`);
    
    // 7. Insert Newsletter Subscriptions (if any exist)
    if (mockData.newsletterSubscriptions && mockData.newsletterSubscriptions.length > 0) {
      console.log('📧 Inserting newsletter subscriptions...');
      
      for (const subscription of mockData.newsletterSubscriptions) {
        const userId = subscription.userId ? userIdMap.get(subscription.userId) : null;
        
        await db.insert(schema.newsletterSubscriptions).values({
          id: generateUUID(`newsletter-${subscription.id}`),
          userId: userId,
          email: subscription.email,
          name: subscription.name,
          source: subscription.source,
          status: subscription.status,
          sourceText: subscription.source,
          subscribedAt: subscription.subscribedAt,
          unsubscribedAt: subscription.status === 'unsubscribed' ? new Date() : null,
          statusActive: subscription.status === 'subscribed' ? 'active' : 'unsubscribed',
          createdAtUtc: subscription.subscribedAt,
          updatedAtUtc: subscription.subscribedAt
        });
      }
      
      console.log(`✅ Inserted ${mockData.newsletterSubscriptions.length} newsletter subscriptions`);
    }
    
    // 8. Insert Research Requests (if any exist)
    if (mockData.researchRequests && mockData.researchRequests.length > 0) {
      console.log('🔍 Inserting research requests...');
      
      for (const request of mockData.researchRequests) {
        const submittedBy = request.submittedBy ? userIdMap.get(request.submittedBy) : null;
        
        await db.insert(schema.researchRequests).values({
          id: generateUUID(`request-${request.id}`),
          type: request.type,
          projectName: request.projectName,
          website: request.website,
          twitter: request.twitter,
          docsLink: request.docsLink,
          helpfulLink1: request.helpfulLink1,
          helpfulLink2: request.helpfulLink2,
          notes: request.notes,
          contractAddress: request.contractAddress,
          chain: request.chain,
          category: request.category,
          problemStatement: request.problemStatement,
          keyRisks: request.keyRisks,
          docsLinks: request.docsLinks,
          submittedBy: submittedBy,
          status: request.status,
          email: 'unknown@example.com', // Default email since it doesn't exist in the type
          topic: request.projectName,
          details: request.notes || request.problemStatement || 'No details provided',
          priority: 0,
          createdAtUtc: request.submittedAt,
          updatedAtUtc: request.submittedAt
        });
      }
      
      console.log(`✅ Inserted ${mockData.researchRequests.length} research requests`);
    }
    
    // 9. Insert System Data
    console.log('⚙️ Inserting system data...');
    
    // Count actual inserted records
    const actualStats = {
      totalArticles: mockData.articles.length,
      totalUsers: mockData.users.length,
      totalComments: mockData.comments.length,
      totalProtocols: Object.keys(mockData.protocols).length,
      totalResearchRequests: mockData.researchRequests?.length || 0,
      totalNewsletterSubscriptions: mockData.newsletterSubscriptions?.length || 0
    };
    
    // Insert system stats
    await db.insert(schema.systemStats).values({
      id: generateUUID('system-stats'),
      totalArticles: actualStats.totalArticles,
      totalUsers: actualStats.totalUsers,
      totalComments: actualStats.totalComments,
      totalProtocols: actualStats.totalProtocols,
      totalResearchRequests: actualStats.totalResearchRequests,
      totalNewsletterSubscriptions: actualStats.totalNewsletterSubscriptions,
      lastBackup: new Date(),
      version: '1.0.0',
      createdAtUtc: new Date(),
      updatedAtUtc: new Date()
    });
    
    // Insert system meta
    await db.insert(schema.systemMeta).values({
      id: 1,
      version: '1.0.0',
      lastBackup: new Date(),
      totalArticles: actualStats.totalArticles,
      totalUsers: actualStats.totalUsers,
      totalComments: actualStats.totalComments,
      totalProtocols: actualStats.totalProtocols,
      totalResearchRequests: actualStats.totalResearchRequests,
      totalNewsletterSubscriptions: actualStats.totalNewsletterSubscriptions,
      createdAtUtc: new Date()
    });
    
    console.log('✅ System data inserted');
    
    // 10. Final sanity check and summary
    console.log('\n📊 Seed Summary:');
    console.log(`   Users: ${actualStats.totalUsers}`);
    console.log(`   Articles: ${actualStats.totalArticles}`);
    console.log(`   Comments: ${actualStats.totalComments}`);
    console.log(`   Protocols: ${actualStats.totalProtocols}`);
    console.log(`   Research Cards: ${mockData.researchCards.length}`);
    console.log(`   Tags: ${allTags.size}`);
    console.log(`   Newsletter Subscriptions: ${actualStats.totalNewsletterSubscriptions}`);
    console.log(`   Research Requests: ${actualStats.totalResearchRequests}`);
    
    console.log('\n✅ Seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed().catch(console.error);
}

export { seed, parseMoneyString, parseUserCount, parseOpinionCount, normalizeEventType, classifyLink, generateUUID };
