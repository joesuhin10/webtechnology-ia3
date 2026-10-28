import { NextRequest, NextResponse } from 'next/server';
import { updateProductStock, updateProduct } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { productId, delta, newStock } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    if (newStock !== undefined) {
      const updated = updateProduct(productId, { stock: Math.max(0, Number(newStock)) });
      return NextResponse.json({ success: true, product: updated });
    } else if (delta !== undefined) {
      const updated = updateProductStock(productId, Number(delta));
      return NextResponse.json({ success: true, product: updated });
    }

    return NextResponse.json({ error: 'Provide delta or newStock' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
