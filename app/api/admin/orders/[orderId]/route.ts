export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/services/order.service';
import prisma from '@/lib/db/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const { orderStatus } = await req.json();

    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({
      where: { slug: defaultSlug },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const updated = await updateOrderStatus(business.id, orderId, orderStatus);

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order status' }, { status: 400 });
  }
}
