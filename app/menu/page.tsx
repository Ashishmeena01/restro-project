'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingBag, Plus, Minus, UtensilsCrossed, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPaise } from '@/lib/utils';

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  categoryId: string;
}

interface CategoryWithProducts {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  products: ProductItem[];
}

function MenuContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table');
  const { items, addItem, updateQuantity, totalItems, subtotal, tableNumber, setTableNumber } = useCart();

  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [businessName, setBusinessName] = useState<string>('Vrindavan Pure Veg Sweets & Café');

  // Sync table parameter from QR code URL if present
  useEffect(() => {
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [tableParam, setTableNumber]);

  // Fetch live menu
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          if (data.business?.name) setBusinessName(data.business.name);
        }
      } catch (e) {
        console.error('Failed to load menu:', e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Filtered products
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        let prods = cat.products.filter((p) => p.isAvailable);

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          prods = prods.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              (p.description && p.description.toLowerCase().includes(query))
          );
        }

        return {
          ...cat,
          products: prods,
        };
      })
      .filter((cat) => {
        if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
        return cat.products.length > 0;
      });
  }, [categories, selectedCategory, searchQuery]);

  const getItemQuantityInCart = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                V
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base leading-tight text-slate-900">
                  {businessName}
                </h1>
                <p className="text-[11px] text-emerald-700 font-medium">Digital Dine-In Menu</p>
              </div>
            </Link>

            {/* Table Badge */}
            {(tableParam || tableNumber) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tableParam || tableNumber}</span>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search samosa, kachori, tea, sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white pl-10 pr-4 py-2 rounded-xl text-sm border border-transparent focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Horizontal Category Pill Tabs */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Delicacies
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Menu Feed */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs">Preparing fresh menu...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No dishes found</p>
            <p className="text-xs text-slate-400 mt-1">Try another search or select a different category</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((cat) => (
              <section key={cat.id} className="space-y-3">
                <div className="border-b border-slate-200/80 pb-2">
                  <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <span>{cat.name}</span>
                    <span className="text-xs text-slate-400 font-normal">({cat.products.length})</span>
                  </h2>
                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {cat.products.map((product) => {
                    const cartQty = getItemQuantityInCart(product.id);
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex gap-3 hover:border-emerald-200 transition-all"
                      >
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1.5 gap-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                Veg
                              </span>
                              <span className="font-bold text-base text-slate-900 shrink-0">
                                {formatPaise(product.price)}
                              </span>
                            </div>

                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {cartQty > 0 ? `${cartQty} in cart` : 'Hot & Fresh'}
                            </span>

                            {cartQty === 0 ? (
                              <button
                                onClick={() => addItem(product)}
                                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-200 hover:border-emerald-600 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </button>
                            ) : (
                              <div className="inline-flex items-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-200">
                                <button
                                  onClick={() => updateQuantity(product.id, cartQty - 1)}
                                  className="p-1.5 hover:bg-emerald-700 rounded-l-xl transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2.5 text-xs font-bold">{cartQty}</span>
                                <button
                                  onClick={() => updateQuantity(product.id, cartQty + 1)}
                                  className="p-1.5 hover:bg-emerald-700 rounded-r-xl transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div
                            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 ${
                              product.imageUrl ? 'hidden' : ''
                            }`}
                          >
                            <UtensilsCrossed className="w-8 h-8 text-emerald-300" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Floating Sticky Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto">
          <Link
            href="/checkout"
            className="flex items-center justify-between bg-slate-900 hover:bg-black text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                {totalItems}
              </div>
              <div>
                <p className="text-xs text-slate-300">Total payable</p>
                <p className="font-bold text-base leading-tight text-white">
                  {formatPaise(subtotal + Math.round((subtotal * 5) / 100))}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
          Loading Vrindavan Menu...
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
