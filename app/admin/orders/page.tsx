'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  ReceiptText,
  UtensilsCrossed,
  RefreshCw,
  Phone,
  Banknote,
  Check,
} from 'lucide-react';
import { formatPaise, formatDate } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.set('status', statusFilter);
      if (searchQuery.trim()) query.set('search', searchQuery.trim());
      if (dateFilter) query.set('date', dateFilter);

      const res = await fetch(`/api/admin/orders?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmCash = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/confirm-cash`, {
        method: 'POST',
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, paymentStatus: 'SUCCESS', orderStatus: 'CONFIRMED' }
              : o
          )
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time kitchen order dispatch, table status, and payment reconciliation.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </form>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-50 px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-700"
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List / Table */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-800">No orders found</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting your date or status filters</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => {
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {order.table?.tableNumber || 'Takeaway'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(order.createdAt, true)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/receipt/${order.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      <ReceiptText className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </Link>

                    {/* Cash confirmation button if cash & pending */}
                    {order.paymentMethod === 'CASH' && order.paymentStatus === 'PENDING' && (
                      <button
                        onClick={() => handleConfirmCash(order.id)}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        <Banknote className="w-3.5 h-3.5" />
                        <span>Collect Cash ({formatPaise(order.total)})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items & Customer Body */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Left: Ordered Dishes */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <p className="font-semibold text-slate-400 text-[10px] uppercase">
                      Ordered Dishes ({order.items?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((it: any) => (
                        <span
                          key={it.id}
                          className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-medium text-slate-800"
                        >
                          <span>{it.productName}</span>
                          <span className="font-bold text-emerald-700">×{it.quantity}</span>
                          <span className="text-slate-400">({formatPaise(it.totalPrice)})</span>
                        </span>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="text-[11px] text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-200 mt-2">
                        <strong>Kitchen Note:</strong> {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Customer & Financials */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer:</span>
                      <span className="font-semibold text-slate-800">{order.customerName || 'Walk-in'}</span>
                    </div>
                    {order.customerPhone && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span className="font-mono text-slate-700">{order.customerPhone}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                      <span>Total:</span>
                      <span className="text-emerald-700">{formatPaise(order.total)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Payment:</span>
                      <span className="capitalize font-semibold text-slate-700">
                        {order.paymentMethod === 'ONLINE_RAZORPAY' ? 'Razorpay Online' : order.paymentMethod === 'TEST' ? 'Test Payment' : 'Cash on Counter'} (
                        {order.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer status changer */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">Update Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={isUpdating}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="PENDING_PAYMENT">Pending Payment</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="READY">Ready</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      order.orderStatus === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-800'
                        : order.orderStatus === 'CANCELLED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : order.orderStatus === 'PREPARING'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Current: {order.orderStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
