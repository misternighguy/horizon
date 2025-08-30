import { db } from '../client';
import * as schema from '../schema';
import { eq, desc } from 'drizzle-orm';

// Get research columns for the research page
export async function getResearchColumns() {
  const [recentlyPublished, mostRead, trending] = await Promise.all([
    db.select().from(schema.articles).where(eq(schema.articles.status, 'published')).orderBy(desc(schema.articles.publishedAt)).limit(6),
    db.select().from(schema.articles).where(eq(schema.articles.status, 'published')).orderBy(desc(schema.articles.viewCount)).limit(6),
    db.select().from(schema.articles).where(eq(schema.articles.status, 'published')).orderBy(desc(schema.articles.viewCount), desc(schema.articles.publishedAt)).limit(6)
  ]);

  return { recentlyPublished, mostRead, trending };
}

// Search articles
export async function searchResearchCards(query: string) {
  if (!query.trim()) return [];
  
  const articles = await db.select().from(schema.articles).where(eq(schema.articles.status, 'published')).limit(20);
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    (article.subtitle && article.subtitle.toLowerCase().includes(query.toLowerCase()))
  );
}
