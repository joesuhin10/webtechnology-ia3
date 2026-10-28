import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId') || undefined;
    const orders = getOrders(customerId);
    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerId || !body.items || body.items.length === 0 || !body.shippingAddress) {
      return NextResponse.json(
        { error: 'Incomplete order payload. Customer, items, and address are required.' },
        { status: 400 }
      );
    }

    const order = createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
