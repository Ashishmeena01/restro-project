export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getReceiptByOrderId } from '@/services/receipt.service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const receipt = await getReceiptByOrderId(orderId);

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    const parsedData = JSON.parse(receipt.receiptDataJson);

    return NextResponse.json({
      receipt,
      parsedData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch receipt' }, { status: 500 });
  }
}
