import { NextRequest, NextResponse } from 'next/server';
import { updateCoupon, addAuditLog } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = updateCoupon(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    addAuditLog({
      adminUser: 'Admin Joe',
      action: 'UPDATE_COUPON',
      entity: 'Coupon',
      entityId: id,
      details: `Updated coupon ${updated.code} status to ${updated.status}`,
      ip: '127.0.0.1',
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
