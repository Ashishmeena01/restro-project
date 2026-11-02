export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { getMonthlyBestSellers } from '@/services/report.service';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const sortBy = (searchParams.get('sortBy') as 'quantity' | 'revenue') || 'quantity';
    const limit = parseInt(searchParams.get('limit') || '10');

    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const result = await getMonthlyBestSellers({
      businessId: business.id,
      year,
      month,
      sortBy,
      limit,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to compute best sellers' }, { status: 500 });
  }
}
