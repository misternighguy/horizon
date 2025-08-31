import { NextRequest, NextResponse } from 'next/server';
import { getResearchColumns, searchResearchCards } from '@/db/repo/research';

// GET /api/research/cards - Get research columns or search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (query) {
      const results = await searchResearchCards(query);
      return NextResponse.json(results);
    }

    const columns = await getResearchColumns();
    return NextResponse.json(columns);
  } catch (error) {
    console.error('Error getting research cards:', error);
    return NextResponse.json({ error: 'Failed to get research cards' }, { status: 500 });
  }
}
