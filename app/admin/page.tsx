import React from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { getDashboardOverviewMetrics } from '@/services/report.service';
import prisma from '@/lib/db/prisma';
import { formatPaise, formatDate } from '@/lib/utils';
import RevenueTrendChart from '@/components/dashboard/RevenueTrendChart';

export default async function AdminDashboardPage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  const business = await prisma.business.findUnique({
    where: { slug: defaultSlug },
  });

  if (!business) {
    return <div>Business record not found. Please run seed script.</div>;
  }

  const metrics = await getDashboardOverviewMetrics(business.id);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sales, order fulfillment, and operational performance for {business.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <span>Live Kitchen Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Item</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Net Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {formatPaise(metrics.todayRevenue)}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>{metrics.successfulOrdersCount} completed orders today</span>
            </p>
          </div>
        </div>

        {/* Units Sold */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Units Sold Today</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {metrics.totalUnitsSoldToday}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Dishes served across all tables</p>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Order Value (AOV)</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {formatPaise(metrics.avgOrderValue)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Per dining customer</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending / In Kitchen</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {metrics.pendingOrdersCount}
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Awaiting kitchen dispatch</p>
          </div>
        </div>
      </div>

      {/* Best-Seller Highlight Banner */}
      {metrics.bestSellerToday && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent p-4 rounded-2xl border border-emerald-200/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Today's Star Delicacy: <span className="text-emerald-700">{metrics.bestSellerToday.name}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                {metrics.bestSellerToday.qty} units sold today generating {formatPaise(metrics.bestSellerToday.revenue)} in revenue.
              </p>
            </div>
          </div>

          <Link
            href="/admin/best-sellers"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap flex items-center gap-1"
          >
            <span>Full Monthly Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-900">Weekly Revenue Trend (₹)</h2>
            <p className="text-xs text-slate-400">Daily gross revenue over the past 7 days</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Last 7 Days
          </span>
        </div>

        <RevenueTrendChart data={metrics.chartData} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-400">Latest dine-in and takeaway tickets</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Order #</th>
                <th className="px-5 py-3">Customer / Table</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Time</th>
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
                    <p className="font-semibold text-slate-800">{ord.customerName || 'Guest'}</p>
                    <p className="text-[11px] text-slate-400">{ord.table?.tableNumber || 'Takeaway'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
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
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
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
