import { NextRequest, NextResponse } from 'next/server';
import { getRFQs, createRFQ } from '@/lib/db';

export async function GET() {
  try {
    const rfqs = getRFQs();
    return NextResponse.json(rfqs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.organization || !body.contactPerson || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required organization, contact person, email or phone.' },
        { status: 400 }
      );
    }

    const rfq = createRFQ(body);
    return NextResponse.json(rfq, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
