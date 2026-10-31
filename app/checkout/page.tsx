'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, Banknote, ShieldCheck, AlertCircle, UtensilsCrossed, FlaskConical } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPaise } from '@/lib/utils';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, subtotal, tax, total, tableNumber, setTableNumber } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_RAZORPAY' | 'CASH' | 'TEST'>('ONLINE_RAZORPAY');
  const [tableInput, setTableInput] = useState(tableNumber || 'Table 1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h2 className="font-bold text-xl text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Explore our menu and add authentic samosas, kachoris, tea, and sweets to your order.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm shadow-emerald-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Digital Menu</span>
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for order receipt.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit cart to backend for server-side validation & order creation
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessSlug: 'vrindavan-sweets',
          tableNumber: tableInput,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          paymentMethod,
          notes: notes.trim(),
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const orderId = orderData.orderId;

      // 2. If Cash on Counter payment:
      if (paymentMethod === 'CASH') {
        clearCart();
        router.push(`/order/${orderId}?status=confirmed&method=cash`);
        return;
      }

      if (paymentMethod === 'TEST') {
        const testRes = await fetch('/api/payments/test/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });
        const testData = await testRes.json();
        if (!testRes.ok || !testData.success) {
          throw new Error(testData.error || 'Failed to complete test payment');
        }
        clearCart();
        router.push(`/receipt/${orderId}`);
        return;
      }

      // 3. If Online Razorpay payment:
      const rzpRes = await fetch('/api/payments/razorpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok || !rzpData.success) {
        throw new Error(rzpData.error || 'Failed to initialize payment gateway');
      }

      // Check if Razorpay checkout script is loaded
      if (typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: rzpData.keyId,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: rzpData.businessName,
          description: `Order ${rzpData.orderNumber}`,
          order_id: rzpData.razorpayOrderId.startsWith('order_dev_') ? undefined : rzpData.razorpayOrderId,
          prefill: {
            name: customerName,
            contact: customerPhone,
          },
          theme: {
            color: '#059669',
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/payments/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id || rzpData.razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
                  razorpaySignature: response.razorpay_signature || 'seed_signature_verified',
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                clearCart();
                router.push(`/receipt/${orderId}`);
              } else {
                setErrorMessage(verifyData.error || 'Payment verification failed');
              }
            } catch (err: any) {
              setErrorMessage(err.message || 'Error verifying payment signature');
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const rzpInstance = new window.Razorpay(options);
        rzpInstance.open();
      } else {
        // Fallback for development/testing if checkout script is unavailable
        clearCart();
        router.push(`/order/${orderId}?status=confirmed&method=online`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/menu" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
          <h1 className="font-bold text-sm text-slate-900">Review Order & Pay</h1>
          <span className="text-xs text-slate-400 font-medium">{items.length} items</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {errorMessage && (
          <Alert variant="destructive" className="mb-4 flex items-start gap-2.5 p-3.5 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </Alert>
        )}

        <form onSubmit={handleCheckout} className="space-y-6">
          {/* 1. Itemized Cart Summary */}
          <Card className="checkout-panel space-y-4 p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Order Summary</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-[11px] text-slate-400 hover:text-rose-600 font-medium"
              >
                Clear all
              </Button>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.productId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UtensilsCrossed className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">
                        {formatPaise(item.price)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-slate-200 rounded-l-lg text-slate-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-slate-200 rounded-r-lg text-slate-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <span className="font-bold text-sm text-slate-900 w-16 text-right">
                      {formatPaise(item.price * item.quantity)}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">{formatPaise(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-medium text-slate-800">{formatPaise(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-base text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-600">{formatPaise(total)}</span>
              </div>
            </div>
          </Card>

          {/* 2. Customer & Table Details */}
          <Card className="checkout-panel space-y-4 p-5">
            <CardTitle className="text-sm">Dine-In Details</CardTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <Label htmlFor="table-number" className="mb-1 block text-xs font-semibold text-slate-700">
                  Table Number
                </Label>
                <div className="relative">
                  <UtensilsCrossed className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="table-number"
                    type="text"
                    required
                    value={tableInput}
                    onChange={(e) => setTableInput(e.target.value)}
                    placeholder="e.g. Table 1, T-04"
                    className="payment-input h-10 rounded-xl bg-slate-50 pl-9 pr-3 text-xs focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customer-name" className="mb-1 block text-xs font-semibold text-slate-700">
                  Customer Name *
                </Label>
                <Input
                  id="customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="payment-input h-10 rounded-xl bg-slate-50 text-xs focus-visible:ring-emerald-500"
                />
              </div>

              <div>
                <Label htmlFor="customer-phone" className="mb-1 block text-xs font-semibold text-slate-700">
                  Mobile Number (for receipt) *
                </Label>
                <Input
                  id="customer-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="payment-input h-10 rounded-xl bg-slate-50 text-xs focus-visible:ring-emerald-500"
                />
              </div>

              <div>
                <Label htmlFor="cooking-notes" className="mb-1 block text-xs font-semibold text-slate-700">
                  Cooking Notes / Special Requests
                </Label>
                <Input
                  id="cooking-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Less spicy, extra chutney"
                  className="payment-input h-10 rounded-xl bg-slate-50 text-xs focus-visible:ring-emerald-500"
                />
              </div>
            </div>
          </Card>

          {/* 3. Payment Method Choice */}
          <Card className="checkout-panel space-y-3 p-5">
            <CardTitle className="text-sm">Select Payment Method</CardTitle>

            <RadioGroup className="sm:grid-cols-2" aria-label="Select payment method">
              {/* Online Razorpay */}
              <label
                data-selected={paymentMethod === 'ONLINE_RAZORPAY'}
                className={`payment-method-card p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'ONLINE_RAZORPAY'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs">UPI / Cards / NetBanking</p>
                    <p className="text-[11px] text-slate-500">Fast & instant digital receipt</p>
                  </div>
                </div>
                <RadioGroupItem
                  name="paymentMethod"
                  value="ONLINE_RAZORPAY"
                  checked={paymentMethod === 'ONLINE_RAZORPAY'}
                  onChange={() => setPaymentMethod('ONLINE_RAZORPAY')}
                  className="accent-emerald-700"
                />
              </label>

              {/* Cash on Counter */}
              <label
                data-selected={paymentMethod === 'CASH'}
                className={`payment-method-card p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs">Cash at Counter</p>
                    <p className="text-[11px] text-slate-500">Pay cash directly to cashier</p>
                  </div>
                </div>
                <RadioGroupItem
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={() => setPaymentMethod('CASH')}
                  className="accent-emerald-700"
                />
              </label>
            {process.env.NODE_ENV !== 'production' && (
              <label
                data-selected={paymentMethod === 'TEST'}
                className={`payment-method-card p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'TEST'
                    ? 'border-sky-600 bg-sky-50 text-sky-950 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-100 text-sky-700"><FlaskConical className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-xs">Test Payment</p>
                    <p className="text-[11px] text-slate-500">Simulate a successful payment (no charge)</p>
                  </div>
                </div>
                <RadioGroupItem
                  name="paymentMethod"
                  value="TEST"
                  checked={paymentMethod === 'TEST'}
                  onChange={() => setPaymentMethod('TEST')}
                  className="accent-sky-700"
                />
              </label>
            )}
            </RadioGroup>

            {paymentMethod === 'ONLINE_RAZORPAY' && <Alert className="border-sky-200 bg-sky-50 p-3.5 text-xs text-sky-900">
              <p className="font-semibold">Testing a payment?</p>
              <p className="mt-1 text-sky-800">
                Configure Razorpay Test Mode API keys to run a sandbox checkout. Use the test card or UPI details from the{' '}
                <a
                  href="https://razorpay.com/docs/server-integration/python/test-app/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline underline-offset-2"
                >
                  Razorpay test guide
                </a>
                . Test transactions do not collect real money.
              </p>
            </Alert>}
          </Card>

          {/* Place Order CTA Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="neon-checkout-button w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-emerald-200 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing Order...</span>
              </span>
            ) : (
              <span>
                {paymentMethod === 'TEST'
                  ? `Run Test Payment (${formatPaise(total)})`
                  : paymentMethod === 'ONLINE_RAZORPAY'
                  ? `Pay ${formatPaise(total)} via UPI/Card`
                  : `Confirm Cash Order (${formatPaise(total)})`}
              </span>
            )}
          </Button>

          <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-bit encrypted checkout • Zero hidden charges</span>
          </p>
        </form>
      </div>
    </div>
  );
}
