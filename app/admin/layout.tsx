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

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Live Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: UtensilsCrossed },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/receipts', label: 'Receipts', icon: ReceiptText },
  { href: '/admin/reports', label: 'Daily Reports', icon: BarChart3 },
  { href: '/admin/best-sellers', label: 'Best Sellers', icon: TrendingUp },
  { href: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
  { href: '/admin/settings', label: 'Business Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render clean without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

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
            V
          </div>
          <div>
            <span className="font-bold text-sm block">Vrindavan Admin</span>
            <span className="text-[10px] text-emerald-400">Owner Portal</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 fixed md:sticky top-0 h-auto md:h-screen z-40 md:z-10 overflow-y-auto flex flex-col justify-between`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              V
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">Vrindavan Sweets</h2>
              <p className="text-[11px] text-emerald-400 font-medium">Business Admin & POS</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
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
              <span>Customer Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
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
