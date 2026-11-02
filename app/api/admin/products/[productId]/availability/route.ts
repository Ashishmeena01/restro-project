export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { toggleProductAvailability } from '@/services/product.service';
import prisma from '@/lib/db/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { isAvailable } = await req.json();

    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const updated = await toggleProductAvailability(business.id, productId, isAvailable);

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to toggle availability' }, { status: 400 });
  }
}
