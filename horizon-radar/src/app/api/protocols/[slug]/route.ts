import { NextRequest, NextResponse } from 'next/server';
import { getProtocolBySlug } from '../../../../db/repo/protocols';

// GET /api/protocols/[slug] - Get protocol by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const protocol = await getProtocolBySlug(slug);

    if (!protocol) {
      return NextResponse.json(
        { error: 'Protocol not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(protocol);
  } catch (error) {
    console.error('Error getting protocol:', error);
    return NextResponse.json(
      { error: 'Failed to get protocol' },
      { status: 500 }
    );
  }
}
