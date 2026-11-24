'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowsClockwise as RefreshCw,
  BellRinging,
  CheckCircle,
  CheckFat,
  Fire,
  Hourglass,
  SpeakerHigh,
  SpeakerSlash,
  Timer,
  ArrowCounterClockwise,
  NotePencil,
  Money,
  CookingPot,
  ForkKnife,
} from '@phosphor-icons/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type ColumnStatus = 'CONFIRMED' | 'PREPARING' | 'READY';
type KitchenTargetStatus = ColumnStatus | 'COMPLETED';

type KitchenOrderItem = {
  id: string;
  productName: string;
  quantity: number;
  notes: string | null;
};

type KitchenOrder = {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string | null;
  customerPhone: string | null;
  notes: string | null;
  createdAt: string;
  table: { id: string; tableNumber: string } | null;
  items: KitchenOrderItem[];
};

const POLL_INTERVAL_MS = 10_000;

const COLUMNS: {
  status: ColumnStatus;
  labelEn: string;
  labelHi: string;
  hintEn: string;
  hintHi: string;
  headerClass: string;
  dotClass: string;
  emptyTextEn: string;
  emptyTextHi: string;
}[] = [
  {
    status: 'CONFIRMED',
    labelEn: 'New Orders',
    labelHi: 'नए आर्डर',
    hintEn: 'Start cooking in order of arrival',
    hintHi: 'आर्डर के क्रम में पकाना शुरू करें',
    headerClass: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
    dotClass: 'bg-amber-400',
    emptyTextEn: 'No new orders waiting',
    emptyTextHi: 'कोई नया आर्डर प्रतीक्षारत नहीं है',
  },
  {
    status: 'PREPARING',
    labelEn: 'Cooking Now',
    labelHi: 'पक रहा है',
    hintEn: 'On the stove right now',
    hintHi: 'अभी तवे/चूल्हे पर',
    headerClass: 'border-sky-500/40 bg-sky-500/10 text-sky-200',
    dotClass: 'bg-sky-400',
    emptyTextEn: 'Nothing on the stove',
    emptyTextHi: 'अभी कुछ नहीं पक रहा है',
  },
  {
    status: 'READY',
    labelEn: 'Ready to Serve',
    labelHi: 'परोसने को तैयार',
    hintEn: 'Hand over to the counter / table',
    hintHi: 'काउंटर या टेबल पर भेजें',
    headerClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    dotClass: 'bg-emerald-400',
    emptyTextEn: 'No orders waiting to be served',
    emptyTextHi: 'कोई आर्डर परोसने के लिए तैयार नहीं है',
  },
];

function formatPlacedTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function getAgeTone(minutes: number) {
  if (minutes >= 15) return 'border-rose-500/40 bg-rose-500/10 text-rose-200';
  if (minutes >= 8) return 'border-amber-500/40 bg-amber-500/10 text-amber-200';
  return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
}

