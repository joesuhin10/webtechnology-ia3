import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getCategories, getBrands } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toLowerCase().trim() || '';

    if (!q) {
      return NextResponse.json({ products: [], categories: [], brands: [] });
    }

    const { products } = getProducts({ search: q, limit: 6 });
    const categories = getCategories().filter((c) =>
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
    const brands = getBrands().filter((b) =>
      b.name.toLowerCase().includes(q)
    );

    return NextResponse.json({
      products,
      categories: categories.slice(0, 4),
      brands: brands.slice(0, 4),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
