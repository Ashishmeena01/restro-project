'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  IndianRupee,
  Calendar,
  Filter,
  Flame,
  ArrowUpDown,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import { formatPaise } from '@/lib/utils';

export default function AdminBestSellersPage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12
  const [sortBy, setSortBy] = useState<'quantity' | 'revenue'>('quantity');
  const [limit, setLimit] = useState<number>(10);

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
  ];

  const years = [2026, 2025, 2024];

  const fetchBestSellers = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        year: String(selectedYear),
        month: String(selectedMonth),
        sortBy,
        limit: String(limit),
      });

      const res = await fetch(`/api/admin/reports/best-sellers?${query.toString()}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, [selectedYear, selectedMonth, sortBy, limit]);

  const maxVal =
    data?.items?.length > 0
      ? Math.max(
          ...data.items.map((i: any) =>
            sortBy === 'quantity' ? i.quantitySold : i.totalRevenue
          )
        )
      : 1;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Best-Selling Products</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monthly product performance rankings: volume vs. gross sales revenue (accounting for refund deductions).
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-white px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 shadow-sm"
          >
            {months.map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800 shadow-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Limit selector */}
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setLimit(5)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                limit === 5 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Top 5
            </button>
            <button
              onClick={() => setLimit(10)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                limit === 10 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Top 10
            </button>
          </div>
        </div>
      </div>

      {/* Distinction Cards: Most Popular vs Highest Revenue */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Most Popular Card */}
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-50/50 p-5 rounded-3xl border border-amber-200/80 shadow-sm flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] mb-3">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Most Popular Product (By Units)</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {data.mostPopular?.productName || 'N/A'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Highest customer demand with{' '}
                <strong className="text-slate-900 font-bold">
                  {data.mostPopular?.quantitySold || 0} units sold
                </strong>{' '}
                this month.
              </p>
              <p className="text-xs text-amber-800 font-semibold mt-2">
                Revenue: {formatPaise(data.mostPopular?.totalRevenue || 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-200">
              #1
            </div>
          </div>

          {/* Highest Revenue Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-50/50 p-5 rounded-3xl border border-emerald-200/80 shadow-sm flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Highest Revenue Product (By Gross Sales)</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {data.highestRevenue?.productName || 'N/A'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Generated top revenue of{' '}
                <strong className="text-emerald-700 font-bold">
                  {formatPaise(data.highestRevenue?.totalRevenue || 0)}
                </strong>{' '}
                net after refunds.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Units Sold: {data.highestRevenue?.quantitySold || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-200">
              ₹
            </div>
          </div>
        </div>
      )}

      {/* Sorting Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <span className="text-xs font-semibold text-slate-500 pl-2">Rank Products By:</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy('quantity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sortBy === 'quantity'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Quantity Sold (Units)
          </button>
          <button
            onClick={() => setSortBy('revenue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sortBy === 'revenue'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Revenue Generated (₹)
          </button>
        </div>
      </div>

      {/* Best Sellers Ranked List */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Aggregating historical sales...</div>
      ) : !data || data.items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-sm text-slate-800">No sales recorded for this month</p>
          <p className="text-xs text-slate-400 mt-1">Select another month or year</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900">
              Top {limit} Delicacies for {months.find((m) => m.num === selectedMonth)?.name} {selectedYear}
            </h2>
            <span className="text-xs font-medium text-slate-400">
              Sorted by {sortBy === 'quantity' ? 'Quantity Sold' : 'Net Revenue'}
            </span>
          </div>

          <div className="space-y-4">
            {data.items.map((item: any, idx: number) => {
              const currentVal = sortBy === 'quantity' ? item.quantitySold : item.totalRevenue;
              const percentage = Math.round((currentVal / maxVal) * 100);

              return (
                <div key={item.productId} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{item.productName}</span>
                        <span className="text-slate-400 ml-2">({item.categoryName})</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm">
                        {sortBy === 'quantity'
                          ? `${item.quantitySold} units`
                          : formatPaise(item.totalRevenue)}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        {sortBy === 'quantity'
                          ? `(${formatPaise(item.totalRevenue)})`
                          : `(${item.quantitySold} sold)`}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? 'bg-amber-500'
                          : idx === 1
                          ? 'bg-emerald-600'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
