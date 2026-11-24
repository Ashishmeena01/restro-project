export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/auth';
import { updateOrderStatus } from '@/services/order.service';

// Kitchen staff can move an order through the preparation workflow.
// CONFIRMED is allowed as a "recall" target if a status was tapped by mistake.
const ALLOWED_KITCHEN_STATUSES = ['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await requireAuth(['ADMIN', 'STAFF', 'KITCHEN']);
    const { orderId } = await params;
    const body = await req.json();
    const nextStatus = String(body?.orderStatus || '').toUpperCase();

    if (!ALLOWED_KITCHEN_STATUSES.includes(nextStatus)) {
      return NextResponse.json({ error: 'Invalid kitchen order status' }, { status: 400 });
    }

    const updated = await updateOrderStatus(session.businessId, orderId, nextStatus);

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update kitchen order status';
    const status = message.startsWith('Unauthorized')
      ? 401
      : message.startsWith('Forbidden')
        ? 403
        : message === 'Order not found'
          ? 404
          : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
