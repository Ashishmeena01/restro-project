export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { getPublicMenu } from '@/services/product.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';

    const menuData = await getPublicMenu(slug);

    if (!menuData) {
      return NextResponse.json({ error: 'Business menu not found' }, { status: 404 });
    }

    return NextResponse.json(menuData);
  } catch (err: any) {
    console.error('API menu error:', err);
    return NextResponse.json({ error: err.message || 'Failed to load menu' }, { status: 500 });
  }
}
