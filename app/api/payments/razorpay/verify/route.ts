export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { paymentVerifySchema } from '@/lib/validations';
import { verifyAndProcessPayment } from '@/services/payment.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = paymentVerifySchema.parse(body);

    const result = await verifyAndProcessPayment({
      orderId: validated.orderId,
      razorpayOrderId: validated.razorpayOrderId,
      razorpayPaymentId: validated.razorpayPaymentId,
      razorpaySignature: validated.razorpaySignature,
    });

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json(
      { error: err.message || 'Payment signature verification failed' },
      { status: 400 }
    );
  }
}
