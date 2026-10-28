import { NextRequest, NextResponse } from 'next/server';
import { getCoupons, createCoupon, addAuditLog } from '@/lib/db';

export async function GET() {
  try {
    const coupons = getCoupons();
    return NextResponse.json(coupons);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 });
    }

    const newCoupon = createCoupon({
      code: body.code,
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue),
      minOrderValue: Number(body.minOrderValue) || 0,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      validFrom: body.validFrom || new Date().toISOString(),
      validUntil: body.validUntil || new Date(Date.now() + 30 * 86400000).toISOString(),
      usageLimit: Number(body.usageLimit) || 100,
      perUserLimit: Number(body.perUserLimit) || 1,
      status: body.status || 'active',
    });

    addAuditLog({
      adminUser: 'Admin Joe',
      action: 'CREATE_COUPON',
      entity: 'Coupon',
      entityId: newCoupon.id,
      details: `Created promo coupon: ${newCoupon.code} (${newCoupon.discountValue}% off)`,
      ip: '127.0.0.1',
    });

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
