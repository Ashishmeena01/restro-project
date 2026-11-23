'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tags,
  CreditCard,
  ReceiptText,
  BarChart3,
  TrendingUp,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isHindi } = useLanguage();

  // If on login page, render clean without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', label: t('admin.nav_overview'), icon: LayoutDashboard },
    { href: '/admin/orders', label: t('admin.nav_orders'), icon: ShoppingBag },
    { href: '/admin/products', label: t('admin.nav_products'), icon: UtensilsCrossed },
    { href: '/admin/categories', label: t('admin.nav_categories'), icon: Tags },
    { href: '/admin/payments', label: t('admin.nav_payments'), icon: CreditCard },
    { href: '/admin/receipts', label: t('admin.nav_receipts'), icon: ReceiptText },
    { href: '/admin/reports', label: t('admin.nav_reports'), icon: BarChart3 },
    { href: '/admin/best-sellers', label: t('admin.nav_best_sellers'), icon: TrendingUp },
    { href: '/admin/qr-codes', label: t('admin.nav_qr_codes'), icon: QrCode },
    { href: '/admin/settings', label: t('admin.nav_settings'), icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 text-amber-50 border-b border-amber-900/40 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-display text-sm ring-2 ring-amber-400/40">
            व
          </div>
          <div>
            <span className="font-display text-base leading-tight block">
              {isHindi ? 'वृंदावन एडमिन' : 'Vrindavan Admin'}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-amber-300/80">
              {isHindi ? 'व्यवस्थापक पोर्टल' : 'Owner Portal'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="dark" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-full bg-white/10 text-amber-50 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-300 flex-shrink-0 fixed md:sticky top-[60px] md:top-0 max-h-[calc(100vh-60px)] md:max-h-none h-auto md:h-screen z-40 md:z-10 overflow-y-auto flex flex-col justify-between`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-amber-900/30 hidden md:flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-display text-lg ring-2 ring-amber-400/40 shrink-0">
                व
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-lg text-amber-50 leading-tight truncate">
                  {isHindi ? 'वृंदावन स्वीट्स' : 'Vrindavan Sweets'}
                </h2>
                <p className="text-[10px] uppercase tracking-[0.18em] text-amber-300/80 font-semibold">
                  {isHindi ? 'व्यवस्थापक व पीओएस' : 'Admin & POS'}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Language Switcher */}
          <div className="px-4 pt-3 pb-1 hidden md:block">
            <LanguageSwitcher variant="dark" className="w-full justify-center" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-black/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-300/70'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-amber-900/30 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>{t('admin.nav_view_store')}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('admin.nav_logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
