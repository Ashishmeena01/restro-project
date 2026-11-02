'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  IndianRupee,
  ShoppingBag,
  RotateCcw,
  Percent,
  CheckCircle2,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { formatPaise } from '@/lib/utils';
import { jsPDF } from 'jspdf';

export default function AdminDailyReportsPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async (dateStr: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/daily?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate]);

  const handleDownloadPdf = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Daily Sales Audit Report', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Business: Vrindavan Pure Veg Sweets & Café`, 14, 28);
    doc.text(`Report Date: ${report.date}`, 14, 34);
    doc.text(`Generated On: ${new Date().toLocaleString('en-IN')}`, 14, 40);

    doc.line(14, 45, 196, 45);

    const metrics = [
      ['Total Orders Placed', String(report.totalOrders)],
      ['Successful Paid Orders', String(report.successfulOrders)],
      ['Pending / Unpaid Orders', String(report.pendingOrders)],
      ['Cancelled Orders', String(report.cancelledOrders)],
      ['Total Units / Dishes Sold', String(report.unitsSold)],
      ['Gross Sales Revenue', formatPaise(report.grossSales)],
      ['Discounts Applied', formatPaise(report.discounts)],
      ['Customer Refunds Deducted', formatPaise(report.refunds)],
      ['Net Sales Revenue', formatPaise(report.netSales)],
      ['Average Order Value (AOV)', formatPaise(report.averageOrderValue)],
    ];

    let y = 55;
    doc.setFontSize(11);
    metrics.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal');
      doc.text(label, 14, y);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 150, y);
      doc.line(14, y + 2, 196, y + 2);
      y += 10;
    });

    doc.save(`Daily-Sales-Report-${report.date}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Sales Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile daily gross sales, units sold, refunds, and net earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-emerald-500 font-semibold text-slate-800 shadow-sm"
            />
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={!report || isLoading}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Report Metrics Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Computing daily metrics...</div>
      ) : !report ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No report available for this date</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Gross Sales</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">
                {formatPaise(report.grossSales)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Before refunds</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Customer Refunds</span>
              <p className="text-2xl font-extrabold text-rose-600 mt-2">
                {formatPaise(report.refunds)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Deducted from gross</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm bg-emerald-50/20">
              <span className="text-xs font-bold text-emerald-800">Net Sales</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-2">
                {formatPaise(report.netSales)}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">Actual realization</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Average Order Value</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">
                {formatPaise(report.averageOrderValue)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Per paid customer</p>
            </div>
          </div>

          {/* Detailed Audit Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-sm text-slate-900">
              Full Daily Audit Breakdown ({report.date})
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Total Customer Orders Placed</span>
                <span className="font-bold text-slate-900">{report.totalOrders}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Successful & Paid Orders</span>
                <span className="font-bold text-emerald-700">{report.successfulOrders}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Pending / In-Kitchen Orders</span>
                <span className="font-bold text-amber-600">{report.pendingOrders}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Cancelled Orders</span>
                <span className="font-bold text-rose-600">{report.cancelledOrders}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Total Dishes & Units Sold</span>
                <span className="font-bold text-slate-900">{report.unitsSold} units</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Gross Sales</span>
                <span className="font-bold text-slate-900">{formatPaise(report.grossSales)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Total Discounts</span>
                <span className="font-bold text-slate-900">{formatPaise(report.discounts)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">Total Refunds Processed</span>
                <span className="font-bold text-rose-600">-{formatPaise(report.refunds)}</span>
              </div>
              <div className="py-3 flex justify-between font-extrabold text-sm text-slate-900 pt-3 border-t border-slate-200">
                <span>Net Sales Realized</span>
                <span className="text-emerald-700">{formatPaise(report.netSales)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
