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
  ChefHat,
} from 'lucide-react';
import { formatPaise } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { VegMark } from '@/components/ui/VegMark';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1920&q=80';
const ABOUT_IMAGE_MAIN =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80';
const ABOUT_IMAGE_SIDE =
  'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=600&q=80';

interface HomeClientProps {
  business: {
    name: string;
    tagline: string | null;
    address: string;
    phone: string;
    openingHours: string;
  };
  previewProducts: Array<{
    id: string;
    name: string;
    price: number;
    description: string | null;
    imageUrl?: string | null;
  }>;
}

export function HomeClient({ business, previewProducts }: HomeClientProps) {
  const { t, isHindi, translateDish, translateDescription } = useLanguage();

  const businessDisplayName = isHindi ? t('brand.name') : business.name;
  const businessDisplayTagline = isHindi ? t('hero.subtitle') : business.tagline;

  const features = [
    { icon: QrCode, title: t('feat.qr_title'), desc: t('feat.qr_desc') },
    { icon: ShieldCheck, title: t('feat.pay_title'), desc: t('feat.pay_desc') },
    { icon: Award, title: t('feat.veg_title'), desc: t('feat.veg_desc') },
    { icon: Clock, title: t('feat.fast_title'), desc: t('feat.fast_desc') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 text-amber-300 flex items-center justify-center font-display text-xl shrink-0">
              व
            </div>
            <div className="min-w-0">
              <span className="font-display text-base sm:text-xl text-amber-50 leading-tight block truncate">
                {businessDisplayName}
              </span>
              <span className="text-[11px] text-amber-400/90 tracking-wide hidden sm:block">
                {t('brand.badge')}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm text-amber-100/80">
            <Link href="/menu" className="hover:text-amber-300 transition-colors">
              {t('nav.digital_menu')}
            </Link>
            <a href="#specialties" className="hover:text-amber-300 transition-colors">
              {t('home.top_favorites')}
            </a>
            <a href="#about" className="hover:text-amber-300 transition-colors">
              {t('about.badge')}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher variant="dark" />
            <Link
              href="/menu"
              aria-label={t('home.order_now')}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">{t('home.order_now')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden text-white">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/90" />

        <div className="max-w-6xl mx-auto px-4 pt-20 pb-28 sm:pt-28 sm:pb-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-200 text-xs font-medium tracking-wide mb-7">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-7xl leading-tight sm:leading-[1.1] max-w-4xl mx-auto">
            {t('hero.title_part1')}
            <br className="hidden sm:inline" />
            <span className="italic text-amber-300">{t('hero.title_part2')}</span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-amber-50/80 max-w-2xl mx-auto leading-relaxed">
            {businessDisplayTagline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-colors shadow-lg shadow-emerald-900/40"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>{t('hero.cta_order')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-amber-200/50 hover:bg-white/10 text-amber-50 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-colors"
            >
              <QrCode className="w-5 h-5 text-amber-300" />
              <span>{t('hero.cta_qr')}</span>
            </Link>
          </div>
        </div>

        {/* Info strip */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/10 bg-slate-950/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-[11px] sm:text-xs text-amber-100/80">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {business.openingHours}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {business.address}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              {business.phone}
            </span>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full border border-amber-500/50 bg-white flex items-center justify-center text-emerald-700">
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-display text-base text-slate-900">{title}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signature dishes */}
      <section id="specialties" className="py-16 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="ornament text-xs font-semibold text-amber-700 uppercase tracking-[0.25em]">
              <span>{t('home.top_favorites')}</span>
            </p>
            <h2 className="font-display text-3xl sm:text-5xl text-slate-900 mt-3">
              {t('home.signature_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewProducts.map((product) => (
              <article
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="relative h-44 bg-gradient-to-br from-emerald-100 to-amber-100 overflow-hidden">
                  <ChefHat className="absolute inset-0 m-auto w-10 h-10 text-emerald-300" aria-hidden />
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span className="absolute top-3 right-3 bg-slate-950/80 text-amber-200 font-semibold text-sm px-3 py-1 rounded-full">
                    {formatPaise(product.price)}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-green-700">
                    <VegMark />
                    {t('home.veg_tag')}
                  </div>
                  <h3 className="font-display text-xl text-slate-900 mt-2">
                    {translateDish(product.name)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed flex-1">
                    {translateDescription(product.description)}
                  </p>
                  <Link
                    href="/menu"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>{t('home.order_now')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-amber-50 px-7 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              <span>{t('home.explore_all')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 sm:py-24 bg-slate-100 border-y border-slate-200 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 sm:h-[26rem]">
            <img
              src={ABOUT_IMAGE_MAIN}
              alt=""
              loading="lazy"
              className="absolute left-0 top-0 w-4/5 h-4/5 object-cover rounded-2xl shadow-lg"
            />
            <img
              src={ABOUT_IMAGE_SIDE}
              alt=""
              loading="lazy"
              className="absolute right-0 bottom-0 w-1/2 h-1/2 object-cover rounded-2xl border-8 border-slate-100 shadow-xl"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-[0.25em]">
              {t('about.badge')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-slate-900 mt-3 mb-5 leading-tight">
              {t('about.title')}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              <strong className="text-slate-900">{businessDisplayName}</strong> {t('about.p1')}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">{t('about.p2')}</p>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: MapPin, label: t('about.address_label'), value: business.address },
                {
                  icon: Clock,
                  label: t('about.hours_label'),
                  value: `${business.openingHours} ${t('about.hours_open')}`,
                },
                { icon: Phone, label: t('about.contact_label'), value: business.phone },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl p-4 border border-slate-200">
                  <Icon className="w-5 h-5 text-emerald-700 mb-2" />
                  <p className="text-xs font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dine-in CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-amber-50 px-6 py-12 sm:px-14 flex flex-col md:flex-row items-center gap-8">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-600/30 blur-3xl" aria-hidden />
            <div className="w-24 h-24 shrink-0 rounded-2xl border border-amber-400/40 bg-amber-400/10 flex items-center justify-center text-amber-300">
              <QrCode className="w-12 h-12" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-2xl sm:text-3xl">{t('about.visiting_title')}</h3>
              <p className="text-sm text-amber-100/70 mt-2 leading-relaxed max-w-xl">
                {t('about.visiting_desc')}
              </p>
            </div>
            <Link
              href="/menu"
              className="relative inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors shrink-0"
            >
              <span>{t('about.launch_menu')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-amber-100/70 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid gap-8 sm:grid-cols-3 text-sm">
          <div>
            <p className="font-display text-xl text-amber-50">{businessDisplayName}</p>
            <p className="mt-2 text-xs leading-relaxed">{t('footer.fssai')}</p>
          </div>
          <div className="space-y-2 text-xs">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              {business.address}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              {business.openingHours}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              {business.phone}
            </p>
          </div>
          <div className="flex flex-wrap sm:justify-end items-start gap-x-5 gap-y-2 text-xs">
            <Link href="/menu" className="hover:text-amber-300 transition-colors">
              {t('nav.digital_menu')}
            </Link>
            <Link href="/checkout" className="hover:text-amber-300 transition-colors">
              {t('nav.cart')}
            </Link>
            <Link href="/admin/login" className="hover:text-amber-300 transition-colors">
              {t('nav.admin_login')}
            </Link>
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-white/10 text-[11px] text-amber-100/50 text-center">
          © {new Date().getFullYear()} {businessDisplayName}. {t('footer.all_rights')}
        </div>
      </footer>
    </div>
  );
}
