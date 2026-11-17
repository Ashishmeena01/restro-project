'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { formatPaise, formatDate } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ReceiptItem {
  id: string;
  receiptNumber: string;
  orderId: string;
  customerName: string | null;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  createdAt: Date | string;
  order?: {
    orderNumber: string;
    table?: { tableNumber: string } | null;
  } | null;
}

export function AdminReceiptsClient({ receipts }: { receipts: ReceiptItem[] }) {
  const { isHindi, translatePaymentMethod } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isHindi ? 'रसीद अभिलेखागार (Receipts Archive)' : 'Receipts Archive'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isHindi
            ? 'जारी की गई सभी डिजिटल रसीदों, जीएसटी विवरण और कर दस्तावेजों का ऐतिहासिक रिकॉर्ड।'
            : 'Historical record of all issued digital receipts, GST breakdowns, and tax documents.'}
        </p>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">{isHindi ? 'रसीद सं.' : 'Receipt #'}</th>
                <th className="px-5 py-3">{isHindi ? 'आर्डर सं.' : 'Order #'}</th>
                <th className="px-5 py-3">{isHindi ? 'ग्राहक / टेबल' : 'Customer / Table'}</th>
                <th className="px-5 py-3">{isHindi ? 'उप-योग' : 'Subtotal'}</th>
                <th className="px-5 py-3">{isHindi ? 'जीएसटी (5%)' : 'GST (5%)'}</th>
                <th className="px-5 py-3">{isHindi ? 'कुल भुगतान' : 'Total Paid'}</th>
                <th className="px-5 py-3">{isHindi ? 'माध्यम' : 'Method'}</th>
                <th className="px-5 py-3">{isHindi ? 'जारी तारीख' : 'Issued Date'}</th>
                <th className="px-5 py-3 text-right">{isHindi ? 'देखें / प्रिंट' : 'View / Print'}</th>
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
                    <p className="font-semibold text-slate-800">
                      {r.customerName || (isHindi ? 'अतिथि' : 'Guest')}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {r.order?.table?.tableNumber || (isHindi ? 'पार्सल' : 'Takeaway')}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">{formatPaise(r.subtotal)}</td>
                  <td className="px-5 py-3.5 text-slate-500">{formatPaise(r.tax)}</td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">
                    {formatPaise(r.total)}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-600">
                    {translatePaymentMethod(r.paymentMethod)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {formatDate(r.createdAt, true)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/receipt/${r.orderId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <span>{isHindi ? 'रसीद देखें' : 'View'}</span>
                      <ExternalLink className="w-3 h-3" />
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

