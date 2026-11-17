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
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            व
          </div>
          <div>
            <span className="font-bold text-sm block">
              {isHindi ? 'वृंदावन एडमिन' : 'Vrindavan Admin'}
            </span>
            <span className="text-[10px] text-emerald-400">
              {isHindi ? 'व्यवस्थापक पोर्टल' : 'Owner Portal'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" className="bg-slate-800 border-slate-700 text-slate-200" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 fixed md:sticky top-0 h-auto md:h-screen z-40 md:z-10 overflow-y-auto flex flex-col justify-between`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 hidden md:flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                व
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm text-white leading-tight truncate">
                  {isHindi ? 'वृंदावन स्वीट्स' : 'Vrindavan Sweets'}
                </h2>
                <p className="text-[11px] text-emerald-400 font-medium">
                  {isHindi ? 'व्यवस्थापक व पीओएस' : 'Admin & POS'}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Language Switcher */}
          <div className="px-4 pt-3 pb-1 hidden md:block">
            <LanguageSwitcher className="w-full justify-center bg-slate-800 border-slate-700" />
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
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
