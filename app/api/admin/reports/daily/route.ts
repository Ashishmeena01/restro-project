export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { getDailySalesReport } from '@/services/report.service';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || undefined;

    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const report = await getDailySalesReport(business.id, date);
    return NextResponse.json({ report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to generate report' }, { status: 500 });
  }
}
