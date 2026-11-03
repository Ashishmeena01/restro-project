import React from 'react';
import Link from 'next/link';
import { ReceiptText, Printer, ExternalLink } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import { formatPaise, formatDate } from '@/lib/utils';

export default async function AdminReceiptsPage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

  if (!business) return <div>Business not found</div>;

  const receipts = await prisma.receipt.findMany({
    where: { businessId: business.id },
    include: {
      order: {
        select: {
          orderNumber: true,
          table: { select: { tableNumber: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Receipts Archive</h1>
        <p className="text-xs text-slate-500 mt-1">
          Historical record of all issued digital receipts, GST breakdowns, and tax documents.
        </p>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Receipt #</th>
                <th className="px-5 py-3">Order #</th>
                <th className="px-5 py-3">Customer / Table</th>
                <th className="px-5 py-3">Subtotal</th>
                <th className="px-5 py-3">GST (5%)</th>
                <th className="px-5 py-3">Total Paid</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Issued Date</th>
                <th className="px-5 py-3 text-right">View / Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {receipts.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {r.receiptNumber}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-600">
                    {r.order?.orderNumber}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-800">{r.customerName || 'Guest'}</p>
                    <p className="text-[11px] text-slate-400">{r.order?.table?.tableNumber || 'Takeaway'}</p>
                  </td>
                  <td className="px-5 py-3.5">{formatPaise(r.subtotal)}</td>
                  <td className="px-5 py-3.5 text-slate-500">{formatPaise(r.tax)}</td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">
                    {formatPaise(r.total)}
                  </td>
                  <td className="px-5 py-3.5 capitalize font-medium text-slate-600">
                    {r.paymentMethod === 'ONLINE_RAZORPAY' ? 'Razorpay' : r.paymentMethod === 'TEST' ? 'Test Payment' : 'Cash'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {formatDate(r.createdAt, true)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/receipt/${r.orderId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Print</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
