'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, Minus, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPaise } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { VegMark } from '@/components/ui/VegMark';

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
  const { t, isHindi, translateDish, translateCategory, translateDescription } = useLanguage();

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

  // Filtered products supporting both Hindi & English searches
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        let prods = cat.products.filter((p) => p.isAvailable);

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          prods = prods.filter((p) => {
            const engName = p.name.toLowerCase();
            const hindiName = translateDish(p.name).toLowerCase();
            const engDesc = (p.description || '').toLowerCase();
            const hindiDesc = translateDescription(p.description).toLowerCase();
            return (
              engName.includes(query) ||
              hindiName.includes(query) ||
              engDesc.includes(query) ||
              hindiDesc.includes(query)
            );
          });
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
  }, [categories, selectedCategory, searchQuery, translateDish, translateDescription]);

  const getItemQuantityInCart = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const displayName = isHindi ? t('brand.name') : businessName;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 shadow-sm">
        <div className="bg-slate-950 text-amber-50 border-b border-amber-500/20">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full border-2 border-amber-400 text-amber-300 flex items-center justify-center font-display text-lg shrink-0">
                व
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-sm sm:text-lg leading-tight truncate">{displayName}</h1>
                <p className="text-[10px] sm:text-[11px] text-amber-400/90 tracking-wide">
                  {t('menu.header_title')}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <LanguageSwitcher variant="dark" />
              {(tableParam || tableNumber) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-semibold">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>
                    {t('menu.table')} {tableParam || tableNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-4 py-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('menu.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Horizontal Category Tabs */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {[{ id: 'all', label: t('menu.all_categories') }, ...categories.map((cat) => ({ id: cat.id, label: translateCategory(cat.name) }))].map(
                ({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCategory(id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-all cursor-pointer ${
                      selectedCategory === id
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu Feed */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-medium">{t('menu.loading')}</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <p className="font-display text-lg text-slate-700">{t('menu.no_dishes')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('menu.try_another')}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCategories.map((cat) => (
              <section key={cat.id} className="space-y-5">
                <div className="text-center">
                  <h2 className="ornament font-display text-2xl sm:text-3xl text-slate-900">
                    <span>{translateCategory(cat.name)}</span>
                  </h2>
                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-1.5 italic">{cat.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {cat.products.map((product) => {
                    const cartQty = getItemQuantityInCart(product.id);
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex gap-4 hover:shadow-md hover:border-emerald-200 transition-all"
                      >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
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
                            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-100 ${
                              product.imageUrl ? 'hidden' : ''
                            }`}
                          >
                            <UtensilsCrossed className="w-8 h-8 text-emerald-300" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-baseline gap-2">
                              {product.isVeg && <VegMark className="self-center" label={t('menu.veg')} />}
                              <h3 className="font-display text-base sm:text-xl text-slate-900 leading-snug">
                                {translateDish(product.name)}
                              </h3>
                              <span className="flex-1 border-b-2 border-dotted border-slate-300 translate-y-[-4px] min-w-4 hidden sm:block" />
                              <span className="font-display text-base sm:text-xl text-emerald-700 shrink-0 ml-auto sm:ml-0">
                                {formatPaise(product.price)}
                              </span>
                            </div>
                            {product.description && (
                              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                                {translateDescription(product.description)}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-amber-700 font-medium italic">
                              {cartQty > 0 ? `${cartQty} ${t('menu.in_cart')}` : t('menu.hot_fresh')}
                            </span>

                            {cartQty === 0 ? (
                              <button
                                onClick={() => addItem(product)}
                                className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-600 text-emerald-700 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-emerald-600 transition-all cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{t('menu.add_btn')}</span>
                              </button>
                            ) : (
                              <div className="inline-flex items-center rounded-full bg-emerald-600 text-white shadow-sm shadow-emerald-200">
                                <button
                                  onClick={() => updateQuantity(product.id, cartQty - 1)}
                                  className="p-1.5 pl-2.5 hover:bg-emerald-700 rounded-l-full transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2.5 text-xs font-bold">{cartQty}</span>
                                <button
                                  onClick={() => updateQuantity(product.id, cartQty + 1)}
                                  className="p-1.5 pr-2.5 hover:bg-emerald-700 rounded-r-full transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
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
            className="flex items-center justify-between bg-slate-950 hover:bg-slate-900 text-white px-5 py-3.5 rounded-full shadow-xl shadow-slate-900/30 border border-amber-500/30 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {totalItems}
              </div>
              <div>
                <p className="text-[11px] text-amber-100/70">{t('menu.total_payable')}</p>
                <p className="font-display text-lg leading-tight text-amber-50">
                  {formatPaise(subtotal + Math.round((subtotal * 5) / 100))}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <span>{t('menu.view_cart')}</span>
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
