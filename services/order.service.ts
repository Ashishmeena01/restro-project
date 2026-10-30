import prisma from '@/lib/db/prisma';

export interface CreateOrderInput {
  businessSlug: string;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'ONLINE_RAZORPAY' | 'CASH' | 'TEST';
  notes?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

/**
 * Validates cart items, verifies server-side prices, calculates tax, and creates order
 */
export async function createOrder(input: CreateOrderInput) {
  const business = await prisma.business.findUnique({
    where: { slug: input.businessSlug },
    include: { settings: true },
  });

  if (!business) {
    throw new Error('Business not found');
  }

  if (!input.items || input.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // 1. Fetch products from DB to strictly validate availability & prices server-side
  const productIds = input.items.map((i) => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      businessId: business.id,
    },
  });

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const snapshotItems: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[] = [];

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product not found or unavailable: ${item.productId}`);
    }

    if (!product.isAvailable) {
      throw new Error(`Item "${product.name}" is currently sold out.`);
    }

    if (item.quantity <= 0) {
      throw new Error(`Invalid quantity for item "${product.name}"`);
    }

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    snapshotItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price, // in paise
      quantity: item.quantity,
      totalPrice: lineTotal,    // in paise
    });
  }

  // 2. Tax calculation (e.g. 5% GST)
  const taxRate = business.taxRatePercent ?? 5;
  const tax = Math.round((subtotal * taxRate) / 100);
  const total = subtotal + tax;

  // 3. Resolve table if tableNumber provided
  let tableId: string | null = null;
  if (input.tableNumber) {
    const table = await prisma.restaurantTable.findFirst({
      where: {
        businessId: business.id,
        tableNumber: input.tableNumber.trim(),
        isActive: true,
      },
    });
    if (table) {
      tableId = table.id;
    }
  }

  // 4. Generate unique sequential Order Number
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const countToday = await prisma.order.count({
    where: {
      businessId: business.id,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });
  const orderNumber = `ORD-${datePart}-${String(countToday + 1).padStart(4, '0')}`;

  // 5. Initial status based on payment method
  const initialOrderStatus = input.paymentMethod === 'CASH' ? 'CONFIRMED' : 'PENDING_PAYMENT';
  const initialPaymentStatus = 'PENDING';

  // 6. Execute atomic database transaction
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        businessId: business.id,
        orderNumber,
        tableId,
        customerName: input.customerName?.trim() || null,
        customerPhone: input.customerPhone?.trim() || null,
        subtotal,
        tax,
        discount: 0,
        total,
        orderStatus: initialOrderStatus,
        paymentStatus: initialPaymentStatus,
        paymentMethod: input.paymentMethod,
        notes: input.notes?.trim() || null,
        items: {
          create: snapshotItems,
        },
      },
      include: {
        items: true,
        table: true,
      },
    });

    // Create corresponding pending payment record
    const payment = await tx.payment.create({
      data: {
        businessId: business.id,
        orderId: order.id,
        amount: total,
        currency: business.currency,
        status: initialPaymentStatus,
        paymentMethod: input.paymentMethod,
      },
    });

    return { order, payment, business };
  });

  return result;
}

export async function getOrderById(orderId: string, businessId?: string) {
  const where: any = { id: orderId };
  if (businessId) {
    where.businessId = businessId;
  }

  return await prisma.order.findFirst({
    where,
    include: {
      items: true,
      table: true,
      payment: true,
      receipt: true,
      business: true,
    },
  });
}

export async function getOrderByNumber(orderNumber: string, businessId?: string) {
  const where: any = { orderNumber };
  if (businessId) {
    where.businessId = businessId;
  }

  return await prisma.order.findFirst({
    where,
    include: {
      items: true,
      table: true,
      payment: true,
      receipt: true,
      business: true,
    },
  });
}

export async function getAdminOrders(
  businessId: string,
  filters?: {
    status?: string;
    date?: string; // YYYY-MM-DD
    search?: string;
    limit?: number;
  }
) {
  const where: any = { businessId };

  if (filters?.status && filters.status !== 'all') {
    where.orderStatus = filters.status;
  }

  if (filters?.date) {
    const start = new Date(`${filters.date}T00:00:00.000Z`);
    const end = new Date(`${filters.date}T23:59:59.999Z`);
    where.createdAt = { gte: start, lte: end };
  }

  if (filters?.search && filters.search.trim()) {
    where.OR = [
      { orderNumber: { contains: filters.search.trim() } },
      { customerName: { contains: filters.search.trim() } },
      { customerPhone: { contains: filters.search.trim() } },
    ];
  }

  return await prisma.order.findMany({
    where,
    include: {
      items: true,
      table: true,
      payment: true,
      receipt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit ?? 50,
  });
}

export async function updateOrderStatus(
  businessId: string,
  orderId: string,
  newStatus: string
) {
  const existing = await prisma.order.findFirst({
    where: { id: orderId, businessId },
    include: { payment: true, receipt: true },
  });

  if (!existing) {
    throw new Error('Order not found');
  }

  // Update order status
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: newStatus },
    include: { items: true, table: true, payment: true, receipt: true },
  });

  return updated;
}
