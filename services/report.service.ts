import prisma from '@/lib/db/prisma';

export interface DailySalesReport {
  date: string;
  totalOrders: number;
  successfulOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  unitsSold: number;
  grossSales: number; // in paise
  discounts: number;  // in paise
  refunds: number;    // in paise
  netSales: number;   // in paise (grossSales - refunds - discounts)
  averageOrderValue: number; // in paise
}

export interface BestSellingProductItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantitySold: number;
  totalRevenue: number; // in paise
  categoryName?: string;
}

/**
 * Calculates Daily Sales Report for a given date in YYYY-MM-DD
 */
export async function getDailySalesReport(businessId: string, dateString?: string): Promise<DailySalesReport> {
  const targetDate = dateString ? new Date(dateString) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // 1. Fetch orders for this day
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      createdAt: { gte: startOfDay, lte: endOfDay },
    },
    include: {
      items: true,
      refunds: true,
    },
  });

  const totalOrders = orders.length;
  let successfulOrders = 0;
  let pendingOrders = 0;
  let cancelledOrders = 0;
  let unitsSold = 0;
  let grossSales = 0;
  let discounts = 0;
  let refunds = 0;

  for (const order of orders) {
    if (order.orderStatus === 'CANCELLED') {
      cancelledOrders++;
      continue;
    }

    if (order.paymentStatus === 'PENDING') {
      pendingOrders++;
    }

    if (order.paymentStatus === 'SUCCESS' || order.paymentStatus === 'REFUNDED') {
      successfulOrders++;
      grossSales += order.total;
      discounts += order.discount;

      for (const item of order.items) {
        unitsSold += item.quantity;
      }

      for (const ref of order.refunds) {
        refunds += ref.amount;
      }
    }
  }

  const netSales = Math.max(0, grossSales - refunds - discounts);
  const averageOrderValue = successfulOrders > 0 ? Math.round(grossSales / successfulOrders) : 0;

  return {
    date: startOfDay.toISOString().slice(0, 10),
    totalOrders,
    successfulOrders,
    pendingOrders,
    cancelledOrders,
    unitsSold,
    grossSales,
    discounts,
    refunds,
    netSales,
    averageOrderValue,
  };
}

/**
 * Calculates Monthly Best-Selling Products:
 * Distinguishes between "Most Popular" (highest quantity) and "Highest Revenue" (highest sales).
 * Excludes cancelled orders and adjusts for refunds.
 */
export async function getMonthlyBestSellers({
  businessId,
  year,
  month, // 1 to 12
  sortBy = 'quantity', // 'quantity' | 'revenue'
  limit = 10,
}: {
  businessId: string;
  year: number;
  month: number;
  sortBy?: 'quantity' | 'revenue';
  limit?: number;
}) {
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // Retrieve successful orders with their items, excluding CANCELLED
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      createdAt: { gte: startDate, lte: endDate },
      orderStatus: { not: 'CANCELLED' },
      paymentStatus: { in: ['SUCCESS', 'REFUNDED'] },
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
      refunds: true,
    },
  });

  // Calculate refund ratio per order if refunds exist
  const productAggMap = new Map<string, BestSellingProductItem>();

  for (const order of orders) {
    const totalOrderAmount = order.total;
    const totalRefunded = order.refunds.reduce((acc, r) => acc + r.amount, 0);

    // If fully or partially refunded, adjust net revenue proportionally
    const revenueFactor = totalOrderAmount > 0
      ? Math.max(0, (totalOrderAmount - totalRefunded) / totalOrderAmount)
      : 1;

    for (const item of order.items) {
      const prodKey = item.productId || item.productName;
      const current = productAggMap.get(prodKey) || {
        productId: item.productId || prodKey,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantitySold: 0,
        totalRevenue: 0,
        categoryName: item.product?.category?.name || 'Uncategorized',
      };

      // If whole order was refunded, units may still reflect served or adjusted
      const adjustedItemRevenue = Math.round(item.totalPrice * revenueFactor);

      current.quantitySold += item.quantity;
      current.totalRevenue += adjustedItemRevenue;

      productAggMap.set(prodKey, current);
    }
  }

  const allItems = Array.from(productAggMap.values());

  // Sort according to requested metric
  if (sortBy === 'revenue') {
    allItems.sort((a, b) => b.totalRevenue - a.totalRevenue);
  } else {
    allItems.sort((a, b) => b.quantitySold - a.quantitySold);
  }

  const sliced = allItems.slice(0, limit);

  // Also determine the single Most Popular and Highest Revenue products overall
  const mostPopular = [...allItems].sort((a, b) => b.quantitySold - a.quantitySold)[0] || null;
  const highestRevenue = [...allItems].sort((a, b) => b.totalRevenue - a.totalRevenue)[0] || null;

  return {
    year,
    month,
    sortBy,
    items: sliced,
    mostPopular,
    highestRevenue,
  };
}

