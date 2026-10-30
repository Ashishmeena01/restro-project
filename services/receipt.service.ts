import prisma from '@/lib/db/prisma';

export async function generateReceiptForOrder(
  orderId: string,
  paymentMethod: string,
  transactionRef?: string
) {
  const existingReceipt = await prisma.receipt.findUnique({
    where: { orderId },
  });

  if (existingReceipt) {
    return existingReceipt;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      business: true,
      table: true,
      items: true,
    },
  });

  if (!order) {
    throw new Error('Order not found for receipt generation');
  }

  // Generate unique sequential receipt number
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const countToday = await prisma.receipt.count({
    where: {
      businessId: order.businessId,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });
  const receiptNumber = `REC-${datePart}-${String(countToday + 1).padStart(4, '0')}`;

  const receiptSnapshot = {
    businessName: order.business.name,
    businessAddress: order.business.address,
    businessPhone: order.business.phone,
    fssaiNumber: order.business.fssaiNumber,
    orderNumber: order.orderNumber,
    receiptNumber,
    tableNumber: order.table?.tableNumber || 'Takeaway / Counter',
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    date: new Date().toISOString(),
    paymentMethod,
    transactionRef: transactionRef || null,
    items: order.items.map((it) => ({
      name: it.productName,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      totalPrice: it.totalPrice,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    discount: order.discount,
    total: order.total,
  };

  return await prisma.receipt.create({
    data: {
      businessId: order.businessId,
      orderId: order.id,
      receiptNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      paymentMethod,
      transactionRef: transactionRef || null,
      receiptDataJson: JSON.stringify(receiptSnapshot),
    },
  });
}

export async function getReceiptByOrderId(orderId: string) {
  return await prisma.receipt.findUnique({
    where: { orderId },
    include: {
      order: {
        include: {
          items: true,
          table: true,
          business: true,
        },
      },
    },
  });
}

export async function getReceiptByNumber(receiptNumber: string) {
  return await prisma.receipt.findUnique({
    where: { receiptNumber },
    include: {
      order: {
        include: {
          items: true,
          table: true,
          business: true,
        },
      },
    },
  });
}

export async function getAdminReceipts(
  businessId: string,
  filters?: {
    search?: string;
    date?: string;
    limit?: number;
  }
) {
  const where: any = { businessId };

  if (filters?.date) {
    const start = new Date(`${filters.date}T00:00:00.000Z`);
    const end = new Date(`${filters.date}T23:59:59.999Z`);
    where.createdAt = { gte: start, lte: end };
  }

  if (filters?.search && filters.search.trim()) {
    where.OR = [
      { receiptNumber: { contains: filters.search.trim() } },
      { customerName: { contains: filters.search.trim() } },
      { customerPhone: { contains: filters.search.trim() } },
    ];
  }

  return await prisma.receipt.findMany({
    where,
    include: {
      order: {
        select: {
          orderNumber: true,
          paymentMethod: true,
          orderStatus: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit ?? 50,
  });
}
