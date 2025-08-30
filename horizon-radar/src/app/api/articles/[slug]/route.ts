import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '../../../../db/repo/articles';

// GET /api/articles/[slug] - Get article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error getting article:', error);
    return NextResponse.json({ error: 'Failed to get article' }, { status: 500 });
  }
}
