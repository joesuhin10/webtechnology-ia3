import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const purpose = searchParams.get('purpose') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const paperGsm = searchParams.get('paperGsm') ? Number(searchParams.get('paperGsm')) : undefined;
    const writingType = searchParams.get('writingType') || undefined;
    const isNew = searchParams.get('filter') === 'new' ? true : undefined;
    const isBestseller = searchParams.get('filter') === 'bestseller' ? true : undefined;
    const sort = (searchParams.get('sort') as any) || 'featured';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 50;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;

    const result = getProducts({
      search,
      category,
      brand,
      purpose,
      minPrice,
      maxPrice,
      rating,
      inStockOnly,
      paperGsm,
      writingType,
      isNew,
      isBestseller,
      sort,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.price || !body.brand || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields (name, price, brand, category)' },
        { status: 400 }
      );
    }

    const newProduct = createProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
