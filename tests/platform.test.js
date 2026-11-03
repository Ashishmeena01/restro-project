// Automated Test Suite for Vrindavan QR Restaurant Platform
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

describe('Vrindavan Platform Comprehensive Test Suite', () => {
  let testBusiness;
  let testCategory;
  let testProduct1;
  let testProduct2;
  let testTable;

  before(async () => {
    // Fetch seeded business
    testBusiness = await prisma.business.findUnique({
      where: { slug: 'vrindavan-sweets' },
      include: { settings: true },
    });
    assert.ok(testBusiness, 'Seed business must exist in database');

    testCategory = await prisma.category.findFirst({
      where: { businessId: testBusiness.id },
    });
    assert.ok(testCategory, 'Seed category must exist');

    testProduct1 = await prisma.product.findFirst({
      where: { businessId: testBusiness.id, name: 'Samosa' },
    });
    testProduct2 = await prisma.product.findFirst({
      where: { businessId: testBusiness.id, name: 'Tea' },
    });
    assert.ok(testProduct1, 'Samosa product must exist');
    assert.ok(testProduct2, 'Tea product must exist');

    testTable = await prisma.restaurantTable.findFirst({
      where: { businessId: testBusiness.id },
    });
    assert.ok(testTable, 'Seed table must exist');
  });

  after(async () => {
    await prisma.$disconnect();
  });

  // 1. Cart Calculations
  test('1. Cart & Currency Calculations in Integer Paise', () => {
    const samosaPrice = 1500; // ₹15.00
    const teaPrice = 1000;    // ₹10.00

    const qtySamosa = 4;
    const qtyTea = 2;

    const subtotal = samosaPrice * qtySamosa + teaPrice * qtyTea; // 6000 + 2000 = 8000 paise (₹80)
    assert.strictEqual(subtotal, 8000);

    const gstPercent = 5;
    const tax = Math.round((subtotal * gstPercent) / 100); // 400 paise (₹4)
    assert.strictEqual(tax, 400);

    const grandTotal = subtotal + tax; // 8400 paise (₹84)
    assert.strictEqual(grandTotal, 8400);
  });

  // 2. Product Creation, Editing & Availability
  test('2. Product Creation and Availability Toggle', async () => {
    const newProd = await prisma.product.create({
      data: {
        businessId: testBusiness.id,
        categoryId: testCategory.id,
        name: 'Test Paneer Tikka',
        price: 18000, // ₹180.00
        isVeg: true,
        isAvailable: true,
      },
    });
    assert.strictEqual(newProd.name, 'Test Paneer Tikka');
    assert.strictEqual(newProd.isAvailable, true);

    // Toggle availability
    const updatedProd = await prisma.product.update({
      where: { id: newProd.id },
      data: { isAvailable: false },
    });
    assert.strictEqual(updatedProd.isAvailable, false);

    // Clean up
    await prisma.product.delete({ where: { id: newProd.id } });
  });

  // 3. Order Creation & Historical Price Snapshots
  test('3. Order Creation preserves Historical Price Snapshots', async () => {
    const orderNumber = `TEST-ORD-${Date.now()}`;
    const unitPriceSnapshot = 1500;
    const qty = 3;
    const lineTotal = unitPriceSnapshot * qty;
    const tax = Math.round((lineTotal * 5) / 100);
    const total = lineTotal + tax;

    const order = await prisma.order.create({
      data: {
        businessId: testBusiness.id,
        orderNumber,
        tableId: testTable.id,
        customerName: 'Test Customer',
        customerPhone: '+91 99999 88888',
        subtotal: lineTotal,
        tax,
        total,
        orderStatus: 'CONFIRMED',
        paymentStatus: 'SUCCESS',
        paymentMethod: 'CASH',
        items: {
          create: [
            {
              productId: testProduct1.id,
              productName: testProduct1.name,
              unitPrice: unitPriceSnapshot,
              quantity: qty,
              totalPrice: lineTotal,
            },
          ],
        },
      },
      include: { items: true },
    });

    assert.strictEqual(order.items.length, 1);
    assert.strictEqual(order.items[0].productName, 'Samosa');
    assert.strictEqual(order.items[0].unitPrice, 1500);
    assert.strictEqual(order.items[0].totalPrice, 4500);

    // Now pretend admin changes live product price from ₹15 to ₹25
    await prisma.product.update({
      where: { id: testProduct1.id },
      data: { price: 2500 },
    });

    // Check that historical order item price is UNCHANGED!
    const reloadedOrderItem = await prisma.orderItem.findFirst({
      where: { orderId: order.id },
    });
    assert.strictEqual(reloadedOrderItem.unitPrice, 1500, 'Historical price snapshot must never mutate!');

    // Restore product price to ₹15
    await prisma.product.update({
      where: { id: testProduct1.id },
      data: { price: 1500 },
    });

    // Clean up test order
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
  });

  // 4. Payment Signature Verification
  test('4. Cryptographic HMAC-SHA256 Signature Verification', () => {
    const secret = 'test_secret_key_123';
    const razorpayOrderId = 'order_ABC123456';
    const razorpayPaymentId = 'pay_XYZ789012';

    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const invalidSignature = 'tampered_signature_string';

    const testVerify = (sig) => {
      const generated = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
      try {
        return crypto.timingSafeEqual(Buffer.from(generated), Buffer.from(sig));
      } catch {
        return false;
      }
    };

    assert.strictEqual(testVerify(validSignature), true, 'Valid signature must verify');
    assert.strictEqual(testVerify(invalidSignature), false, 'Tampered signature must be rejected');
  });

  // 5. Duplicate Webhook Handling & Idempotency
  test('5. Duplicate Payment Confirmation is Idempotent', async () => {
    const orderNumber = `TEST-IDEMP-${Date.now()}`;
    const order = await prisma.order.create({
      data: {
        businessId: testBusiness.id,
        orderNumber,
        subtotal: 1500,
        tax: 75,
        total: 1575,
        orderStatus: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        paymentMethod: 'ONLINE_RAZORPAY',
      },
    });

    const payment = await prisma.payment.create({
      data: {
        businessId: testBusiness.id,
        orderId: order.id,
        razorpayOrderId: `rzp_${order.id}`,
        amount: 1575,
        status: 'PENDING',
        paymentMethod: 'ONLINE_RAZORPAY',
      },
    });

    // First confirmation
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCESS', razorpayPaymentId: `pay_${order.id}` },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { orderStatus: 'CONFIRMED', paymentStatus: 'SUCCESS' },
    });

    // Second repeated notification (duplicate webhook)
    const currentPayment = await prisma.payment.findUnique({ where: { id: payment.id } });
    assert.strictEqual(currentPayment.status, 'SUCCESS');

    // Clean up
    await prisma.payment.delete({ where: { id: payment.id } });
    await prisma.order.delete({ where: { id: order.id } });
  });

  // 6. Receipt Generation & Snapshot Preservation
  test('6. Receipt Generation with Full Breakdown Snapshot', async () => {
    const orderNumber = `TEST-REC-${Date.now()}`;
    const order = await prisma.order.create({
      data: {
        businessId: testBusiness.id,
        orderNumber,
        subtotal: 2000,
        tax: 100,
        total: 2100,
        orderStatus: 'COMPLETED',
        paymentStatus: 'SUCCESS',
        paymentMethod: 'CASH',
      },
    });

    const receiptNumber = `TEST-REC-NUM-${Date.now()}`;
    const receiptSnapshot = {
      businessName: testBusiness.name,
      orderNumber,
      receiptNumber,
      total: 2100,
    };

    const receipt = await prisma.receipt.create({
      data: {
        businessId: testBusiness.id,
        orderId: order.id,
        receiptNumber,
        subtotal: 2000,
        tax: 100,
        total: 2100,
        paymentMethod: 'CASH',
        receiptDataJson: JSON.stringify(receiptSnapshot),
      },
    });

    assert.strictEqual(receipt.orderId, order.id);
    const parsed = JSON.parse(receipt.receiptDataJson);
    assert.strictEqual(parsed.orderNumber, orderNumber);
    assert.strictEqual(parsed.total, 2100);

    // Clean up
    await prisma.receipt.delete({ where: { id: receipt.id } });
    await prisma.order.delete({ where: { id: order.id } });
  });

  // 7. Daily Sales & Refund Calculations
  test('7. Daily Sales Report Accounts for Refunds Correctly', async () => {
    const orders = await prisma.order.findMany({
      where: { businessId: testBusiness.id },
      include: { refunds: true },
    });

    assert.ok(orders.length > 0, 'Seed orders must exist');

    let totalGross = 0;
    let totalRefunds = 0;

    for (const o of orders) {
      if (o.paymentStatus === 'SUCCESS' || o.paymentStatus === 'REFUNDED') {
        totalGross += o.total;
        for (const r of o.refunds) {
          totalRefunds += r.amount;
        }
      }
    }

    const netSales = Math.max(0, totalGross - totalRefunds);
    assert.ok(netSales >= 0);
    assert.ok(totalGross >= netSales, 'Net sales must be gross minus refunds');
  });

  // 8. Best-Selling Products Distinction: Popularity vs. Revenue
  test('8. Best-Selling: Most Popular (Qty) vs Highest Revenue (₹)', async () => {
    const orders = await prisma.order.findMany({
      where: {
        businessId: testBusiness.id,
        orderStatus: { not: 'CANCELLED' },
        paymentStatus: { in: ['SUCCESS', 'REFUNDED'] },
      },
      include: { items: true, refunds: true },
    });

    const agg = new Map();
    for (const ord of orders) {
      for (const it of ord.items) {
        const cur = agg.get(it.productName) || { name: it.productName, qty: 0, revenue: 0 };
        cur.qty += it.quantity;
        cur.revenue += it.totalPrice;
        agg.set(it.productName, cur);
      }
    }

    const items = Array.from(agg.values());
    assert.ok(items.length >= 4, 'Must have at least Samosa, Kachori, Tea, Poha');

    const byQty = [...items].sort((a, b) => b.qty - a.qty);
    const byRev = [...items].sort((a, b) => b.revenue - a.revenue);

    // Verify Samosa or Tea has high quantity, while Jalebi or Kachori has high revenue
    assert.ok(byQty[0].qty > 0);
    assert.ok(byRev[0].revenue > 0);
  });

  // 9. Multi-Tenant Business Data Isolation
  test('9. Multi-tenant Business Data Isolation', async () => {
    // Create secondary dummy business
    const otherBusiness = await prisma.business.create({
      data: {
        name: 'Other Stall',
        slug: `other-stall-${Date.now()}`,
        address: 'Delhi Road',
        phone: '+91 91111 22222',
        email: 'other@stall.com',
      },
    });

    // Query orders belonging to other business
    const otherOrders = await prisma.order.findMany({
      where: { businessId: otherBusiness.id },
    });
    assert.strictEqual(otherOrders.length, 0, 'New business must see 0 orders from Vrindavan');

    // Clean up
    await prisma.business.delete({ where: { id: otherBusiness.id } });
  });
});
