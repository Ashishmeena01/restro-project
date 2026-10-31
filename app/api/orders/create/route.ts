export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { checkoutSchema } from '@/lib/validations';
import { createOrder } from '@/services/order.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = checkoutSchema.parse(body);

    if (validated.paymentMethod === 'TEST' && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Test payments are only available outside production.' }, { status: 403 });
    }

    const result = await createOrder({
      businessSlug: validated.businessSlug,
      tableNumber: validated.tableNumber,
      customerName: validated.customerName,
      customerPhone: validated.customerPhone,
      paymentMethod: validated.paymentMethod,
      notes: validated.notes,
      items: validated.items,
    });

    return NextResponse.json({
      success: true,
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      total: result.order.total,
      paymentMethod: result.order.paymentMethod,
      orderStatus: result.order.orderStatus,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create order' },
      { status: 400 }
    );
  }
}
