import { NextResponse } from 'next/server';
import { getBrands } from '@/lib/db';

export async function GET() {
  try {
    const brands = getBrands();
    return NextResponse.json(brands);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
