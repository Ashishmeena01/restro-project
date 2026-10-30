import prisma from '@/lib/db/prisma';
import { getRazorpayClient, verifyRazorpaySignature, verifyWebhookSignature } from '@/lib/payments/razorpay';
import { generateReceiptForOrder } from '@/services/receipt.service';

/**
 * Creates a Razorpay payment order for an existing pending internal order
 */
export async function createRazorpayOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      business: { include: { settings: true } },
      payment: true,
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'SUCCESS') {
    throw new Error('Order has already been paid');
  }

  const razorpay = getRazorpayClient(
    order.business.settings?.razorpayKeyId || undefined,
    order.business.settings?.razorpayKeySecret || undefined
  );

  let razorpayOrderId = order.payment?.razorpayOrderId;

  if (!razorpayOrderId) {
    try {
      // Amount in Razorpay is also in smallest currency unit (paise)
      const rzpOrder = await razorpay.orders.create({
        amount: order.total,
        currency: order.business.currency || 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: order.id,
          businessSlug: order.business.slug,
          customerName: order.customerName || 'Customer',
        },
      });

      razorpayOrderId = rzpOrder.id;

      // Update payment record with razorpayOrderId
      if (order.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: { razorpayOrderId },
        });
      }
    } catch (err: any) {
      console.warn('Razorpay order creation fallback (development mode):', err.message);
      // Fallback for development if using dummy keys
      razorpayOrderId = `order_dev_${order.id.slice(-8)}`;
      if (order.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: { razorpayOrderId },
        });
      }
    }
  }

  return {
    razorpayOrderId,
    amount: order.total,
    currency: order.business.currency || 'INR',
    keyId: order.business.settings?.razorpayKeyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
    businessName: order.business.name,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
  };
}

/**
 * Verifies Razorpay payment signature server-side and confirms the order idempotently
 */
export async function verifyAndProcessPayment({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      business: { include: { settings: true } },
      payment: true,
      items: true,
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Idempotency: If already marked SUCCESS, return existing confirmation
  if (order.paymentStatus === 'SUCCESS') {
    return { success: true, message: 'Payment already processed', orderId: order.id };
  }

  const secret = order.business.settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || 'placeholder_razorpay_secret';

  // Cryptographic HMAC-SHA256 verification
  const isValidSignature = verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    secret,
  });

  if (!isValidSignature) {
    // Record failed payment attempt
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: 'FAILED',
          failureReason: 'Signature verification failed',
        },
      });
    }
    throw new Error('Invalid payment signature. Transaction could not be verified.');
  }

  // Atomic confirmation transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Update Payment record
    const updatedPayment = await tx.payment.update({
      where: { orderId: order.id },
      data: {
        status: 'SUCCESS',
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    // 2. Update Order to CONFIRMED and paymentStatus = SUCCESS
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        orderStatus: 'CONFIRMED',
        paymentStatus: 'SUCCESS',
      },
      include: { items: true, table: true },
    });

    return { updatedOrder, updatedPayment };
  });

  // 3. Generate immutable digital receipt
  await generateReceiptForOrder(order.id, 'ONLINE_RAZORPAY', razorpayPaymentId);

  return {
    success: true,
    orderId: result.updatedOrder.id,
    orderNumber: result.updatedOrder.orderNumber,
  };
}

/**
 * Confirm a cash payment by Admin/Staff at counter
 */
export async function confirmCashPayment(orderId: string, businessId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, businessId },
    include: { payment: true },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'SUCCESS') {
    return { success: true, message: 'Already marked as paid' };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { orderId: order.id },
      data: { status: 'SUCCESS' },
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        orderStatus: order.orderStatus === 'PENDING_PAYMENT' ? 'CONFIRMED' : order.orderStatus,
        paymentStatus: 'SUCCESS',
      },
    });
  });

  const cashTxnRef = `CASH-${order.id.slice(-6).toUpperCase()}`;
  await generateReceiptForOrder(order.id, 'CASH', cashTxnRef);

  return { success: true };
}

/** Complete a simulated payment for local development and demos only. */
export async function confirmTestPayment(orderId: string) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Test payments are only available outside production.');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order) throw new Error('Order not found');
  if (order.paymentMethod !== 'TEST' || !order.payment) {
    throw new Error('This order is not a test payment.');
  }

  if (order.paymentStatus !== 'SUCCESS') {
    const testPaymentId = `pay_test_${order.id}`;
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId: order.id },
        data: { status: 'SUCCESS', razorpayPaymentId: testPaymentId },
      });
      await tx.order.update({
        where: { id: order.id },
        data: { orderStatus: 'CONFIRMED', paymentStatus: 'SUCCESS' },
      });
    });
    await generateReceiptForOrder(order.id, 'TEST', testPaymentId);
  }

  return { success: true, orderId: order.id };
}

/**
 * Handle incoming Razorpay Webhooks idempotently
 */
export async function handleRazorpayWebhook(rawBody: string, signature: string) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';

  const isValid = verifyWebhookSignature({
    rawBody,
    signature,
    webhookSecret,
  });

  if (!isValid && webhookSecret !== 'placeholder_webhook_secret') {
    throw new Error('Invalid webhook signature');
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event;

  if (eventType === 'payment.captured') {
    const paymentEntity = event.payload?.payment?.entity;
    const rzpOrderId = paymentEntity?.order_id;
    const rzpPaymentId = paymentEntity?.id;

    if (rzpOrderId) {
      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId: rzpOrderId },
      });

      if (payment && payment.status !== 'SUCCESS') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            razorpayPaymentId: rzpPaymentId,
          },
        });

        await prisma.order.update({
          where: { id: payment.orderId },
          data: {
            orderStatus: 'CONFIRMED',
            paymentStatus: 'SUCCESS',
          },
        });

        await generateReceiptForOrder(payment.orderId, 'ONLINE_RAZORPAY', rzpPaymentId);
      }
    }
  } else if (eventType === 'payment.failed') {
    const paymentEntity = event.payload?.payment?.entity;
    const rzpOrderId = paymentEntity?.order_id;
    if (rzpOrderId) {
      await prisma.payment.updateMany({
        where: { razorpayOrderId: rzpOrderId },
        data: {
          status: 'FAILED',
          failureReason: paymentEntity?.error_description || 'Payment failed',
        },
      });
    }
  }

  return { received: true };
}
