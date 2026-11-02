import React from 'react';
import Link from 'next/link';
import { CreditCard, CheckCircle2, AlertCircle, Clock, RotateCcw, ExternalLink } from 'lucide-react';
import prisma from '@/lib/db/prisma';
import { formatPaise, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default async function AdminPaymentsPage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  const business = await prisma.business.findUnique({ where: { slug: defaultSlug } });

  if (!business) return <div>Business not found</div>;

  const payments = await prisma.payment.findMany({
    where: { businessId: business.id },
    include: {
      order: {
        select: {
          orderNumber: true,
          customerName: true,
        },
      },
      refunds: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Transactions</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete ledger of Razorpay online transactions, counter cash payments, and refunds.
        </p>
      </div>

      {/* Payments Table */}
      <Card className="overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Transaction Time</th>
                <th className="px-5 py-3">Order #</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Razorpay / Txn Ref</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payments.map((p) => (
                <tr key={p.id} className="payment-ledger-row">
                  <td className="px-5 py-3.5 text-slate-400 font-medium">
                    {formatDate(p.createdAt, true)}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <Link href={`/admin/orders?search=${p.order?.orderNumber}`} className="hover:text-emerald-600">
                      {p.order?.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-slate-800">
                    {p.order?.customerName || 'Walk-in Guest'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-700">
                      {p.paymentMethod === 'ONLINE_RAZORPAY' ? 'Razorpay Online' : p.paymentMethod === 'TEST' ? 'Test Payment' : 'Cash at Counter'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                    {p.razorpayPaymentId || p.razorpayOrderId || 'Counter Cash'}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {formatPaise(p.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={p.status === 'FAILED' ? 'destructive' : p.status === 'SUCCESS' ? 'secondary' : 'outline'} className="text-[10px]">
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
