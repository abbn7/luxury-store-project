'use client';
import { useState, useEffect } from 'react';

const EMPTY = { name: '', description: '', price: '', old_price: '', image: '', stock: '' };

export default function AdminModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        old_price: product.old_price || '',
        image: product.image || '',
        stock: product.stock ?? '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: parseFloat(form.price) || 0,
        old_price: form.old_price ? parseFloat(form.old_price) : null,
        stock: parseInt(form.stock) || 0,
      });
      onClose();
    } catch (err) {
      alert('حدث خطأ: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl text-charcoal dark:text-white">
            {product ? 'تعديل المنتج' : 'إضافة منتج'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="gold-divider mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'اسم المنتج', key: 'name', type: 'text', required: true, placeholder: 'مثال: حقيبة جلدية فاخرة' },
            { label: 'السعر (ر.س)', key: 'price', type: 'number', required: true, placeholder: '0.00' },
            { label: 'السعر القديم (اختياري)', key: 'old_price', type: 'number', placeholder: '0.00' },
            { label: 'المخزون', key: 'stock', type: 'number', required: true, placeholder: '0' },
            { label: 'رابط الصورة', key: 'image', type: 'url', placeholder: 'https://...' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-body text-muted dark:text-gray-400 mb-1.5 font-medium">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                required={f.required}
                placeholder={f.placeholder}
                step={f.type === 'number' ? 'any' : undefined}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-charcoal dark:text-white text-sm font-body input-luxury transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-body text-muted dark:text-gray-400 mb-1.5 font-medium">الوصف</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="وصف مختصر للمنتج..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-charcoal dark:text-white text-sm font-body input-luxury transition-all resize-none"
            />
          </div>

          {/* Preview image */}
          {form.image && (
            <div className="rounded-xl overflow-hidden h-32 bg-gray-100 dark:bg-gray-800">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl btn-gold text-charcoal font-body font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'جاري الحفظ...' : product ? 'حفظ التعديلات' : 'إضافة المنتج'}
          </button>
        </form>
      </div>
    </div>
  );
}
