import { NextResponse } from 'next/server';
import { confirmTestPayment } from '@/services/payment.service';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Test payments are only available outside production.' }, { status: 403 });
  }

  try {
    const { orderId } = await req.json();
    if (typeof orderId !== 'string' || !orderId) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
    }

    return NextResponse.json(await confirmTestPayment(orderId));
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to complete test payment.' }, { status: 400 });
  }
}
