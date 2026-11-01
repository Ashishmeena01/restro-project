export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/services/payment.service';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const razorpayData = await createRazorpayOrder(orderId);

    return NextResponse.json({
      success: true,
      ...razorpayData,
    });
  } catch (err: any) {
    console.error('Razorpay order creation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to initialize payment' },
      { status: 400 }
    );
  }
}
