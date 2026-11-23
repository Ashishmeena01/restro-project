'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  MagnifyingGlass as Search,
  PencilSimple as Edit2,
  Trash as Trash2,
  Check,
  X,
  WarningCircle as AlertCircle,
  ForkKnife as UtensilsCrossed,
} from '@phosphor-icons/react';
import { formatPaise, rupeesToPaise } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminProductsPage() {
  const { isHindi, translateDish, translateCategory } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPriceRupees, setFormPriceRupees] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.id || '');
    setFormPriceRupees('');
    setFormDescription('');
    setFormImageUrl('');
    setFormIsVeg(true);
    setFormIsAvailable(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.categoryId);
    setFormPriceRupees(String(product.price / 100));
    setFormDescription(product.description || '');
    setFormImageUrl(product.imageUrl || '');
    setFormIsVeg(product.isVeg);
    setFormIsAvailable(product.isAvailable);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (productId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isAvailable: newStatus } : p))
    );

    try {
      await fetch(`/api/admin/products/${productId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
    } catch (e) {
      // Revert if error
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isAvailable: currentStatus } : p))
      );
    }
  };

  const handleDelete = async (productId: string) => {
    const confirmMsg = isHindi
      ? 'क्या आप वाकई इस व्यंजन को हटाना चाहते हैं? पिछले आर्डर का रिकॉर्ड सुरक्षित रहेगा।'
      : 'Are you sure you want to delete this product? Historical orders will remain preserved.';
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const priceRupeesNum = parseFloat(formPriceRupees);
    if (isNaN(priceRupeesNum) || priceRupeesNum <= 0) {
      setFormError(
        isHindi
          ? 'कृपया रुपये में वैध मूल्य दर्ज करें (उदा. ₹15 के लिए 15)।'
          : 'Please enter a valid price in Rupees (e.g. 15 for ₹15).'
      );
      return;
    }

    const priceInPaise = rupeesToPaise(priceRupeesNum);

    setIsSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        categoryId: formCategory,
        price: priceInPaise,
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim(),
        isVeg: formIsVeg,
        isAvailable: formIsAvailable,
      };

      if (editingProduct) {
        // Edit existing
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to update product');
        }
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data.product : p))
        );
      } else {
        // Create new
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create product');
        }
        setProducts((prev) => [data.product, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.categoryId === selectedCategory;

      if (!matchesCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const engName = p.name.toLowerCase();
        const hiName = translateDish(p.name).toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return engName.includes(q) || hiName.includes(q) || desc.includes(q);
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, translateDish]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            {isHindi ? 'व्यंजन प्रबंधन (Menu Items)' : 'Product Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isHindi
              ? 'व्यंजन जोड़ें, मूल्य अपडेट करें, फ़ोटो बदलें और तुरंत उपलब्धता नियंत्रित करें।'
              : 'Create, update pricing, upload images, and control instant menu availability.'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isHindi ? 'नया व्यंजन जोड़ें' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isHindi ? 'व्यंजन के नाम या विवरण से खोजें...' : 'Search products by name or description...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-700"
          >
            <option value="all">{isHindi ? 'सभी श्रेणियाँ' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {translateCategory(c.name)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          {isHindi ? 'व्यंजन लोड हो रहे हैं...' : 'Loading products...'}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-sm text-slate-800">
            {isHindi ? 'कोई व्यंजन नहीं मिला' : 'No dishes match your filter'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isHindi ? 'अन्य खोज प्रयास करें या नया व्यंजन जोड़ें' : 'Try another search or click Add New Product'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">{isHindi ? 'व्यंजन का नाम' : 'Product Name'}</th>
                  <th className="px-5 py-3">{isHindi ? 'श्रेणी' : 'Category'}</th>
                  <th className="px-5 py-3">{isHindi ? 'मूल्य' : 'Price'}</th>
                  <th className="px-5 py-3">{isHindi ? 'प्रकार' : 'Dietary'}</th>
                  <th className="px-5 py-3">{isHindi ? 'उपलब्धता' : 'Instant Availability'}</th>
                  <th className="px-5 py-3 text-right">{isHindi ? 'क्रियाएं' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {prod.imageUrl ? (
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
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
                          <p className="font-bold text-slate-900 text-sm">
                            {translateDish(prod.name)}
                          </p>
                          {prod.description && (
                            <p className="text-slate-400 line-clamp-1 text-[11px] max-w-xs">{prod.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                        {translateCategory(prod.category?.name || 'Unassigned')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-700 text-sm">
                      {formatPaise(prod.price)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        {isHindi ? '100% शाकाहारी' : 'Pure Veg'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleAvailability(prod.id, prod.isAvailable)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          prod.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {prod.isAvailable ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isHindi ? 'उपलब्ध' : 'Available'}</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 text-rose-600" />
                            <span>{isHindi ? 'समाप्त (Sold Out)' : 'Sold Out'}</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-900">
                {editingProduct
                  ? isHindi
                    ? 'व्यंजन संपादित करें'
                    : 'Edit Product'
                  : isHindi
                  ? 'नया व्यंजन जोड़ें'
                  : 'Add New Dish'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <p>{formError}</p>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'व्यंजन का नाम *' : 'Product Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={isHindi ? 'उदा. समोसा, कचौरी, चाय, पोहा' : 'e.g. Samosa, Kachori, Tea, Poha'}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isHindi ? 'श्रेणी *' : 'Category *'}
                  </label>
                  <select
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {translateCategory(c.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isHindi ? 'मूल्य (रुपये में ₹) *' : 'Price in Indian Rupees (₹) *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formPriceRupees}
                      onChange={(e) => setFormPriceRupees(e.target.value)}
                      placeholder="15"
                      className="w-full bg-slate-50 pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold text-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isHindi ? 'डेटाबेस में पैसे के रूप में सुरक्षित' : 'Stored as integer paise'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'विवरण (Description)' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={isHindi ? 'सामग्री, मसाले और विशेषता...' : 'Fresh ingredients, spices, and preparation notes...'}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'फ़ोटो URL (वैकल्पिक)' : 'Image URL (Optional)'}
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsVeg}
                    onChange={(e) => setFormIsVeg(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">
                    {isHindi ? '100% शुद्ध शाकाहारी' : '100% Pure Vegetarian'}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsAvailable}
                    onChange={(e) => setFormIsAvailable(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">
                    {isHindi ? 'लाइव मेनू में उपलब्ध' : 'Available on Live Menu'}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving
                    ? isHindi
                      ? 'सहेजा जा रहा है...'
                      : 'Saving...'
                    : editingProduct
                    ? isHindi
                      ? 'परिवर्तन सहेजें'
                      : 'Save Changes'
                    : isHindi
                    ? 'व्यंजन बनाएं'
                    : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
