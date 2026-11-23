'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
} from 'lucide-react';
import { formatPaise } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminDailyReportsPage() {
  const { isHindi } = useLanguage();
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
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            {isHindi ? 'दैनिक बिक्री ऑडिट रिपोर्ट (Daily Reports)' : 'Daily Sales Reports'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isHindi
              ? 'दैनिक सकल बिक्री, बेची गई प्लेटें, रिफंड और शुद्ध कमाई का लेखा-जोखा।'
              : 'Reconcile daily gross sales, units sold, refunds, and net earnings.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-emerald-500 font-semibold text-slate-800 shadow-xs"
            />
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={!report || isLoading}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? 'PDF रिपोर्ट डाउनलोड' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Metrics Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          {isHindi ? 'दैनिक मेट्रिक्स की गणना हो रही है...' : 'Computing daily metrics...'}
        </div>
      ) : !report ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">
            {isHindi ? 'इस तारीख के लिए कोई रिपोर्ट उपलब्ध नहीं है' : 'No report available for this date'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">
                {isHindi ? 'सकल बिक्री (Gross Sales)' : 'Gross Sales'}
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">
                {formatPaise(report.grossSales)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {isHindi ? 'रिफंड से पहले' : 'Before refunds'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">
                {isHindi ? 'ग्राहक रिफंड (Refunds)' : 'Customer Refunds'}
              </span>
              <p className="text-2xl font-extrabold text-rose-600 mt-2">
                {formatPaise(report.refunds)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {isHindi ? 'सकल से घटाया गया' : 'Deducted from gross'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
              <span className="text-xs font-bold text-emerald-800">
                {isHindi ? 'शुद्ध बिक्री (Net Sales)' : 'Net Sales'}
              </span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-2">
                {formatPaise(report.netSales)}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {isHindi ? 'वास्तविक आय' : 'Actual realization'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">
                {isHindi ? 'औसत आर्डर मूल्य (AOV)' : 'Average Order Value'}
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">
                {formatPaise(report.averageOrderValue)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {isHindi ? 'प्रति सशुल्क ग्राहक' : 'Per paid customer'}
              </p>
            </div>
          </div>

          {/* Detailed Audit Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              {isHindi
                ? `संपूर्ण दैनिक ऑडिट विवरण (${report.date})`
                : `Full Daily Audit Breakdown (${report.date})`}
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">
                  {isHindi ? 'कुल प्राप्त ग्राहक आर्डर' : 'Total Customer Orders Placed'}
                </span>
                <span className="font-bold text-slate-900">{report.totalOrders}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">
                  {isHindi ? 'सफल व सशुल्क आर्डर' : 'Successful & Paid Orders'}
                </span>
                <span className="font-bold text-emerald-700">{report.successfulOrders}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">
                  {isHindi ? 'लंबित / किचन में आर्डर' : 'Pending / In-Kitchen Orders'}
                </span>
                <span className="font-bold text-amber-600">{report.pendingOrders}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">
                  {isHindi ? 'रद्द किए गए आर्डर' : 'Cancelled Orders'}
                </span>
                <span className="font-bold text-rose-600">{report.cancelledOrders}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">
                  {isHindi ? 'कुल बेचे गए व्यंजन / प्लेटें' : 'Total Dishes & Units Sold'}
                </span>
                <span className="font-bold text-slate-900">
                  {report.unitsSold} {isHindi ? 'प्लेटें' : 'units'}
                </span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">
                  {isHindi ? 'सकल बिक्री राशि' : 'Gross Sales'}
                </span>
                <span className="font-bold text-slate-900">{formatPaise(report.grossSales)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">
                  {isHindi ? 'कुल दी गई छूट' : 'Total Discounts'}
                </span>
                <span className="font-bold text-slate-900">{formatPaise(report.discounts)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">
                  {isHindi ? 'कुल रिफंड' : 'Total Refunds Processed'}
                </span>
                <span className="font-bold text-rose-600">-{formatPaise(report.refunds)}</span>
              </div>
              <div className="py-3 flex justify-between font-extrabold text-sm text-slate-900 pt-3 border-t border-slate-200">
                <span>{isHindi ? 'शुद्ध अर्जित बिक्री' : 'Net Sales Realized'}</span>
                <span className="text-emerald-700">{formatPaise(report.netSales)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
