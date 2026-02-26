'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

let toastTimeout;

export default function ProductCard({ product, isAdmin, onEdit, onDelete, index = 0 }) {
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  const images = (() => {
    try { return Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]'); }
    catch { return []; }
  })();
  const mainImg = images[0] || product.image || null;

  const discount = product.old_price > 0 && product.old_price > product.price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null;

  const addToCart = (e) => {
    e.preventDefault();
    if (adding || product.stock === 0) return;
    setAdding(true);
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const ex = cart.find((i) => i.id === product.id);
      if (ex) ex.quantity += 1;
      else cart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdate'));
      setAdding(false);
      setDone(true);
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => setDone(false), 2000);
    }, 320);
  };

  return (
    <div
      className="product-card opacity-0 animate-fade-up"
      data-d={String(Math.min(index + 1, 8))}
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Toast */}
      {done && (
        <div className="fixed bottom-6 left-1/2 z-50 toast-pop" style={{ transform: 'translateX(-50%)' }}>
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl font-body text-sm font-medium"
            style={{ background: '#111827', color: '#fff' }}>
            <svg className="w-4 h-4 text-[#C9A84C] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            تمت الإضافة للسلة
          </div>
        </div>
      )}

      <Link href={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="img-wrap relative bg-gray-50 dark:bg-gray-900" style={{ aspectRatio: '4/5' }}>
          {mainImg ? (
            <Image src={mainImg} alt={product.name} fill className="object-cover"
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
          ) : (
            <div className="w-full h-full card-mesh flex items-center justify-center">
              <svg className="w-14 h-14 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          )}

          {/* Badges */}
          {discount && (
            <div className="absolute top-3 right-3">
              <span className="badge-gold text-[#1a1208]"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c96a)', color: '#1a1208', border: 'none', fontSize: '11px', fontWeight: 700 }}>
                -{discount}%
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3">
              <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
                نفد
              </span>
            </div>
          )}

          {/* Multiple images indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.slice(0,4).map((_, i) => (
                <div key={i} className={`rounded-full transition-all ${i===0?'w-4 h-1.5 bg-white':'w-1.5 h-1.5 bg-white/60'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-[17px] text-[#111827] dark:text-white leading-snug mb-1 line-clamp-1 group-hover:text-[#C9A84C] transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs font-body text-[#6B7280] dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-[#111827] dark:text-white">
              {Number(product.price).toLocaleString('ar-EG')} ج.م
            </span>
            {product.old_price > 0 && product.old_price > product.price && (
              <span className="text-sm font-body text-[#9CA3AF] line-through">
                {Number(product.old_price).toLocaleString('ar-EG')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <button
          onClick={addToCart}
          disabled={adding || product.stock === 0}
          className="w-full py-3 rounded-2xl text-sm btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderRadius: '14px' }}
        >
          {adding ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              جاري الإضافة...
            </span>
          ) : product.stock === 0 ? 'نفد المخزون' : 'إضافة للسلة'}
        </button>
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div className="px-4 pb-4 flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
          <button onClick={() => onEdit?.(product)}
            className="flex-1 py-2 rounded-xl text-xs font-body font-medium transition-all duration-200 hover:bg-[#C9A84C]/10"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}>
            تعديل
          </button>
          <button onClick={() => onDelete?.(product.id)}
            className="flex-1 py-2 rounded-xl text-xs font-body font-medium transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
            style={{ border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}>
            حذف
          </button>
        </div>
      )}
    </div>
  );
}
