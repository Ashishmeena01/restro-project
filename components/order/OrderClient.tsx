'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle as CheckCircle2,
  Receipt as ReceiptText,
  ArrowLeft,
  ForkKnife as UtensilsCrossed,
} from '@phosphor-icons/react';
import { formatPaise, formatDate } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface OrderClientProps {
  order: {
    id: string;
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: Date | string;
    subtotal: number;
    tax: number;
    total: number;
    table?: {
      tableNumber: string;
    } | null;
    items: Array<{
      id: string;
      productName: string;
      quantity: number;
      totalPrice: number;
    }>;
  };
}

export function OrderClient({ order }: OrderClientProps) {
  const { t, isHindi, translateDish, translateStatus } = useLanguage();

  const steps = [
    { key: 'CONFIRMED', ...translateStatus('CONFIRMED') },
    { key: 'PREPARING', ...translateStatus('PREPARING') },
    { key: 'READY', ...translateStatus('READY') },
    { key: 'COMPLETED', ...translateStatus('COMPLETED') },
  ];

  const getStepStatus = (stepKey: string) => {
    const statusOrder = ['PENDING_PAYMENT', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(order.orderStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (order.orderStatus === 'CANCELLED') return 'cancelled';
    if (currentIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  const getStatusHeroTitle = () => {
    if (order.orderStatus === 'COMPLETED') return t('order.status_completed_title');
    if (order.orderStatus === 'CANCELLED') return t('order.status_cancelled_title');
    if (order.orderStatus === 'READY') return t('order.status_ready_title');
    if (order.orderStatus === 'PREPARING') return t('order.status_preparing_title');
    return t('order.status_confirmed_title');
  };

  const getStatusHeroDesc = () => {
    if (order.orderStatus === 'COMPLETED') return t('order.status_completed_desc');
    if (order.orderStatus === 'CANCELLED') return t('order.status_cancelled_desc');
    if (order.orderStatus === 'READY') return t('order.status_ready_desc');
    if (order.orderStatus === 'PREPARING') return t('order.status_preparing_desc');
    return t('order.status_confirmed_desc');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <div className="bg-slate-950 text-amber-50 border-b border-amber-900/40 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          <Link
            href="/menu"
            aria-label={t('nav.digital_menu')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-100/80 hover:text-white shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.digital_menu')}</span>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-amber-200 bg-white/5 px-2.5 py-1 rounded-full border border-amber-500/30 whitespace-nowrap truncate">
              {t('order.number')} {order.orderNumber}
            </span>
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 space-y-5">
        {/* Main Status Hero Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {getStatusHeroTitle()}
          </h1>

          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {order.table?.tableNumber ? (
              <span>
                {isHindi
                  ? `आपकी टेबल `
                  : 'Your items will be served hot at '}
                <strong>{order.table.tableNumber}</strong>
                {isHindi ? ' पर गरमा-गरम परोसा जाएगा।' : '.'}
              </span>
            ) : (
              <span>
                {isHindi
                  ? 'कृपया पार्सल काउंटर से अपना आर्डर प्राप्त करें।'
                  : 'Please collect your items at the takeaway counter.'}
              </span>
            )}
          </p>

          <p className="text-[11px] text-emerald-700 mt-2 font-medium">
            {getStatusHeroDesc()}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-600">
            <div>
              <p className="text-[11px] text-slate-400">
                {isHindi ? 'आर्डर का समय' : 'Order Placed'}
              </p>
              <p className="font-semibold text-slate-800">{formatDate(order.createdAt)}</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div>
              <p className="text-[11px] text-slate-400">
                {isHindi ? 'भुगतान स्थिति' : 'Payment Status'}
              </p>
              <p className="font-semibold text-emerald-600 capitalize">
                {order.paymentStatus === 'PAID'
                  ? t('order.paid')
                  : t('order.unpaid_cash')}
              </p>
            </div>
          </div>
        </div>

        {/* Live Timeline Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
            {t('order.timeline')}
          </h2>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {steps.map((st) => {
              const state = getStepStatus(st.key);
              const isDone = state === 'completed';

              return (
                <div key={st.key} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                      {st.label}
                    </p>
                    <p className="text-[11px] text-slate-400">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Itemized Order Details */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            <span>{t('order.ordered_items')}</span>
            <span className="text-[11px] text-slate-400 font-normal">
              {order.items.length} {isHindi ? 'व्यंजन' : 'dishes'}
            </span>
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items.map((it) => (
              <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">
                    {translateDish(it.productName)}
                  </span>
                  <span className="text-slate-400 ml-2">x {it.quantity}</span>
                </div>
                <span className="font-bold text-slate-900">{formatPaise(it.totalPrice)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{t('checkout.subtotal')}</span>
              <span>{formatPaise(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('checkout.tax')}</span>
              <span>{formatPaise(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-100">
              <span>{t('checkout.total')}</span>
              <span className="text-emerald-600">{formatPaise(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/receipt/${order.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <ReceiptText className="w-4 h-4 text-emerald-400" />
            <span>{t('order.view_receipt')}</span>
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 py-3 px-6 rounded-xl font-medium text-xs border border-slate-200 shadow-xs cursor-pointer"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('order.order_more')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

