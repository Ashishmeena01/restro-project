// Prisma Database Seed Script for Vrindavan Restaurant Platform
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Vrindavan App...');

  // 1. Clean existing records in correct relation order
  await prisma.refund.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.qrCode.deleteMany();
  await prisma.restaurantTable.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.businessSettings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 2. Create Primary Business
  const business = await prisma.business.create({
    data: {
      name: 'Vrindavan Pure Veg Sweets & Café',
      slug: 'vrindavan-sweets',
      tagline: 'Authentic Indian Delicacies & Pure Desi Ghee Sweets',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      address: 'Shop 12, Mandir Marg, Near Banke Bihari, Vrindavan, UP 281121',
      phone: '+91 98765 43210',
      email: 'contact@vrindavansweets.com',
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
      openingHours: '08:00 AM - 10:30 PM',
      taxRatePercent: 5, // 5% GST
      fssaiNumber: '12724001000456',
    },
  });
  console.log(`✅ Created Business: ${business.name} (ID: ${business.id})`);

  // 3. Create Business Settings
  await prisma.businessSettings.create({
    data: {
      businessId: business.id,
      upiId: 'vrindavan@okhdfcbank',
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
      razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_razorpay_secret',
      enableCash: true,
      enableOnline: true,
      defaultGstPercent: 5,
      receiptFooter: 'Radhe Radhe! Thank you for dining with us. Please visit again!',
    },
  });
  console.log('✅ Created Business Settings');

  // 4. Create Users (Admin and Staff with hashed passwords)
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const staffPasswordHash = await bcrypt.hash('staff123', 10);

  const adminUser = await prisma.user.create({
    data: {
      businessId: business.id,
      name: 'Radhe Mohan (Owner/Admin)',
      email: 'admin@vrindavan.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      businessId: business.id,
      name: 'Gopal Sharma (Counter Staff)',
      email: 'staff@vrindavan.com',
      passwordHash: staffPasswordHash,
      role: 'STAFF',
    },
  });
  console.log('✅ Created Users: admin@vrindavan.com (pass: admin123) and staff@vrindavan.com (pass: staff123)');

  // 5. Create Categories
  const catSnacks = await prisma.category.create({
    data: {
      businessId: business.id,
      name: 'Snacks & Chaat',
      slug: 'snacks-chaat',
      description: 'Hot, crispy street food and deep-fried savory treats',
      sortOrder: 1,
    },
  });

  const catBreakfast = await prisma.category.create({
    data: {
      businessId: business.id,
      name: 'Breakfast & Morning Delights',
      slug: 'breakfast-delights',
      description: 'Wholesome morning favorites to kickstart your day',
      sortOrder: 2,
    },
  });

  const catBeverages = await prisma.category.create({
    data: {
      businessId: business.id,
      name: 'Hot & Cold Beverages',
      slug: 'beverages',
      description: 'Traditional spiced chai, cooling lassi, and refreshments',
      sortOrder: 3,
    },
  });

  const catSweets = await prisma.category.create({
    data: {
      businessId: business.id,
      name: 'Pure Desi Ghee Sweets',
      slug: 'sweets',
      description: 'Rich, authentic handcrafted mithai prepared in pure cow ghee',
      sortOrder: 4,
    },
  });
  console.log('✅ Created 4 Categories');

  // 6. Create Products (All monetary prices in integer paise: ₹15 = 1500)
  // Required core products: Samosa (₹15), Kachori (₹20), Tea (₹10), Poha (₹25)
  const productSamosa = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catSnacks.id,
      name: 'Samosa',
      description: 'Golden crispy pastry stuffed with fragrant spiced potatoes, peas, and roasted spices. Served with imli & mint chutneys.',
      price: 1500, // ₹15.00
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    },
  });

  const productKachori = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catSnacks.id,
      name: 'Kachori',
      description: 'Flaky, crunchy khasta kachori stuffed with rich spiced moong dal and hing. Served with tangy hing-jeera aloo sabzi.',
      price: 2000, // ₹20.00
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    },
  });

  const productTea = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catBeverages.id,
      name: 'Tea',
      description: 'Classic Indian Masala Chai brewed fresh with buffalo milk, crushed ginger, green cardamom, and lemongrass.',
      price: 1000, // ₹10.00
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    },
  });

  const productPoha = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catBreakfast.id,
      name: 'Poha',
      description: 'Steamed flattened rice tossed with mustard seeds, crunchy peanuts, turmeric, green chillies, topped with Ratlami sev and fresh coriander.',
      price: 2500, // ₹25.00
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    },
  });

  const productJalebi = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catSweets.id,
      name: 'Jalebi with Rabdi',
      description: 'Crisp spiral jalebis fried in pure desi ghee, soaked in saffron syrup, served alongside thick malai rabdi.',
      price: 6000, // ₹60.00
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    },
  });

  const productLassi = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catBeverages.id,
      name: 'Kesariya Lassi',
      description: 'Chilled, hand-churned thick sweet curd infused with saffron strands and rosewater, topped with a dollop of fresh malai.',
      price: 3500, // ₹35.00
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
    },
  });

  const productGulabJamun = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catSweets.id,
      name: 'Gulab Jamun (2 Pcs)',
      description: 'Melt-in-mouth mawa spheres gently fried in desi ghee and steeped in cardamom rosewater sugar syrup.',
      price: 3000, // ₹30.00
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1605197154344-979dc5a54cf8?auto=format&fit=crop&w=600&q=80',
    },
  });

  console.log('✅ Created 7 Products including Samosa (₹15), Kachori (₹20), Tea (₹10), Poha (₹25)');

  // 7. Create Restaurant Tables
  const tables = [];
  for (let i = 1; i <= 6; i++) {
    const table = await prisma.restaurantTable.create({
      data: {
        businessId: business.id,
        tableNumber: `Table ${i}`,
        capacity: i % 2 === 0 ? 4 : 2,
        qrCodeUrl: `http://localhost:3000/menu?table=Table%20${i}`,
        isActive: true,
      },
    });
    tables.push(table);

    // Create table-specific QR code record
    await prisma.qrCode.create({
      data: {
        businessId: business.id,
        tableId: table.id,
        codeType: 'TABLE',
        codeUrl: `http://localhost:3000/menu?table=Table%20${i}`,
      },
    });
  }

  // Create General Restaurant QR code
  await prisma.qrCode.create({
    data: {
      businessId: business.id,
      codeType: 'GENERAL',
      codeUrl: 'http://localhost:3000/menu',
    },
  });
  console.log('✅ Created 6 Tables and QR Codes (General + Table-specific)');

  // 8. Create Realistic Multi-Day Orders for Testing Analytics & Best Sellers
  console.log('⏳ Creating historical sample orders across multiple days...');

  const productsList = [
    { p: productSamosa, name: 'Samosa', price: 1500 },
    { p: productKachori, name: 'Kachori', price: 2000 },
    { p: productTea, name: 'Tea', price: 1000 },
    { p: productPoha, name: 'Poha', price: 2500 },
    { p: productJalebi, name: 'Jalebi with Rabdi', price: 6000 },
    { p: productLassi, name: 'Kesariya Lassi', price: 3500 },
    { p: productGulabJamun, name: 'Gulab Jamun (2 Pcs)', price: 3000 },
  ];

  // Helper date creator
  const now = new Date();
  const getPastDate = (daysAgo, hour = 11, minute = 30) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  // Order dataset with high Samosa quantity and high Kachori/Jalebi revenue
  const sampleOrderConfigs = [
    // Today's orders
    { daysAgo: 0, hour: 9, min: 15, items: [{ idx: 3, qty: 2 }, { idx: 2, qty: 2 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 0, cust: 'Rohan Sharma' },
    { daysAgo: 0, hour: 10, min: 30, items: [{ idx: 0, qty: 4 }, { idx: 2, qty: 4 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'CASH', table: 1, cust: 'Priya Verma' },
    { daysAgo: 0, hour: 11, min: 45, items: [{ idx: 1, qty: 3 }, { idx: 2, qty: 3 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 2, cust: 'Amit Patel' },
    { daysAgo: 0, hour: 13, min: 10, items: [{ idx: 0, qty: 6 }, { idx: 4, qty: 2 }], status: 'PREPARING', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 3, cust: 'Sunita Mehra' },
    { daysAgo: 0, hour: 14, min: 0, items: [{ idx: 1, qty: 2 }, { idx: 5, qty: 2 }], status: 'CONFIRMED', pay: 'SUCCESS', method: 'CASH', table: 4, cust: 'Deepak Joshi' },
    { daysAgo: 0, hour: 14, min: 20, items: [{ idx: 0, qty: 2 }], status: 'PENDING_PAYMENT', pay: 'PENDING', method: 'ONLINE_RAZORPAY', table: 5, cust: 'Karan Malhotra' },

    // Yesterday's orders
    { daysAgo: 1, hour: 9, min: 0, items: [{ idx: 3, qty: 4 }, { idx: 2, qty: 4 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 1, cust: 'Vivek Gupta' },
    { daysAgo: 1, hour: 11, min: 20, items: [{ idx: 0, qty: 10 }, { idx: 2, qty: 10 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'CASH', table: 2, cust: 'Rajesh Agrawal' },
    { daysAgo: 1, hour: 13, min: 45, items: [{ idx: 1, qty: 5 }, { idx: 4, qty: 3 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 3, cust: 'Neha Singhal' },
    { daysAgo: 1, hour: 16, min: 30, items: [{ idx: 0, qty: 8 }, { idx: 5, qty: 4 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 0, cust: 'Manish Tyagi' },
    { daysAgo: 1, hour: 18, min: 15, items: [{ idx: 0, qty: 5 }], status: 'CANCELLED', pay: 'FAILED', method: 'ONLINE_RAZORPAY', table: 2, cust: 'Sanjay Rawat' },

    // 2 Days ago
    { daysAgo: 2, hour: 10, min: 15, items: [{ idx: 0, qty: 12 }, { idx: 2, qty: 12 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'CASH', table: 1, cust: 'Kishore Kumar' },
    { daysAgo: 2, hour: 12, min: 30, items: [{ idx: 1, qty: 6 }, { idx: 3, qty: 4 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 3, cust: 'Pooja Tiwari' },
    { daysAgo: 2, hour: 15, min: 0, items: [{ idx: 4, qty: 4 }, { idx: 6, qty: 4 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 4, cust: 'Gaurav Saxena' },

    // 5 Days ago
    { daysAgo: 5, hour: 11, min: 0, items: [{ idx: 0, qty: 20 }, { idx: 2, qty: 15 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 0, cust: 'Anand Prakash' },
    { daysAgo: 5, hour: 14, min: 30, items: [{ idx: 1, qty: 10 }, { idx: 4, qty: 5 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'CASH', table: 2, cust: 'Shailendra Roy' },

    // 10 Days ago
    { daysAgo: 10, hour: 12, min: 10, items: [{ idx: 0, qty: 15 }, { idx: 1, qty: 8 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 1, cust: 'Harish Chandra' },
    { daysAgo: 10, hour: 16, min: 0, items: [{ idx: 3, qty: 8 }, { idx: 2, qty: 10 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 3, cust: 'Bhavna Kulkarni' },

    // 15 Days ago (Contains a processed refund)
    { daysAgo: 15, hour: 13, min: 0, items: [{ idx: 0, qty: 10 }, { idx: 4, qty: 4 }], status: 'COMPLETED', pay: 'REFUNDED', method: 'ONLINE_RAZORPAY', table: 2, cust: 'Dinesh Rathore', hasRefund: true },

    // 20 Days ago
    { daysAgo: 20, hour: 11, min: 45, items: [{ idx: 0, qty: 25 }, { idx: 2, qty: 25 }], status: 'COMPLETED', pay: 'SUCCESS', method: 'ONLINE_RAZORPAY', table: 0, cust: 'Mukesh Ambati' },
    { daysAgo: 20, hour: 14, min: 15, items: [{ idx: 1, qty: 12 }, { idx: 3, qty: 10 }], status: 'COMPLETED', pay: 'CASH', table: 4, cust: 'Sunil Gavaskar' },
  ];

  let orderCount = 0;
  for (const cfg of sampleOrderConfigs) {
    orderCount++;
    const orderDate = getPastDate(cfg.daysAgo, cfg.hour, cfg.min);
    const orderNumStr = String(orderCount).padStart(3, '0');
    const orderDatePart = orderDate.toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `ORD-${orderDatePart}-${orderNumStr}`;

    // Calculate subtotal from items
    let subtotal = 0;
    const itemRecords = [];
    for (const it of cfg.items) {
      const prod = productsList[it.idx];
      const lineTotal = prod.price * it.qty;
      subtotal += lineTotal;
      itemRecords.push({
        productId: prod.p.id,
        productName: prod.name,
        unitPrice: prod.price,
        quantity: it.qty,
        totalPrice: lineTotal,
      });
    }

    // Calculate 5% GST tax in paise
    const tax = Math.round((subtotal * 5) / 100);
    const total = subtotal + tax;
    const tableId = cfg.table !== undefined ? tables[cfg.table].id : null;

    // Create Order
    const order = await prisma.order.create({
      data: {
        businessId: business.id,
        orderNumber,
        tableId,
        customerName: cfg.cust,
        customerPhone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
        subtotal,
        tax,
        discount: 0,
        total,
        orderStatus: cfg.status,
        paymentStatus: cfg.pay,
        paymentMethod: cfg.method,
        createdAt: orderDate,
        updatedAt: orderDate,
        items: {
          create: itemRecords,
        },
      },
    });

    // Create Payment record
    const rzpOrderId = cfg.method === 'ONLINE_RAZORPAY' ? `order_seed_${order.id.slice(-8)}` : null;
    const rzpPayId = cfg.pay === 'SUCCESS' && cfg.method === 'ONLINE_RAZORPAY' ? `pay_seed_${order.id.slice(-8)}` : null;

    const payment = await prisma.payment.create({
      data: {
        businessId: business.id,
        orderId: order.id,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: rzpPayId,
        razorpaySignature: rzpPayId ? 'seed_signature_verified' : null,
        amount: total,
        currency: 'INR',
        status: cfg.pay,
        paymentMethod: cfg.method,
        createdAt: orderDate,
        updatedAt: orderDate,
      },
    });

    // Create Receipt for successful or refunded orders
    if (cfg.pay === 'SUCCESS' || cfg.pay === 'REFUNDED') {
      const receiptNumber = `REC-${orderDatePart}-${orderNumStr}`;
      await prisma.receipt.create({
        data: {
          businessId: business.id,
          orderId: order.id,
          receiptNumber,
          customerName: cfg.cust,
          customerPhone: order.customerPhone,
          subtotal,
          tax,
          discount: 0,
          total,
          paymentMethod: cfg.method,
          transactionRef: rzpPayId || `CASH-TXN-${order.id.slice(-6).toUpperCase()}`,
          receiptDataJson: JSON.stringify({
            businessName: business.name,
            businessAddress: business.address,
            fssai: business.fssaiNumber,
            orderNumber,
            receiptNumber,
            date: orderDate.toISOString(),
            items: itemRecords,
            subtotal,
            tax,
            total,
            paymentMethod: cfg.method,
          }),
          createdAt: orderDate,
        },
      });
    }

    // Create Refund record if specified
    if (cfg.hasRefund) {
      await prisma.refund.create({
        data: {
          businessId: business.id,
          paymentId: payment.id,
          orderId: order.id,
          razorpayRefundId: `rfnd_seed_${order.id.slice(-8)}`,
          amount: total,
          reason: 'Customer cancelled prior to order preparation dispatch',
          status: 'PROCESSED',
          createdAt: orderDate,
          updatedAt: orderDate,
        },
      });
    }
  }

  console.log(`✅ Seeded ${orderCount} realistic multi-day orders with payment and receipt records.`);
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
