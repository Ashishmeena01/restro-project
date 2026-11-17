import React from 'react';
import prisma from '@/lib/db/prisma';
import { AdminPaymentsClient } from '@/components/admin/AdminPaymentsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  let payments: any[] = [];

  try {
    const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });
    if (business) {
      payments = await prisma.payment.findMany({
        where: { businessId: business.id },
        include: {
          order: {
            select: {
              orderNumber: true,
              customerName: true,
            },
          },
          refunds: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }
  } catch (e) {
    console.error('Error fetching payments:', e);
  }

  return <AdminPaymentsClient payments={payments} />;
}
