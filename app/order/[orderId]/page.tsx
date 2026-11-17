import React from 'react';
import { notFound } from 'next/navigation';
import { getOrderById } from '@/services/order.service';
import { OrderClient } from '@/components/order/OrderClient';

export const dynamic = 'force-dynamic';

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  let order = null;

  try {
    order = await getOrderById(orderId);
  } catch (e) {
    console.error('Error fetching order by id:', e);
  }

  if (!order) {
    notFound();
  }

  return <OrderClient order={order} />;
}
