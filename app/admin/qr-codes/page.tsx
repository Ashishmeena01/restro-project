'use client';

import React, { useState, useEffect } from 'react';
import { Download, Printer, Plus, ExternalLink, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminQrCodesPage() {
  const { isHindi } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchQrs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/qr-codes');
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
    fetchQrs();
  }, []);

  const handleDownload = (qrImage: string, filename: string) => {
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTableCard = (tableNumber: string, qrImage: string, menuUrl?: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const brandName = isHindi ? 'वृंदावन स्वीट्स & कैफ़े' : 'Vrindavan Sweets & Café';
    const scanNotice = isHindi
      ? 'अपने मोबाइल कैमरे से स्कैन करें और आज का ताज़ा मेनू देखकर ऑनलाइन भुगतान करें।'
      : "Scan with your phone camera to browse today's fresh menu & pay online.";

    printWindow.document.write(`
      <html>
        <head>
          <title>Table Standee - ${tableNumber}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; margin: 0; }
            .card { border: 2px dashed #059669; padding: 30px; max-width: 350px; margin: 0 auto; border-radius: 20px; }
            h1 { color: #0f172a; margin: 0 0 5px 0; font-size: 24px; }
            h2 { color: #059669; margin: 0 0 15px 0; font-size: 18px; }
            p { color: #64748b; font-size: 13px; margin: 15px 0; }
            .url { color: #0f172a; font-size: 11px; font-family: monospace; word-break: break-all; margin-top: 8px; }
            img { width: 220px; height: 220px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${brandName}</h1>
            <h2>${tableNumber}</h2>
            <img src="${qrImage}" />
            <p>${scanNotice}</p>
            ${menuUrl ? `<p class="url">${menuUrl}</p>` : ''}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/qr-codes/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: tableNumber.trim(),
          capacity: parseInt(capacity) || 4,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || (isHindi ? 'टेबल जोड़ने में विफल' : 'Failed to create table'));

      setIsModalOpen(false);
      setTableNumber('');
      fetchQrs();
    } catch (err: any) {
      setError(err.message || 'Error creating table');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            {isHindi ? 'क्यूआर कोड प्रबंधन (QR Codes)' : 'QR Code Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isHindi
              ? 'टेबल स्टैंडी टेंट कार्ड और संपर्क रहित मेनू बारकोड जनरेट, डाउनलोड और प्रिंट करें।'
              : 'Generate, download, and print table standee tent cards and contactless menu barcodes.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isHindi ? 'नई रेस्टोरेंट टेबल जोड़ें' : 'Add Restaurant Table'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          {isHindi ? 'हाई-रिज़ॉल्यूशन क्यूआर कोड बनाए जा रहे हैं...' : 'Generating high-res QR codes...'}
        </div>
      ) : !data ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-xs text-slate-400">
            {isHindi ? 'क्यूआर कोड लोड करने में विफल' : 'Failed to load QR codes'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* General Restaurant QR Code */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            <div className="p-3 bg-white border border-black rounded-2xl shrink-0">
              <img
                src={data.general.qrImage}
                alt="General Restaurant Menu QR"
                className="w-40 h-40 rounded-none"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {isHindi ? 'सामान्य डाइन-इन / पार्सल क्यूआर' : 'General Dine-In / Takeaway QR'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {isHindi ? 'मुख्य रेस्टोरेंट डिजिटल मेनू क्यूआर कोड' : 'Main Restaurant Menu QR Code'}
              </h2>
              <p className="text-xs text-slate-500 max-w-md">
                {isHindi
                  ? 'इसे रेस्टोरेंट प्रवेश द्वार, कैश काउंटर या सोशल मीडिया पर प्रदर्शित करें। ग्राहक बिना किसी पूर्व-निर्धारित टेबल के पूरा मेनू देख सकते हैं।'
                  : 'Display this code at the restaurant entrance, reception desk, or social media. Customers can scan to view the complete catalog without a pre-assigned table.'}
              </p>
              <a
                href={data.general.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 hover:text-emerald-800 break-all"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>{data.general.url}</span>
              </a>

              <div className="pt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  onClick={() => handleDownload(data.general.qrImage, 'Vrindavan-General-Menu-QR')}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'PNG डाउनलोड करें' : 'Download PNG'}</span>
                </button>
                <button
                  onClick={() => handlePrintTableCard(isHindi ? 'मुख्य प्रवेश द्वार' : 'Main Entrance', data.general.qrImage, data.general.url)}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 shadow-xs transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isHindi ? 'स्टैंडी प्रिंट करें' : 'Print Standee'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table-Specific QR Codes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>{isHindi ? 'टेबल-विशिष्ट क्यूआर कोड' : 'Table-Specific QR Codes'}</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({data.tables?.length || 0} {isHindi ? 'टेबल' : 'tables'})
                </span>
              </h2>
              <span className="text-xs text-slate-400">
                {isHindi ? 'स्कैन करने पर टेबल स्वतः लोड होती है' : 'Auto-identifies table on scan'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.tables.map((table: any) => (
                <div
                  key={table.tableId}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between items-center text-center space-y-4 hover:border-emerald-300 transition-all"
                >
                  <div className="p-3 bg-white border border-black rounded-2xl">
                    <img
                      src={table.qrImage}
                      alt={table.tableNumber}
                      className="w-36 h-36 rounded-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900">{table.tableNumber}</h3>
                    <p className="text-xs text-slate-400">
                      {isHindi ? `बैठक क्षमता: ${table.capacity} व्यक्ति` : `Capacity: ${table.capacity} Persons`}
                    </p>
                    <a
                      href={table.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-emerald-700 hover:text-emerald-800 break-all"
                      title={table.url}
                    >
                      {table.url}
                    </a>
                  </div>

                  <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDownload(table.qrImage, `QR-${table.tableNumber.replace(/\s+/g, '-')}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      title="Download QR Image"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'सहेजें' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => handlePrintTableCard(table.tableNumber, table.qrImage, table.url)}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-1.5 px-3 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
                      title="Print Table Tent Card"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isHindi ? 'कार्ड प्रिंट' : 'Print Card'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-900">
                {isHindi ? 'डाइनिंग टेबल जोड़ें' : 'Add Dining Table'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleAddTable} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'टेबल नंबर / नाम *' : 'Table Number / Identifier *'}
                </label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder={isHindi ? 'उदा. Table 7, केबिन 2, आउटडोर T-1' : 'e.g. Table 7, Booth 2, Outdoor T-1'}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'बैठक क्षमता (व्यक्ति)' : 'Seating Capacity (Persons)'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving
                    ? isHindi
                      ? 'बनाया जा रहा है...'
                      : 'Creating...'
                    : isHindi
                    ? 'टेबल बनाएं'
                    : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
