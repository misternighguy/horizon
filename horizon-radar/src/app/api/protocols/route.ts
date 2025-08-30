import { NextRequest, NextResponse } from 'next/server';
import { listProtocols } from '../../../db/repo/protocols';

// GET /api/protocols - List protocols
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const protocols = await listProtocols(page, limit);
    return NextResponse.json(protocols);
  } catch (error) {
    console.error('Error listing protocols:', error);
    return NextResponse.json({ error: 'Failed to list protocols' }, { status: 500 });
  }
}
