import { NextRequest, NextResponse } from 'next/server';
import { updateRFQStatus, addAuditLog } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = updateRFQStatus(id, body.status);
    if (!updated) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
    }

    addAuditLog({
      adminUser: 'Admin Joe',
      action: 'UPDATE_RFQ_STATUS',
      entity: 'BulkOrderRFQ',
      entityId: id,
      details: `Updated RFQ for ${updated.organization} to status ${updated.status}`,
      ip: '127.0.0.1',
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
