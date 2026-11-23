'use client';

import React from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  Soup,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { formatPaise, formatDate } from '@/lib/utils';
import RevenueTrendChart from '@/components/dashboard/RevenueTrendChart';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AdminDashboardClientProps {
  businessName: string;
  metrics: {
    todayRevenue: number;
    successfulOrdersCount: number;
    totalUnitsSoldToday: number;
    avgOrderValue: number;
    pendingOrdersCount: number;
    bestSellerToday: {
      name: string;
      qty: number;
      revenue: number;
    } | null;
    chartData: Array<{ date: string; revenue: number; revenuePaise: number }>;
    recentOrders: Array<{
      id: string;
      orderNumber: string;
      customerName: string | null;
      total: number;
      paymentStatus: string;
      orderStatus: string;
      createdAt: Date | string;
      table?: { tableNumber: string } | null;
      items: Array<{ productName: string; quantity: number }>;
    }>;
  };
}

export function AdminDashboardClient({ businessName, metrics }: AdminDashboardClientProps) {
  const { isHindi, translateDish } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            {isHindi ? 'व्यापार डैशबोर्ड सारांश' : 'Business Overview'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isHindi
              ? `${businessName} के लिए वास्तविक समय बिक्री, आर्डर पूर्ति और परिचालन प्रदर्शन।`
              : `Real-time sales, order fulfillment, and operational performance for ${businessName}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <span>{isHindi ? 'लाइव किचन आर्डर' : 'Live Kitchen Orders'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'नया व्यंजन जोड़ें' : 'Add Item'}</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Revenue */}
        <div className="mi-lift mi-fade-up bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isHindi ? 'आज का कुल राजस्व' : "Today's Net Revenue"}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
              {formatPaise(metrics.todayRevenue)}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>
                {isHindi
                  ? `आज ${metrics.successfulOrdersCount} आर्डर पूर्ण हुए`
                  : `${metrics.successfulOrdersCount} completed orders today`}
              </span>
            </p>
          </div>
        </div>

        {/* Units Sold */}
        <div className="mi-lift mi-fade-up bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isHindi ? 'आज बेची गई प्लेटें/इकाइयाँ' : 'Units Sold Today'}
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Soup className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
              {metrics.totalUnitsSoldToday}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {isHindi ? 'सभी टेबल पर परोसे गए व्यंजन' : 'Dishes served across all tables'}
            </p>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="mi-lift mi-fade-up bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isHindi ? 'औसत आर्डर मूल्य (AOV)' : 'Avg Order Value (AOV)'}
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
              {formatPaise(metrics.avgOrderValue)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {isHindi ? 'प्रति ग्राहक औसतन' : 'Per dining customer'}
            </p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="mi-lift mi-fade-up bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isHindi ? 'रसोई में लंबित आर्डर' : 'Pending / In Kitchen'}
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
              {metrics.pendingOrdersCount}
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              {isHindi ? 'परोसने की प्रतीक्षा में' : 'Awaiting kitchen dispatch'}
            </p>
          </div>
        </div>
      </div>

      {/* Best-Seller Highlight Banner */}
      {metrics.bestSellerToday && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent p-4 rounded-2xl border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {isHindi ? "आज का स्टार व्यंजन: " : "Today's Star Delicacy: "}
                <span className="text-emerald-700">
                  {translateDish(metrics.bestSellerToday.name)}
                </span>
              </p>
              <p className="text-[11px] text-slate-600">
                {isHindi
                  ? `आज ${metrics.bestSellerToday.qty} प्लेटें बिकीं जिससे ${formatPaise(metrics.bestSellerToday.revenue)} का राजस्व बना।`
                  : `${metrics.bestSellerToday.qty} units sold today generating ${formatPaise(metrics.bestSellerToday.revenue)} in revenue.`}
              </p>
            </div>
          </div>

          <Link
            href="/admin/best-sellers"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap flex items-center gap-1"
          >
            <span>{isHindi ? 'विस्तृत मासिक विश्लेषण' : 'Full Monthly Analytics'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Revenue Trend Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              {isHindi ? 'साप्ताहिक राजस्व रुझान (₹)' : 'Weekly Revenue Trend (₹)'}
            </h2>
            <p className="text-xs text-slate-400">
              {isHindi ? 'पिछले 7 दिनों का दैनिक सकल राजस्व' : 'Daily gross revenue over the past 7 days'}
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {isHindi ? 'पिछले 7 दिन' : 'Last 7 Days'}
          </span>
        </div>

        <RevenueTrendChart data={metrics.chartData} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              {isHindi ? 'हाल के ग्राहक आर्डर' : 'Recent Customer Orders'}
            </h2>
            <p className="text-xs text-slate-400">
              {isHindi ? 'नवीनतम डाइन-इन व पार्सल टिकट' : 'Latest dine-in and takeaway tickets'}
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">{isHindi ? 'आर्डर सं.' : 'Order #'}</th>
                <th className="px-5 py-3">{isHindi ? 'ग्राहक / टेबल' : 'Customer / Table'}</th>
                <th className="px-5 py-3">{isHindi ? 'व्यंजन' : 'Items'}</th>
                <th className="px-5 py-3">{isHindi ? 'कुल' : 'Total'}</th>
                <th className="px-5 py-3">{isHindi ? 'भुगतान' : 'Payment'}</th>
                <th className="px-5 py-3">{isHindi ? 'स्थिति' : 'Status'}</th>
                <th className="px-5 py-3">{isHindi ? 'समय' : 'Time'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {metrics.recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <Link href={`/admin/orders?search=${ord.orderNumber}`} className="hover:text-emerald-600">
                      {ord.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-800">{ord.customerName || (isHindi ? 'अतिथि' : 'Guest')}</p>
                    <p className="text-[11px] text-slate-400">
                      {ord.table?.tableNumber || (isHindi ? 'पार्सल' : 'Takeaway')}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {ord.items.map((i) => `${translateDish(i.productName)} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {formatPaise(ord.total)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        ord.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.paymentStatus === 'REFUNDED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        ord.orderStatus === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-800'
                          : ord.orderStatus === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {formatDate(ord.createdAt, true)}
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

