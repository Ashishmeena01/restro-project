'use client';

import React from 'react';
import Link from 'next/link';
import { formatPaise, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PaymentItem {
  id: string;
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  createdAt: Date | string;
  order?: {
    orderNumber: string;
    customerName: string | null;
  } | null;
}

export function AdminPaymentsClient({ payments }: { payments: PaymentItem[] }) {
  const { isHindi, translatePaymentMethod } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isHindi ? 'भुगतान बही (Payment Ledger)' : 'Payment Transactions'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isHindi
            ? 'रेज़रपे ऑनलाइन लेनदेन, काउंटर नकद भुगतान और रिफंड का संपूर्ण बहीखाता।'
            : 'Complete ledger of Razorpay online transactions, counter cash payments, and refunds.'}
        </p>
      </div>

      {/* Payments Table */}
      <Card className="overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">{isHindi ? 'लेनदेन समय' : 'Transaction Time'}</th>
                <th className="px-5 py-3">{isHindi ? 'आर्डर सं.' : 'Order #'}</th>
                <th className="px-5 py-3">{isHindi ? 'ग्राहक' : 'Customer'}</th>
                <th className="px-5 py-3">{isHindi ? 'माध्यम' : 'Method'}</th>
                <th className="px-5 py-3">{isHindi ? 'रेज़रपे / संदर्भ आईडी' : 'Razorpay / Txn Ref'}</th>
                <th className="px-5 py-3">{isHindi ? 'राशि' : 'Amount'}</th>
                <th className="px-5 py-3">{isHindi ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payments.map((p) => (
                <tr key={p.id} className="payment-ledger-row hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 font-medium">
                    {formatDate(p.createdAt, true)}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <Link href={`/admin/orders?search=${p.order?.orderNumber}`} className="hover:text-emerald-600">
                      {p.order?.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-slate-800">
                    {p.order?.customerName || (isHindi ? 'काउंटर ग्राहक' : 'Walk-in Guest')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-700">
                      {translatePaymentMethod(p.paymentMethod)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                    {p.razorpayPaymentId || p.razorpayOrderId || (isHindi ? 'काउंटर नकद' : 'Counter Cash')}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {formatPaise(p.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={
                        p.paymentStatus === 'SUCCESS'
                          ? 'success'
                          : p.paymentStatus === 'REFUNDED'
                          ? 'secondary'
                          : 'warning'
                      }
                      className="text-[10px]"
                    >
                      {p.paymentStatus}
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

