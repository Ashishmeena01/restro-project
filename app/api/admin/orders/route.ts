
import { NextResponse } from 'next/server';
import { getAdminOrders } from '@/services/order.service';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const date = searchParams.get('date') || undefined;
    const search = searchParams.get('search') || undefined;

    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({
      where: { slug: defaultSlug },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const orders = await getAdminOrders(business.id, {
      status,
      date,
      search,
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch orders' }, { status: 500 });
  }
}
