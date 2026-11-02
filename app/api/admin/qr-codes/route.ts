export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { getBusinessQrCodes } from '@/services/qr.service';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    // Prefer configured network/public URL so phones can open scanned links
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
    const url = new URL(req.url);
    const requestUrl = `${url.protocol}//${url.host}`;
    const baseUrl = configuredUrl || requestUrl;

    const data = await getBusinessQrCodes(business.id, baseUrl);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load QR codes' }, { status: 500 });
  }
}
