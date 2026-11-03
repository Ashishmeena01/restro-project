export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({
      where: { slug: defaultSlug },
      include: { settings: true },
    });

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    return NextResponse.json({
      business,
      settings: business.settings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
    const business = await prisma.business.findUnique({
      where: { slug: defaultSlug },
      include: { settings: true },
    });

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const body = await req.json();

    // Update business table
    const updatedBusiness = await prisma.business.update({
      where: { id: business.id },
      data: {
        name: body.name?.trim(),
        tagline: body.tagline?.trim(),
        address: body.address?.trim(),
        phone: body.phone?.trim(),
        email: body.email?.trim(),
        openingHours: body.openingHours?.trim(),
        taxRatePercent: body.taxRatePercent ?? 5,
        fssaiNumber: body.fssaiNumber?.trim() || null,
      },
    });

    // Upsert business settings
    const updatedSettings = await prisma.businessSettings.upsert({
      where: { businessId: business.id },
      create: {
        businessId: business.id,
        upiId: body.upiId?.trim() || null,
        razorpayKeyId: body.razorpayKeyId?.trim() || null,
        razorpayKeySecret: body.razorpayKeySecret?.trim() || null,
        enableCash: body.enableCash ?? true,
        enableOnline: body.enableOnline ?? true,
        defaultGstPercent: body.taxRatePercent ?? 5,
        receiptFooter: body.receiptFooter?.trim() || null,
      },
      update: {
        upiId: body.upiId?.trim() || null,
        razorpayKeyId: body.razorpayKeyId?.trim() || null,
        razorpayKeySecret: body.razorpayKeySecret?.trim() || null,
        enableCash: body.enableCash ?? true,
        enableOnline: body.enableOnline ?? true,
        defaultGstPercent: body.taxRatePercent ?? 5,
        receiptFooter: body.receiptFooter?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      business: updatedBusiness,
      settings: updatedSettings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save settings' }, { status: 400 });
  }
}
