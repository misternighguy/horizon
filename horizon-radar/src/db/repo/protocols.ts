import { db } from '../client';
import * as schema from '../schema';
import { eq, desc } from 'drizzle-orm';

// List protocols
export async function listProtocols(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const protocols = await db
    .select()
    .from(schema.protocols)
    .orderBy(desc(schema.protocols.lastUpdated))
    .limit(limit)
    .offset(offset);

  return protocols;
}

// Get protocol by slug
export async function getProtocolBySlug(slug: string) {
  const protocol = await db
    .select()
    .from(schema.protocols)
    .where(eq(schema.protocols.slug, slug))
    .limit(1);

  return protocol[0] || null;
}
