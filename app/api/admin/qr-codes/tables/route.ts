export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { createTableWithQr } from '@/services/qr.service';
import prisma from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const { tableNumber, capacity } = await req.json();

    if (!tableNumber) {
      return NextResponse.json({ error: 'Table number is required' }, { status: 400 });
    }

    const table = await createTableWithQr(business.id, tableNumber, capacity);
    return NextResponse.json({ success: true, table });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create table' }, { status: 400 });
  }
}
