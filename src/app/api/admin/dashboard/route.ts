import { NextRequest, NextResponse } from 'next/server';
import { getAdminAnalytics } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30d';
    const analytics = getAdminAnalytics(range);
    return NextResponse.json(analytics);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
