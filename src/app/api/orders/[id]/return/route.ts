import { NextRequest, NextResponse } from 'next/server';
import { requestOrderReturn } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const reason = body.reason || 'Damaged product';
    const details = body.details || '';

    const order = requestOrderReturn(id, reason, details);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order, message: 'Return request submitted successfully. Our team will review within 24 hours.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
