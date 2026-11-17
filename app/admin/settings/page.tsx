'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, ShieldCheck, CreditCard, Store } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminSettingsPage() {
  const { isHindi } = useLanguage();
  const [formData, setFormData] = useState<any>({
    name: '',
    tagline: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    taxRatePercent: 5,
    fssaiNumber: '',
    upiId: '',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    enableCash: true,
    enableOnline: true,
    receiptFooter: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.business.name || '',
            tagline: data.business.tagline || '',
            address: data.business.address || '',
            phone: data.business.phone || '',
            email: data.business.email || '',
            openingHours: data.business.openingHours || '',
            taxRatePercent: data.business.taxRatePercent ?? 5,
            fssaiNumber: data.business.fssaiNumber || '',
            upiId: data.settings?.upiId || '',
            razorpayKeyId: data.settings?.razorpayKeyId || '',
            razorpayKeySecret: data.settings?.razorpayKeySecret || '',
            enableCash: data.settings?.enableCash ?? true,
            enableOnline: data.settings?.enableOnline ?? true,
            receiptFooter: data.settings?.receiptFooter || '',
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (isHindi ? 'सेटिंग्स अपडेट करने में विफल' : 'Failed to update settings'));

      setSuccessMsg(
        isHindi
          ? 'रेस्टोरेंट प्रोफ़ाइल और भुगतान सेटिंग्स सफलतापूर्वक सहेज ली गईं!'
          : 'Business profile and payment settings updated successfully!'
      );
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        {isHindi ? 'स्टोर सेटिंग्स लोड हो रही हैं...' : 'Loading business settings...'}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isHindi ? 'व्यापार सेटिंग्स (Business Settings)' : 'Business Settings'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isHindi
            ? 'रेस्टोरेंट ब्रांडिंग, कानूनी लाइसेंसिंग, जीएसटी कर नियम और रेज़रपे पेमेंट गेटवे क्रेडेंशियल प्रबंधित करें।'
            : 'Configure restaurant branding, legal licensing, GST tax rules, and Razorpay gateway credentials.'}
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. General Profile */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">
              {isHindi ? 'रेस्टोरेंट ब्रांडिंग और संपर्क' : 'Restaurant Branding & Contact'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'रेस्टोरेंट का नाम *' : 'Business Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'टैगलाइन / आदर्श वाक्य' : 'Tagline / Motto'}
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'भौतिक पता *' : 'Physical Address *'}
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'संपर्क फ़ोन *' : 'Contact Phone *'}
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'संपर्क ईमेल *' : 'Contact Email *'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'खुलने का समय *' : 'Opening Hours *'}
              </label>
              <input
                type="text"
                required
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="08:00 AM - 10:30 PM"
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'FSSAI लाइसेंस संख्या' : 'FSSAI License Number'}
              </label>
              <input
                type="text"
                value={formData.fssaiNumber}
                onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                placeholder="12724001000456"
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Tax & Receipts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">
              {isHindi ? 'कर सेटिंग्स और डिजिटल रसीद' : 'Tax Settings & Digital Receipts'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'GST कर दर (%)' : 'GST Tax Rate (%)'}
              </label>
              <input
                type="number"
                min="0"
                max="28"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {isHindi ? 'रेस्टोरेंट के लिए सामान्यतः 5% जीएसटी' : 'Default is 5% for restaurants without ITC'}
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'डायरेक्ट UPI ID' : 'Direct UPI ID'}
              </label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="vrindavan@okhdfcbank"
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                {isHindi ? 'रसीद फ़ूटर संदेश' : 'Receipt Footer Note'}
              </label>
              <input
                type="text"
                value={formData.receiptFooter}
                onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
                placeholder="राधे राधे! हमारे यहाँ पधारने के लिए धन्यवाद।"
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Razorpay Gateway Credentials */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">
              {isHindi ? 'पेमेंट गेटवे विन्यास (Razorpay)' : 'Payment Gateway Configuration'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={formData.razorpayKeyId}
                onChange={(e) => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                placeholder="rzp_test_..."
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Razorpay Key Secret</label>
              <input
                type="password"
                value={formData.razorpayKeySecret}
                onChange={(e) => setFormData({ ...formData, razorpayKeySecret: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableOnline}
                  onChange={(e) => setFormData({ ...formData, enableOnline: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700">
                  {isHindi ? 'ऑनलाइन रेज़रपे (UPI / कार्ड) चालू रखें' : 'Enable Razorpay UPI / Cards'}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableCash}
                  onChange={(e) => setFormData({ ...formData, enableCash: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700">
                  {isHindi ? 'काउंटर नकद भुगतान (Cash) चालू रखें' : 'Enable Cash at Counter Payment'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-emerald-200 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSaving
                ? isHindi
                  ? 'सहेजा जा रहा है...'
                  : 'Saving Changes...'
                : isHindi
                ? 'सेटिंग्स सहेजें'
                : 'Save Business Settings'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
