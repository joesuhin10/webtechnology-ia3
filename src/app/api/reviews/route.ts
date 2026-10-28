import { NextRequest, NextResponse } from 'next/server';
import { getReviews, createReview } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = getReviews(productId);
    return NextResponse.json(reviews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.productId || !body.rating || !body.comment || !body.userName) {
      return NextResponse.json(
        { error: 'Missing required review fields (productId, rating, comment, userName)' },
        { status: 400 }
      );
    }

    const review = createReview(body);
    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
