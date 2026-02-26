'use client';
import { useState, useEffect, useRef } from 'react';
import { uploadProductImage } from '@/lib/supabase';

const EMPTY = { name: '', description: '', price: '', old_price: '', stock: '' };

export default function AdminModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);       // array of URLs
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imgTab, setImgTab] = useState('url');    // 'url' | 'upload'
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        old_price: product.old_price || '',
        stock: product.stock ?? '',
      });
      // load existing images
      let imgs = [];
      try { imgs = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]'); } catch {}
      if (!imgs.length && product.image) imgs = [product.image];
      setImages(imgs);
    } else {
      setForm(EMPTY);
      setImages([]);
    }
    setUrlInput('');
  }, [product]);

  /* ── Add URL image ── */
  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    setImages((p) => [...p, url]);
    setUrlInput('');
  };

  /* ── Upload file(s) ── */
  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadProductImage(f))
      );
      setImages((p) => [...p, ...urls]);
    } catch (err) {
      alert('فشل رفع الصورة: ' + err.message + '\n\nتأكد من إنشاء Storage bucket اسمه "products" في Supabase.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImg = (i) => setImages((p) => p.filter((_, idx) => idx !== i));
  const moveImg = (from, to) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setImages(arr);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: parseFloat(form.price) || 0,
        old_price: form.old_price ? parseFloat(form.old_price) : null,
        stock: parseInt(form.stock) || 0,
        image: images[0] || null,
        images: JSON.stringify(images),
      });
      onClose();
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 animate-fade-in" style={{ backdropFilter: 'blur(6px)' }} />

      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl animate-scale-in overflow-hidden"
        style={{
          background: 'var(--bg-modal, #fff)',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 card-mesh">
          <div className="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 sm:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #a87e2a)' }}>
                {product
                  ? <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  : <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                }
              </div>
              <h2 className="font-display font-semibold text-xl text-[#111827] dark:text-white">
                {product ? 'تعديل المنتج' : 'إضافة منتج'}
              </h2>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 bg-white dark:bg-[#111111]">
          {/* Name */}
          <div>
            <label className="block text-xs font-body font-semibold text-[#111827] dark:text-white mb-2">
              اسم المنتج <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثال: حقيبة جلدية فاخرة"
              className="input-field"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-body font-semibold text-[#111827] dark:text-white mb-2">الوصف</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="وصف مختصر للمنتج..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-body font-semibold text-[#111827] dark:text-white mb-2">
                السعر (ج.م) <span className="text-red-500">*</span>
              </label>
              <input
                type="number" required step="any" min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-body font-semibold text-[#111827] dark:text-white mb-2">
                السعر قبل الخصم
              </label>
              <input
                type="number" step="any" min="0"
                value={form.old_price}
                onChange={(e) => setForm({ ...form, old_price: e.target.value })}
                placeholder="0.00"
                className="input-field"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-body font-semibold text-[#111827] dark:text-white mb-2">
              الكمية المتاحة <span className="text-red-500">*</span>
            </label>
            <input
              type="number" required min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="0"
              className="input-field"
            />
          </div>

          {/* ─── Images section ─── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-body font-semibold text-[#111827] dark:text-white">
                صور المنتج
                <span className="mr-1.5 font-normal text-[#6B7280]">({images.length} صورة)</span>
              </label>
              {/* Tab toggle */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
                {[
                  { id: 'url', label: 'رابط' },
                  { id: 'upload', label: 'رفع ملف' },
                ].map((t) => (
                  <button key={t.id} type="button" onClick={() => setImgTab(t.id)}
                    className="px-3 py-1.5 text-xs font-body font-medium transition-all duration-200"
                    style={{
                      background: imgTab === t.id ? '#111827' : 'transparent',
                      color: imgTab === t.id ? '#fff' : '#6B7280',
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* URL input */}
            {imgTab === 'url' && (
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
                  placeholder="https://example.com/image.jpg"
                  className="input-field flex-1"
                />
                <button type="button" onClick={addUrl}
                  className="btn-gold px-4 rounded-xl text-sm flex-shrink-0">
                  إضافة
                </button>
              </div>
            )}

            {/* File upload */}
            {imgTab === 'upload' && (
              <div className="mb-3">
                <label
                  className="flex flex-col items-center justify-center w-full h-28 rounded-2xl cursor-pointer transition-all duration-200 hover:border-[#C9A84C]"
                  style={{
                    border: '2px dashed rgba(0,0,0,0.15)',
                    background: 'rgba(201,168,76,0.03)',
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                >
                  {uploading ? (
                    <div className="flex items-center gap-2 text-[#C9A84C]">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      <span className="text-sm font-body">جاري الرفع...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[#9CA3AF] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                      </svg>
                      <span className="text-sm font-body text-[#6B7280]">اسحب الصور هنا أو</span>
                      <span className="text-xs font-body text-[#C9A84C] mt-0.5">انقر للاختيار</span>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
                <p className="text-[11px] font-body text-[#9CA3AF] mt-1.5 text-center">
                  يتطلب إنشاء Storage bucket اسمه "products" في Supabase
                </p>
              </div>
            )}

            {/* Image previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: '1' }}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {/* Position badge */}
                    {i === 0 && (
                      <span className="absolute top-1 right-1 badge-gold text-[10px] px-1.5 py-0.5" style={{ fontSize: '9px' }}>
                        رئيسية
                      </span>
                    )}
                    {/* Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {i > 0 && (
                        <button type="button" onClick={() => moveImg(i, i - 1)}
                          className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center text-[#111827] hover:bg-white transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      )}
                      <button type="button" onClick={() => removeImg(i)}
                        className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                      {i < images.length - 1 && (
                        <button type="button" onClick={() => moveImg(i, i + 1)}
                          className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center text-[#111827] hover:bg-white transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {/* Add more */}
                <label
                  className="rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#C9A84C]"
                  style={{ aspectRatio: '1', border: '1.5px dashed rgba(0,0,0,0.12)', background: 'transparent' }}
                >
                  <svg className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => { setImgTab('upload'); handleFiles(e.target.files); }} />
                </label>
              </div>
            )}
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full py-3.5 rounded-2xl text-sm btn-gold disabled:opacity-50"
          >
            {saving
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  جاري الحفظ...
                </span>
              : product ? 'حفظ التعديلات' : 'إضافة المنتج'
            }
          </button>
        </form>
      </div>
    </div>
  );
}