/**
 * Overview dashboard metrics
 */
export async function getDashboardOverviewMetrics(businessId: string) {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Today's orders
  const todayOrders = await prisma.order.findMany({
    where: {
      businessId,
      createdAt: { gte: todayStart, lte: todayEnd },
    },
    include: {
      items: true,
      refunds: true,
    },
  });

  let todayRevenue = 0;
  let successfulOrdersCount = 0;
  let totalUnitsSoldToday = 0;
  let pendingOrdersCount = 0;
  const todayProductMap = new Map<string, { name: string; qty: number; revenue: number }>();

  for (const o of todayOrders) {
    if (o.orderStatus === 'CANCELLED') continue;

    if (o.orderStatus === 'PENDING_PAYMENT' || o.paymentStatus === 'PENDING') {
      pendingOrdersCount++;
    }

    if (o.paymentStatus === 'SUCCESS') {
      successfulOrdersCount++;
      todayRevenue += o.total;

      for (const it of o.items) {
        totalUnitsSoldToday += it.quantity;
        const cur = todayProductMap.get(it.productName) || { name: it.productName, qty: 0, revenue: 0 };
        cur.qty += it.quantity;
        cur.revenue += it.totalPrice;
        todayProductMap.set(it.productName, cur);
      }
    }
  }

  const avgOrderValue = successfulOrdersCount > 0 ? Math.round(todayRevenue / successfulOrdersCount) : 0;

  // Best-seller today
  const sortedTodayProducts = Array.from(todayProductMap.values()).sort((a, b) => b.qty - a.qty);
  const bestSellerToday = sortedTodayProducts[0] || null;

  // Recent 6 orders
  const recentOrders = await prisma.order.findMany({
    where: { businessId },
    include: {
      items: true,
      table: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  // 7-day revenue trend for chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyOrders = await prisma.order.findMany({
    where: {
      businessId,
      createdAt: { gte: sevenDaysAgo },
      paymentStatus: 'SUCCESS',
      orderStatus: { not: 'CANCELLED' },
    },
    select: {
      total: true,
      createdAt: true,
    },
  });

  const dailyTrendMap = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    dailyTrendMap.set(key, 0);
  }

  for (const o of weeklyOrders) {
    const key = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (dailyTrendMap.has(key)) {
      dailyTrendMap.set(key, (dailyTrendMap.get(key) || 0) + o.total);
    }
  }

  const chartData = Array.from(dailyTrendMap.entries()).map(([day, revenuePaise]) => ({
    date: day,
    revenue: Math.round(revenuePaise / 100), // in Rupees for clean chart display
    revenuePaise,
  }));

  return {
    todayRevenue,
    successfulOrdersCount,
    totalUnitsSoldToday,
    avgOrderValue,
    pendingOrdersCount,
    bestSellerToday,
    recentOrders,
    chartData,
  };
}
