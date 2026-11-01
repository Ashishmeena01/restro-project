export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { handleRazorpayWebhook } from '@/services/payment.service';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const result = await handleRazorpayWebhook(rawBody, signature);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: err.message || 'Webhook verification failed' },
      { status: 400 }
    );
  }
}
