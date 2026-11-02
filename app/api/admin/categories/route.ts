export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { getAdminCategories, createCategory } from '@/services/product.service';
import { categorySchema } from '@/lib/validations';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const categories = await getAdminCategories(business.id);
    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const body = await req.json();
    const validated = categorySchema.parse(body);

    const category = await createCategory(business.id, {
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      sortOrder: validated.sortOrder,
      isActive: validated.isActive,
    });

    return NextResponse.json({ success: true, category });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create category' }, { status: 400 });
  }
}
