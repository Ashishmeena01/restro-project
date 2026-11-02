export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { getAdminProducts, createProduct } from '@/services/product.service';
import { productSchema } from '@/lib/validations';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const search = searchParams.get('search') || undefined;

    const products = await getAdminProducts(business.id, { categoryId, search });
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const body = await req.json();
    const validated = productSchema.parse(body);

    const product = await createProduct(business.id, {
      name: validated.name,
      categoryId: validated.categoryId,
      description: validated.description,
      imageUrl: validated.imageUrl,
      price: validated.price,
      isVeg: validated.isVeg,
      isAvailable: validated.isAvailable,
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 400 });
  }
}
