import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal, customerId } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' }, { status: 400 });
    }

    const result = validateCoupon(code, Number(subtotal || 0), customerId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
