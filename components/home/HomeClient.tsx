'use client';

import React from 'react';
import Link from 'next/link';
import {
  QrCode,
  UtensilsCrossed,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight,
  Award,
  Sparkles,
} from 'lucide-react';
import { formatPaise } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface HomeClientProps {
  business: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    openingHours: string;
  };
  previewProducts: Array<{
    id: string;
    name: string;
    price: number;
    description: string | null;
  }>;
}

export function HomeClient({ business, previewProducts }: HomeClientProps) {
  const { t, isHindi, translateDish, translateDescription } = useLanguage();

  const businessDisplayName = isHindi ? t('brand.name') : business.name;
  const businessDisplayTagline = isHindi ? t('hero.subtitle') : business.tagline;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              व
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-slate-900 leading-tight block">
                {businessDisplayName}
              </span>
              <span className="text-xs text-emerald-700 font-medium hidden sm:block">
                {t('brand.badge')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Pill */}
            <LanguageSwitcher />

            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm shadow-emerald-200"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('nav.digital_menu')}</span>
            </Link>

            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors font-medium"
            >
              {t('nav.owner_portal')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 py-14 sm:py-20 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight sm:leading-tight">
            {t('hero.title_part1')}
            <br className="hidden sm:inline" />
            <span className="text-emerald-600">{t('hero.title_part2')}</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {businessDisplayTagline}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md shadow-emerald-200 hover:shadow-lg"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>{t('hero.cta_order')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base border border-slate-200 shadow-sm"
            >
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>{t('hero.cta_qr')}</span>
            </Link>
          </div>

          {/* Quick Features Row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{t('feat.qr_title')}</p>
                <p className="text-[11px] text-slate-500">{t('feat.qr_desc')}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{t('feat.pay_title')}</p>
                <p className="text-[11px] text-slate-500">{t('feat.pay_desc')}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{t('feat.veg_title')}</p>
                <p className="text-[11px] text-slate-500">{t('feat.veg_desc')}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{t('feat.fast_title')}</p>
                <p className="text-[11px] text-slate-500">{t('feat.fast_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Preview Section */}
      <section className="py-14 sm:py-18 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {t('home.top_favorites')}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {t('home.signature_title')}
              </h2>
            </div>
            <Link
              href="/menu"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>{t('home.explore_all')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {previewProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {t('home.veg_tag')}
                    </span>
                    <span className="font-bold text-lg text-emerald-600">
                      {formatPaise(product.price)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    {translateDish(product.name)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {translateDescription(product.description)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t('home.freshly_made')}</span>
                  <Link
                    href={`/menu`}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t('home.order_now')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Business Details Section */}
      <section className="py-14 sm:py-18 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {t('about.badge')}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-4">
                {t('about.title')}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                <strong>{businessDisplayName}</strong> {t('about.p1')}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {t('about.p2')}
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t('about.address_label')}</p>
                    <p className="text-xs text-slate-600">{business.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t('about.hours_label')}</p>
                    <p className="text-xs text-slate-600">
                      {business.openingHours} {t('about.hours_open')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t('about.contact_label')}</p>
                    <p className="text-xs text-slate-600">{business.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <QrCode className="w-14 h-14" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-slate-900">
                {t('about.visiting_title')}
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                {t('about.visiting_desc')}
              </p>
              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm shadow-emerald-200"
              >
                <span>{t('about.launch_menu')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-white text-sm">{businessDisplayName}</p>
            <p className="mt-1 text-slate-400">{t('footer.fssai')}</p>
          </div>
          <div className="flex items-center gap-5 sm:gap-6">
            <Link href="/menu" className="hover:text-white transition-colors">
              {t('nav.digital_menu')}
            </Link>
            <Link href="/checkout" className="hover:text-white transition-colors">
              {t('nav.cart')}
            </Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              {t('nav.admin_login')}
            </Link>
            <LanguageSwitcher variant="compact" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" />
          </div>
        </div>
      </footer>
    </div>
  );
}

