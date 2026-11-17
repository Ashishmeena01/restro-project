import React from 'react';
import prisma from '@/lib/db/prisma';
import { AdminReceiptsClient } from '@/components/admin/AdminReceiptsClient';

export const dynamic = 'force-dynamic';

export default async function AdminReceiptsPage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  let receipts: any[] = [];

  try {
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });
    if (business) {
      receipts = await prisma.receipt.findMany({
        where: { businessId: business.id },
        include: {
          order: {
            select: {
              orderNumber: true,
              table: { select: { tableNumber: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }
  } catch (e) {
    console.error('Error fetching receipts:', e);
  }

  return <AdminReceiptsClient receipts={receipts} />;
}
