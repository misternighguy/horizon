import { NextRequest, NextResponse } from 'next/server';
import { listArticles } from '../../../db/repo/articles';

// GET /api/articles - List articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const articles = await listArticles(page, limit);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error listing articles:', error);
    return NextResponse.json({ error: 'Failed to list articles' }, { status: 500 });
  }
}
