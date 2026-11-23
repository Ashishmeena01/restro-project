'use client';

import React from 'react';
import { Translate as Languages } from '@phosphor-icons/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'minimal' | 'dark';
}

export function LanguageSwitcher({ className = '', variant = 'pill' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-xs ${className}`}
        aria-label="Switch Language / भाषा बदलें"
      >
        <Languages className="w-3.5 h-3.5 text-emerald-600" />
        <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
      </button>
    );
  }

  if (variant === 'dark') {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-400/30 bg-white/5 hover:bg-white/15 text-xs font-semibold text-amber-50 transition-all ${className}`}
        aria-label="Switch Language / भाषा बदलें"
      >
        <Languages className="w-3.5 h-3.5 text-amber-300" />
        <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
        className={`inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors ${className}`}
      >
        <Languages className="w-3.5 h-3.5" />
        <span>{language === 'hi' ? 'EN' : 'हि'}</span>
      </button>
    );
  }

  // Standard Pill Variant
  return (
    <div
      className={`inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-xs ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === 'hi'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        }`}
      >
        <span>हिंदी</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === 'en'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        }`}
      >
        <span>English</span>
      </button>
    </div>
  );
}

