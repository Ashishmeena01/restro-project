'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Envelope as Mail,
  ArrowRight,
  WarningCircle as AlertCircle,
} from '@phosphor-icons/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isHindi } = useLanguage();
  const [email, setEmail] = useState('admin@vrindavan.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isHindi ? 'अमान्य क्रेडेंशियल्स' : 'Invalid credentials'));
      }

      router.push(data.user?.role === 'KITCHEN' ? '/kitchen' : '/admin');
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : isHindi
            ? 'लॉगिन विफल रहा'
            : 'Login failed'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12 text-slate-100">
      <div className="w-full max-w-md mb-3 flex justify-end">
        <LanguageSwitcher variant="compact" className="bg-slate-800 border-slate-700 text-slate-200" />
      </div>

      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-lg shadow-emerald-900/50">
            व
          </div>
          <h1 className="font-display text-3xl font-semibold text-white">
            {isHindi ? 'व्यवस्थापक पोर्टल लॉगिन' : 'Business Admin Portal'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isHindi ? 'वृंदावन शुद्ध शाकाहारी स्वीट्स & कैफ़े प्रबंधन' : 'Vrindavan Pure Veg Sweets & Café Management'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isHindi ? 'ईमेल आईडी' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vrindavan.com"
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isHindi ? 'पासवर्ड' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-emerald-500 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs tracking-wide shadow-md shadow-emerald-950 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>{isHindi ? 'लॉगिन हो रहा है...' : 'Logging in...'}</span>
            ) : (
              <>
                <span>{isHindi ? 'डैशबोर्ड में प्रवेश करें' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-8 pt-6 border-t border-slate-700/80 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? 'डेमो क्रेडेंशियल्स:' : 'Pre-configured Demo Credentials:'}</span>
          </p>
          <div className="space-y-1 font-mono text-[11px] bg-slate-900/60 p-3 rounded-xl border border-slate-700">
            <p>Admin: <span className="text-emerald-400">admin@vrindavan.com</span> / <span className="text-emerald-400">admin123</span></p>
            <p>Staff: <span className="text-slate-300">staff@vrindavan.com</span> / <span className="text-slate-300">staff123</span></p>
            <p>Kitchen: <span className="text-amber-300">kitchen@vrindavan.com</span> / <span className="text-amber-300">kitchen123</span></p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            {isHindi ? '← ग्राहक स्टोर पर वापस जाएं' : '← Return to Customer Website'}
          </Link>
        </div>
      </div>
    </div>
  );
}
