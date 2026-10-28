import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/db';

export async function GET() {
  try {
    const logs = getAuditLogs();
    return NextResponse.json(logs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
