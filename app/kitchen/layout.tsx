'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CookingPot,
  SignOut as LogOut,
  CornersOut,
  CornersIn,
  Clock,
} from '@phosphor-icons/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isHindi } = useLanguage();
  const [clock, setClock] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreen);
    syncFullscreen();
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by the browser; the board still works normally.
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 ring-2 ring-amber-400/30">
              <CookingPot className="h-5 w-5" weight="fill" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold leading-tight text-amber-50 sm:text-xl">
                {isHindi ? 'रसोई डिस्प्ले' : 'Kitchen Display'}
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/70">
                {isHindi ? 'वृंदावन स्वीट्स' : 'Vrindavan Sweets'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 sm:flex">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-mono tabular-nums">{clock || '--:--:--'}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">IST</span>
            </div>

            <LanguageSwitcher variant="dark" />

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              {isFullscreen ? <CornersIn className="h-4 w-4" /> : <CornersOut className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{isHindi ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 sm:px-6 sm:py-6">
        {children}
      </main>
    </div>
  );
}
