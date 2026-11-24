import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// Orders that still need the kitchen's attention.
const KITCHEN_ACTIVE_STATUSES = ['CONFIRMED', 'PREPARING', 'READY'];

// A restaurant "service day" starts at 5:00 AM IST, so orders taken late at
// night stay on the board until the next morning instead of lingering for 24h.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const SERVICE_DAY_START_HOUR_IST = 5;

function getServiceDayStartCutoff() {
  const now = Date.now();
  const shiftedNow = now + IST_OFFSET_MS - SERVICE_DAY_START_HOUR_IST * 60 * 60 * 1000;
  const shiftedDayStart = Math.floor(shiftedNow / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
  return new Date(
    shiftedDayStart - IST_OFFSET_MS + SERVICE_DAY_START_HOUR_IST * 60 * 60 * 1000
  );
}

export async function GET(req: Request) {
  try {
    const session = await requireAuth(['ADMIN', 'STAFF', 'KITCHEN']);
    const { searchParams } = new URL(req.url);

    const requestedStatuses = (searchParams.get('status') || '')
      .split(',')
      .map((status) => status.trim().toUpperCase())
      .filter((status) => KITCHEN_ACTIVE_STATUSES.includes(status));
    const statuses = requestedStatuses.length > 0 ? requestedStatuses : KITCHEN_ACTIVE_STATUSES;

    const queueCutoff = getServiceDayStartCutoff();

    const [orders, groupedCounts] = await Promise.all([
      prisma.order.findMany({
        where: {
          businessId: session.businessId,
          orderStatus: { in: statuses },
          createdAt: { gte: queueCutoff },
        },
        include: {
          items: { orderBy: { createdAt: 'asc' } },
          table: true,
        },
        orderBy: { createdAt: 'asc' },
        take: 200,
      }),
      prisma.order.groupBy({
        by: ['orderStatus'],
        where: {
          businessId: session.businessId,
          orderStatus: { in: KITCHEN_ACTIVE_STATUSES },
          createdAt: { gte: queueCutoff },
        },
        _count: { _all: true },
      }),
    ]);

    const counts = KITCHEN_ACTIVE_STATUSES.reduce<Record<string, number>>((acc, status) => {
      acc[status] = groupedCounts.find((row) => row.orderStatus === status)?._count._all ?? 0;
      return acc;
    }, {});

    return NextResponse.json({
      orders,
      counts,
      totalActive: Object.values(counts).reduce((sum, count) => sum + count, 0),
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch kitchen orders';
    const status = message.startsWith('Unauthorized')
      ? 401
      : message.startsWith('Forbidden')
        ? 403
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