function KitchenOrderCard({
  order,
  now,
  isHindi,
  translateDish,
  isUpdating,
  onUpdate,
}: {
  order: KitchenOrder;
  now: number;
  isHindi: boolean;
  translateDish: (name: string) => string;
  isUpdating: boolean;
  onUpdate: (order: KitchenOrder, nextStatus: KitchenTargetStatus) => void;
}) {
  const ageMinutes = Math.max(0, Math.floor((now - new Date(order.createdAt).getTime()) / 60_000));
  const ageLabel =
    ageMinutes < 1
      ? isHindi
        ? 'अभी'
        : 'just now'
      : `${ageMinutes} ${isHindi ? 'मिनट' : 'min'}`;

  const fullStatus = (order.orderStatus as ColumnStatus) || 'CONFIRMED';
  const column = COLUMNS.find((c) => c.status === fullStatus) ?? COLUMNS[0];

  const primaryAction: { next: KitchenTargetStatus; label: string; className: string } =
    fullStatus === 'CONFIRMED'
      ? {
          next: 'PREPARING',
          label: isHindi ? 'पकाना शुरू करें' : 'Start Cooking',
          className: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
        }
      : fullStatus === 'PREPARING'
        ? {
            next: 'READY',
            label: isHindi ? 'तैयार है — भेजें' : 'Mark Ready',
            className: 'bg-sky-500 text-white hover:bg-sky-400',
          }
        : {
            next: 'COMPLETED',
            label: isHindi ? 'परोस दिया' : 'Served / Done',
            className: 'bg-emerald-600 text-white hover:bg-emerald-500',
          };

  const recallTarget: KitchenTargetStatus | null =
    fullStatus === 'PREPARING' ? 'CONFIRMED' : fullStatus === 'READY' ? 'PREPARING' : null;

  const isCashPending = order.paymentMethod === 'CASH' && order.paymentStatus === 'PENDING';
  const isPaid = order.paymentStatus === 'SUCCESS';
  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-black/20">
      {/* Card header: table + order number + age */}
      <div className={`flex items-start justify-between gap-3 border-b px-4 py-3 ${column.headerClass}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold leading-none tracking-tight text-white">
              {order.table?.tableNumber || (isHindi ? 'पार्सल' : 'Takeaway')}
            </span>
            <span className="rounded-md bg-black/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
              {order.table ? 'Dine-in' : isHindi ? 'काउंटर' : 'Takeaway'}
            </span>
          </div>
          <p className="mt-1 truncate font-mono text-[11px] font-semibold text-white/70">
            {order.orderNumber}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold tabular-nums ${getAgeTone(
              ageMinutes
            )}`}
          >
            <Timer className="h-3 w-3" />
            {ageLabel}
          </span>
          <span className="text-[10px] font-medium text-white/50">
            {isHindi ? 'आर्डर:' : 'Placed:'} {formatPlacedTime(order.createdAt)}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {/* Quick facts */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 text-slate-300">
            <ForkKnife className="h-3 w-3" />
            {totalUnits} {isHindi ? 'आइटम' : totalUnits === 1 ? 'item' : 'items'}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${
              isPaid
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : isCashPending
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            <Money className="h-3 w-3" />
            {isPaid
              ? isHindi
                ? 'भुगतान हो गया'
                : 'Paid'
              : isCashPending
                ? isHindi
                  ? 'नकद लेना है'
                  : 'Collect Cash'
                : isHindi
                  ? 'भुगतान लंबित'
                  : 'Payment pending'}
          </span>
        </div>

        {/* Kitchen note for the whole order */}
        {order.notes && (
          <div className="flex gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5">
            <NotePencil className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" weight="fill" />
            <p className="text-xs font-semibold leading-snug text-amber-100">{order.notes}</p>
          </div>
        )}

        {/* What to cook */}
        <ol className="divide-y divide-slate-800/80">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="mt-0.5 inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-slate-800 px-1.5 text-sm font-extrabold tabular-nums text-amber-200 ring-1 ring-slate-700">
                {item.quantity}×
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-slate-100">
                  {translateDish(item.productName)}
                </p>
                {item.notes && (
                  <p className="mt-0.5 text-[11px] font-medium text-amber-300/90">
                    ↳ {item.notes}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {order.customerName && (
          <p className="text-[11px] text-slate-500">
            {isHindi ? 'ग्राहक:' : 'Guest:'}{' '}
            <span className="font-semibold text-slate-300">{order.customerName}</span>
          </p>
        )}

        {/* Workflow actions */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={() => onUpdate(order, primaryAction.next)}
            disabled={isUpdating}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-md transition-all disabled:cursor-wait disabled:opacity-60 cursor-pointer ${primaryAction.className}`}
          >
            {isUpdating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : fullStatus === 'CONFIRMED' ? (
              <Fire className="h-4 w-4" weight="fill" />
            ) : fullStatus === 'PREPARING' ? (
              <CheckCircle className="h-4 w-4" weight="fill" />
            ) : (
              <CheckFat className="h-4 w-4" weight="fill" />
            )}
            <span>{isUpdating ? (isHindi ? 'अपडेट हो रहा है...' : 'Updating...') : primaryAction.label}</span>
          </button>

          {recallTarget && (
            <button
              type="button"
              onClick={() => onUpdate(order, recallTarget)}
              disabled={isUpdating}
              className="mx-auto flex items-center gap-1 text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-300 disabled:opacity-50 cursor-pointer"
            >
              <ArrowCounterClockwise className="h-3 w-3" />
              {isHindi ? 'पिछले चरण में वापस' : 'Move back one step'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function KitchenBoard({ staffName }: { staffName: string }) {
  const { isHindi, translateDish } = useLanguage();
  const router = useRouter();

  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<'ALL' | ColumnStatus>('ALL');
  const [now, setNow] = useState(() => Date.now());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const seenOrderIds = useRef<Set<string>>(new Set());
  const hasLoadedOnce = useRef(false);
  const soundEnabledRef = useRef(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Keep the latest toggle available inside the polling callback.
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const ensureAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      const AudioContextCtor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return null;
      audioContextRef.current = new AudioContextCtor();
    }
    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playNewOrderChime = useCallback(() => {
    const audioContext = ensureAudioContext();
    if (!audioContext) return;

    try {
      const start = audioContext.currentTime;
      [880, 1318.5].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const at = start + index * 0.24;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.4, at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.24);
      });
    } catch {
      // Audio is a convenience; never break the board if the browser blocks it.
    }
  }, [ensureAudioContext]);

  // Unlock audio on the first user interaction (browser autoplay policy).
  useEffect(() => {
    const unlockAudio = () => ensureAudioContext();
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, [ensureAudioContext]);

  const fetchOrders = useCallback(
    async (silent = false) => {
      if (!silent) setIsRefreshing(true);
      try {
        const res = await fetch('/api/kitchen/orders', { cache: 'no-store' });

        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load kitchen orders');
        }

        const incoming: KitchenOrder[] = Array.isArray(data.orders) ? data.orders : [];

        if (hasLoadedOnce.current) {
          const newConfirmedOrders = incoming.filter(
            (order) => order.orderStatus === 'CONFIRMED' && !seenOrderIds.current.has(order.id)
          );
          if (newConfirmedOrders.length > 0 && soundEnabledRef.current) {
            playNewOrderChime();
          }
        }

        incoming.forEach((order) => seenOrderIds.current.add(order.id));
        hasLoadedOnce.current = true;

        setOrders(incoming);
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : new Date());
        setNow(Date.now());
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'Unable to reach the kitchen service'));
      } finally {
        setIsRefreshing(false);
        setIsLoading(false);
      }
    },
    [playNewOrderChime, router]
  );

  // Initial load + polling + refresh when the tab becomes visible again.
  useEffect(() => {
    const loadInitialOrders = async () => {
      await fetchOrders(true);
    };
    void loadInitialOrders();

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchOrders(true);
      }
    }, POLL_INTERVAL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchOrders(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchOrders]);

  // Keep the "x min ago" labels fresh between polls.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, []);

  const counts = useMemo(
    () => ({
      CONFIRMED: orders.filter((order) => order.orderStatus === 'CONFIRMED').length,
      PREPARING: orders.filter((order) => order.orderStatus === 'PREPARING').length,
      READY: orders.filter((order) => order.orderStatus === 'READY').length,
    }),
    [orders]
  );

  const itemsToCook = useMemo(
    () =>
      orders
        .filter((order) => order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PREPARING')
        .reduce(
          (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
          0
        ),
    [orders]
  );

  // One consolidated list of everything the kitchen still has to make.
  const cookList = useMemo(() => {
    const totals = new Map<string, number>();
    orders
      .filter((order) => order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PREPARING')
      .forEach((order) => {
        order.items.forEach((item) => {
          totals.set(item.productName, (totals.get(item.productName) ?? 0) + item.quantity);
        });
      });
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  // Show a count in the browser tab so an unattended screen still alerts staff.
  useEffect(() => {
    const baseTitle = isHindi ? 'रसोई डिस्प्ले' : 'Kitchen Display';
    document.title = counts.CONFIRMED > 0 ? `(${counts.CONFIRMED}) ${baseTitle}` : baseTitle;
  }, [counts.CONFIRMED, isHindi]);

  const handleUpdateStatus = async (order: KitchenOrder, nextStatus: KitchenTargetStatus) => {
    if (updatingId) return;
    setUpdatingId(order.id);
    try {
      const res = await fetch(`/api/kitchen/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: nextStatus }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Could not update the order');
      }

      setOrders((previous) =>
        nextStatus === 'COMPLETED'
          ? previous.filter((existing) => existing.id !== order.id)
          : previous.map((existing) =>
              existing.id === order.id ? { ...existing, orderStatus: nextStatus } : existing
            )
      );
      setErrorMessage(null);

      // Re-sync in the background so counts and other screens stay accurate.
      fetchOrders(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Could not update the order'));
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleColumns = filter === 'ALL' ? COLUMNS : COLUMNS.filter((column) => column.status === filter);
  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : '—';

  return (
    <div className="space-y-4">
      {/* Hero / queue summary */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-amber-50 sm:text-3xl">
            {isHindi ? 'आज की रसोई कतार' : 'Kitchen Queue'}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {isHindi
              ? `${staffName} • नए आर्डर अपने आप आते हैं और घंटी बजती है।`
              : `${staffName} • New orders arrive automatically with a chime.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">
              {isHindi ? 'नए' : 'New'}
            </p>
            <p className="font-display text-2xl font-bold leading-tight tabular-nums text-amber-200">
              {counts.CONFIRMED}
            </p>
          </div>
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-300/80">
              {isHindi ? 'पक रहे' : 'Cooking'}
            </p>
            <p className="font-display text-2xl font-bold leading-tight tabular-nums text-sky-200">
              {counts.PREPARING}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              {isHindi ? 'तैयार' : 'Ready'}
            </p>
            <p className="font-display text-2xl font-bold leading-tight tabular-nums text-emerald-200">
              {counts.READY}
            </p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isHindi ? 'पकाने हैं' : 'To cook'}
            </p>
            <p className="font-display text-2xl font-bold leading-tight tabular-nums text-slate-100">
              {itemsToCook}
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          <p className="font-medium">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="shrink-0 font-bold text-rose-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Consolidated cook list */}
      {cookList.length > 0 && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-3.5">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <CookingPot className="h-4 w-4 text-amber-300" weight="fill" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">
              {isHindi ? 'कुल पकाना है' : 'Total to cook'}
            </h3>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-200">
              {isHindi ? `${itemsToCook} आइटम` : `${itemsToCook} items`}
            </span>
            <span className="text-[10px] text-amber-200/50">
              {isHindi ? 'नए + पक रहे आर्डर' : 'new + cooking orders'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cookList.map(([productName, quantity]) => (
              <span
                key={productName}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-slate-950/40 px-2.5 py-1.5 text-xs font-semibold text-slate-100"
              >
                <span>{translateDish(productName)}</span>
                <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[11px] font-extrabold tabular-nums text-slate-950">
                  ×{quantity}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {isHindi ? 'सभी' : 'All'} ({orders.length})
          </button>
          {COLUMNS.map((column) => (
            <button
              key={column.status}
              type="button"
              onClick={() => setFilter(column.status)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                filter === column.status
                  ? 'bg-slate-100 text-slate-950'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${column.dotClass}`} />
              {isHindi ? column.labelHi : column.labelEn} ({counts[column.status]})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              ensureAudioContext();
              setSoundEnabled((enabled) => !enabled);
            }}
            title={isHindi ? 'नए आर्डर की घंटी' : 'Chime for new orders'}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'border-slate-700 bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? (
              <SpeakerHigh className="h-3.5 w-3.5" />
            ) : (
              <SpeakerSlash className="h-3.5 w-3.5" />
            )}
            {soundEnabled ? (isHindi ? 'आवाज़ चालू' : 'Sound on') : isHindi ? 'आवाज़ बंद' : 'Sound off'}
          </button>

          <button
            type="button"
            onClick={() => fetchOrders(false)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isHindi ? 'रिफ्रेश' : 'Refresh'}
          </button>

          <span className="hidden text-[10px] text-slate-500 sm:inline">
            {isHindi ? 'अपडेट:' : 'Updated:'} <span className="font-mono">{updatedLabel}</span>
          </span>
        </div>
      </div>

      {/* Board */}
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.status} className="space-y-3">
              <div className="h-10 animate-pulse rounded-xl bg-slate-800/70" />
              <div className="h-44 animate-pulse rounded-2xl bg-slate-900/80" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <CookingPot className="h-8 w-8" weight="fill" />
          </div>
          <p className="font-display text-xl font-semibold text-slate-100">
            {isHindi ? 'रसोई खाली है — सब हो गया!' : 'Kitchen is all caught up!'}
          </p>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            {isHindi
              ? 'नए आर्डर यहाँ अपने आप दिखेंगे और घंटी बजेगी।'
              : 'New confirmed orders will appear here automatically with a chime.'}
          </p>
        </div>
      ) : (
        <div className={`grid gap-4 ${filter === 'ALL' ? 'lg:grid-cols-3' : 'mx-auto w-full max-w-xl'}`}>
          {visibleColumns.map((column) => {
            const columnOrders = orders.filter((order) => order.orderStatus === column.status);

            return (
              <section key={column.status} className="flex min-w-0 flex-col gap-3">
                <div
                  className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${column.headerClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${column.dotClass}`} />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        {isHindi ? column.labelHi : column.labelEn}
                      </h3>
                      <p className="text-[10px] text-white/50">{isHindi ? column.hintHi : column.hintEn}</p>
                    </div>
                  </div>
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-black/25 px-2 text-sm font-bold tabular-nums text-white">
                    {columnOrders.length}
                  </span>
                </div>

                {columnOrders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-4 py-8 text-center text-[11px] text-slate-500">
                    <Hourglass className="mx-auto mb-2 h-5 w-5 text-slate-600" />
                    {isHindi ? column.emptyTextHi : column.emptyTextEn}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {columnOrders.map((order) => (
                      <KitchenOrderCard
                        key={order.id}
                        order={order}
                        now={now}
                        isHindi={isHindi}
                        translateDish={translateDish}
                        isUpdating={updatingId === order.id}
                        onUpdate={handleUpdateStatus}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 pb-2 text-[10px] text-slate-600">
        <BellRinging className="h-3 w-3" />
        <span>
          {isHindi
            ? 'हर 10 सेकंड में अपने आप रिफ्रेश होता है'
            : 'Auto-refreshes every 10 seconds'}
        </span>
      </div>
    </div>
  );
}
