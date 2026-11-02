export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { confirmCashPayment } from '@/services/payment.service';
import prisma from '@/lib/db/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({
      where: { slug: defaultSlug },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const result = await confirmCashPayment(orderId, business.id);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to confirm cash payment' }, { status: 400 });
  }
}
