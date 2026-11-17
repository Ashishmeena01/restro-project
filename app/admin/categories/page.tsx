'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tags, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminCategoriesPage() {
  const { isHindi, translateCategory } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setSortOrder('0');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setSortOrder(String(cat.sortOrder));
    setError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        sortOrder: parseInt(sortOrder) || 0,
      };

      if (editingCategory) {
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to update category');
        }
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? data.category : c))
        );
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create category');
        }
        setCategories((prev) => [...prev, data.category]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error saving category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmMsg = isHindi
      ? 'क्या आप वाकई इस श्रेणी को हटाना चाहते हैं?'
      : 'Are you sure you want to delete this category?';
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isHindi ? 'श्रेणी प्रबंधन (Menu Categories)' : 'Category Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isHindi
              ? 'डिजिटल मेनू अनुभागों, क्रम और व्यंजन समूहों को व्यवस्थित करें।'
              : 'Organize digital menu sections, sort sequences, and dish groupings.'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isHindi ? 'नई श्रेणी जोड़ें' : 'Add New Category'}</span>
        </button>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          {isHindi ? 'श्रेणियाँ लोड हो रही हैं...' : 'Loading categories...'}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Tags className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-sm text-slate-800">
            {isHindi ? 'कोई श्रेणी नहीं मिली' : 'No categories found'}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-3 text-xs text-emerald-600 font-semibold underline cursor-pointer"
          >
            {isHindi ? 'पहली श्रेणी बनाएं' : 'Create first category'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">{isHindi ? 'श्रेणी का नाम' : 'Category Name'}</th>
                <th className="px-5 py-3">{isHindi ? 'यूआरएल स्लग' : 'URL Slug'}</th>
                <th className="px-5 py-3">{isHindi ? 'प्रदर्शन क्रम' : 'Display Order'}</th>
                <th className="px-5 py-3">{isHindi ? 'व्यंजन संख्या' : 'Products'}</th>
                <th className="px-5 py-3 text-right">{isHindi ? 'क्रियाएं' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900 text-sm">
                      {translateCategory(cat.name)}
                    </p>
                    {cat.description && (
                      <p className="text-slate-400 text-[11px] line-clamp-1">{cat.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px]">
                    {cat.slug}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">
                    {cat.sortOrder}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                      {cat._count?.products || 0} {isHindi ? 'व्यंजन' : 'items'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-slate-900">
                {editingCategory
                  ? isHindi
                    ? 'श्रेणी संपादित करें'
                    : 'Edit Category'
                  : isHindi
                  ? 'नई श्रेणी बनाएं'
                  : 'Create Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'श्रेणी का नाम *' : 'Category Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={isHindi ? 'उदा. स्नैक्स और चाट, मिठाइयाँ' : 'e.g. Snacks & Chaat, Sweets'}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'स्लग (Slug) *' : 'URL Slug *'}
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="snacks-chaat"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'विवरण (Description)' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isHindi ? 'श्रेणी की विशेषताएं...' : 'Category description for customers...'}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHindi ? 'प्रदर्शन क्रम (Sort Order)' : 'Sort Order'}
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isHindi ? 'कम संख्या वाले मेनू में पहले दिखेंगे' : 'Lower numbers appear first on the menu'}
                </p>
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
                    : editingCategory
                    ? isHindi
                      ? 'अपडेट करें'
                      : 'Update Category'
                    : isHindi
                    ? 'श्रेणी बनाएं'
                    : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
