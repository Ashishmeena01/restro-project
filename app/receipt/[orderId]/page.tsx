'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer, Download, Share2, ShieldCheck, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatPaise, formatDate } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function ReceiptPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { t, isHindi, translateDish, translatePaymentMethod } = useLanguage();

  const [receiptData, setReceiptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReceipt() {
      try {
        const res = await fetch(`/api/receipts/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setReceiptData(data);
        }
      } catch (e) {
        console.error('Error fetching receipt:', e);
      } finally {
        setIsLoading(false);
      }
    }
    if (orderId) {
      fetchReceipt();
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!receiptData) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200], // Standard thermal receipt size
    });

    const parsed = receiptData.parsedData;
    let y = 10;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(parsed.businessName || 'Vrindavan Sweets', 40, y, { align: 'center' });
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(parsed.businessAddress || 'Vrindavan, UP', 40, y, { align: 'center' });
    y += 4;
    if (parsed.fssaiNumber) {
      doc.text(`FSSAI Lic: ${parsed.fssaiNumber}`, 40, y, { align: 'center' });
      y += 4;
    }

    doc.setLineDashPattern([1, 1], 0);
    doc.line(5, y, 75, y);
    y += 4;

    // Receipt details
    doc.setFontSize(8);
    doc.text(`Receipt #: ${parsed.receiptNumber}`, 5, y);
    y += 4;
    doc.text(`Order #: ${parsed.orderNumber}`, 5, y);
    y += 4;
    doc.text(`Table: ${parsed.tableNumber}`, 5, y);
    y += 4;
    doc.text(`Date: ${formatDate(parsed.date)}`, 5, y);
    y += 4;
    if (parsed.customerName) {
      doc.text(`Customer: ${parsed.customerName}`, 5, y);
      y += 4;
    }

    doc.line(5, y, 75, y);
    y += 4;

    // Items header
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 5, y);
    doc.text('Qty', 45, y, { align: 'center' });
    doc.text('Amount', 75, y, { align: 'right' });
    y += 4;

    doc.setFont('helvetica', 'normal');
    parsed.items.forEach((item: any) => {
      doc.text(item.name.substring(0, 20), 5, y);
      doc.text(String(item.quantity), 45, y, { align: 'center' });
      doc.text(formatPaise(item.totalPrice), 75, y, { align: 'right' });
      y += 4;
    });

    doc.line(5, y, 75, y);
    y += 4;

    // Totals
    doc.text('Subtotal:', 45, y);
    doc.text(formatPaise(parsed.subtotal), 75, y, { align: 'right' });
    y += 4;
    doc.text('GST (5%):', 45, y);
    doc.text(formatPaise(parsed.tax), 75, y, { align: 'right' });
    y += 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Grand Total:', 45, y);
    doc.text(formatPaise(parsed.total), 75, y, { align: 'right' });
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Payment: ${parsed.paymentMethod}`, 40, y, { align: 'center' });
    y += 4;
    if (parsed.transactionRef) {
      doc.text(`Ref: ${parsed.transactionRef}`, 40, y, { align: 'center' });
      y += 4;
    }

    y += 4;
    doc.text('Thank you for dining with us!', 40, y, { align: 'center' });

    doc.save(`Receipt-${parsed.receiptNumber}.pdf`);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${receiptData?.receipt?.receiptNumber}`,
          text: `Dining receipt from ${receiptData?.parsedData?.businessName}`,
          url: window.location.href,
        });
      } catch (e) {
        copyUrl();
      }
    } else {
      copyUrl();
    }
  };

  const copyUrl = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>{isHindi ? 'डिजिटल रसीद तैयार हो रही है...' : 'Generating digital receipt...'}</span>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <p className="text-sm font-semibold text-slate-700">
          {isHindi ? 'रसीद नहीं मिली' : 'Receipt Not Found'}
        </p>
        <Link href="/menu" className="mt-4 text-xs text-emerald-600 underline">
          {isHindi ? 'मेनू पर वापस जाएं' : 'Return to Menu'}
        </Link>
      </div>
    );
  }

  const { parsedData } = receiptData;
  const businessDisplayName = isHindi ? t('brand.name') : parsedData.businessName;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
      {/* Top action toolbar (Hidden in print) */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between no-print gap-2">
        <Link
          href={`/order/${orderId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isHindi ? 'वापस' : 'Back'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" />

          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
            title="Print Receipt"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{t('receipt.print')}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
            title="Share or Copy Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{copied ? t('receipt.copied') : t('receipt.share')}</span>
          </button>
        </div>
      </div>

      {/* Printable Paper Receipt Card */}
      <div
        id="printable-receipt"
        className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 text-slate-800 space-y-5"
      >
        {/* Receipt Header */}
        <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-200">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mx-auto mb-2">
            व
          </div>
          <h2 className="font-extrabold text-lg text-slate-900 leading-tight">
            {businessDisplayName}
          </h2>
          <p className="text-[11px] text-slate-500 leading-tight">{parsedData.businessAddress}</p>
          {parsedData.fssaiNumber && (
            <p className="text-[10px] text-emerald-700 font-medium">
              {t('receipt.fssai_lic')} {parsedData.fssaiNumber}
            </p>
          )}
        </div>

        {/* Metadata badges */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pb-4 border-b border-dashed border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">{t('receipt.receipt_no')}</span>
            <span className="font-bold text-slate-900">{parsedData.receiptNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">{t('order.number')}</span>
            <span className="font-bold text-slate-900">{parsedData.orderNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">{t('receipt.table')}</span>
            <span className="font-semibold text-slate-800">{parsedData.tableNumber || 'Counter'}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">{t('receipt.date')}</span>
            <span className="font-semibold text-slate-800">{formatDate(parsedData.date)}</span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-2 pb-4 border-b border-dashed border-slate-200">
          <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1">
            <span>{t('receipt.items')}</span>
            <span className="text-center w-12">{t('receipt.qty')}</span>
            <span className="text-right w-20">{t('receipt.amount')}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {parsedData.items.map((item: any, idx: number) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-slate-900">
                    {translateDish(item.name)}
                  </p>
                  <p className="text-[10px] text-slate-400">{formatPaise(item.unitPrice)} each</p>
                </div>
                <span className="text-center w-12 font-medium text-slate-600">{item.quantity}</span>
                <span className="text-right w-20 font-bold text-slate-900">{formatPaise(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Totals */}
        <div className="space-y-1.5 text-xs text-slate-600 pb-4 border-b border-dashed border-slate-200">
          <div className="flex justify-between">
            <span>{t('receipt.subtotal')}</span>
            <span>{formatPaise(parsedData.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('receipt.tax')}</span>
            <span>{formatPaise(parsedData.tax)}</span>
          </div>
          {parsedData.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>{isHindi ? 'छूट (Discount)' : 'Discount'}</span>
              <span>-{formatPaise(parsedData.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-extrabold text-base text-slate-900 pt-2 border-t border-slate-200">
            <span>{t('receipt.total')}</span>
            <span className="text-emerald-600">{formatPaise(parsedData.total)}</span>
          </div>
        </div>

        {/* Payment & Security Ref */}
        <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>{t('receipt.payment_mode')}:</span>
            <span className="font-semibold text-slate-800">
              {translatePaymentMethod(parsedData.paymentMethod)}
            </span>
          </div>
          {parsedData.transactionRef && (
            <div className="flex justify-between">
              <span>{isHindi ? 'ट्रांजेक्शन संदर्भ' : 'Txn Ref'}:</span>
              <span className="font-mono text-slate-700">{parsedData.transactionRef}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-emerald-700 pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">
              {isHindi ? 'डिजिटली सत्यापित व कर भुगतान संपन्न' : 'Digitally Verified & Tax Paid'}
            </span>
          </div>
        </div>

        {/* Footer greeting */}
        <p className="text-center text-[11px] text-slate-400 pt-1 leading-relaxed">
          {t('receipt.footer_msg')}
        </p>
      </div>
    </div>
  );
}
