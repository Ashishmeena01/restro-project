import React from 'react';
import { getDashboardOverviewMetrics } from '@/services/report.service';
import prisma from '@/lib/db/prisma';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  let business = null;
  let metrics = null;

  try {
    business = await prisma.business.findUnique({
      where: { slug: defaultSlug },
    });
    if (business) {
      metrics = await getDashboardOverviewMetrics(business.id);
    }
  } catch (e) {
    console.error('Error loading admin dashboard metrics:', e);
  }

  if (!business || !metrics) {
    const fallbackMetrics = {
      todayRevenue: 0,
      successfulOrdersCount: 0,
      totalUnitsSoldToday: 0,
      avgOrderValue: 0,
      pendingOrdersCount: 0,
      bestSellerToday: null,
      chartData: [],
      recentOrders: [],
    };
    return <AdminDashboardClient businessName="Vrindavan Sweets" metrics={fallbackMetrics} />;
  }

  return <AdminDashboardClient businessName={business.name} metrics={metrics} />;
}
