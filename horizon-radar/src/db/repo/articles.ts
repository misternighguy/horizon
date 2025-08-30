import { db } from '../client';
import * as schema from '../schema';
import { eq, desc, inArray } from 'drizzle-orm';

// List published articles
export async function listArticles(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const articles = await db
    .select({
      id: schema.articles.id,
      slug: schema.articles.slug,
      title: schema.articles.title,
      subtitle: schema.articles.subtitle,
      featuredImage: schema.articles.featuredImage,
      publishedAt: schema.articles.publishedAt,
      author: schema.articles.author,
    })
    .from(schema.articles)
    .where(eq(schema.articles.status, 'published'))
    .orderBy(desc(schema.articles.publishedAt))
    .limit(limit)
    .offset(offset);

  return articles;
}

// Get article by slug
export async function getArticleBySlug(slug: string) {
  const article = await db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.slug, slug))
    .limit(1);

  return article[0] || null;
}
