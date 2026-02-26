'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Toast({ message }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast">
      <div className="px-6 py-3 rounded-2xl bg-charcoal dark:bg-white text-white dark:text-charcoal text-sm font-body shadow-2xl flex items-center gap-2">
        <span>✓</span> {message}
      </div>
    </div>
  );
}

export default function ProductCard({ product, isAdmin, onEdit, onDelete, index = 0 }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const addToCart = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdate'));
      setLoading(false);
      showToast();
    }, 400);
  };

  const delayClass = `stagger-${Math.min(index + 1, 6)}`;

  return (
    <>
      {toast && <Toast message="تمت الإضافة إلى السلة" />}
      <div
        className={`group relative animate-fade-up ${delayClass} opacity-0`}
        style={{ animationFillMode: 'forwards' }}
      >
        <Link href={`/product/${product.id}`} className="block">
          {/* Image */}
          <div className="product-img-wrap aspect-[4/5] bg-gray-50 dark:bg-gray-900 mb-4 relative">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full card-gradient flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Stock badge */}
            {product.stock === 0 && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-50/90 backdrop-blur-sm text-red-500 text-xs font-body font-medium">
                نفد المخزون
              </div>
            )}

            {/* Old price badge */}
            {product.old_price && product.old_price > product.price && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#C9A84C] text-white text-xs font-body font-medium shadow-sm">
                -{Math.round((1 - product.price / product.old_price) * 100)}%
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </div>

          {/* Info */}
          <div className="card-gradient rounded-2xl p-4 dark:border dark:border-gray-800/50">
            <h3 className="font-display font-semibold text-lg text-charcoal dark:text-white leading-snug mb-1 group-hover:text-[#C9A84C] transition-colors duration-200">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-muted dark:text-gray-400 font-body line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-xl text-charcoal dark:text-white">
                {Number(product.price).toLocaleString()} ر.س
              </span>
              {product.old_price && product.old_price > product.price && (
                <span className="text-sm text-muted dark:text-gray-500 line-through font-body">
                  {Number(product.old_price).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Add to cart */}
        <button
          onClick={addToCart}
          disabled={loading || product.stock === 0}
          className={`mt-3 w-full py-3 rounded-2xl text-sm font-body font-medium transition-all duration-300 ${
            product.stock === 0
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'btn-gold text-charcoal hover:shadow-xl active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              جاري الإضافة...
            </span>
          ) : product.stock === 0 ? 'نفد المخزون' : 'أضف إلى السلة'}
        </button>

        {/* Admin actions */}
        {isAdmin && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onEdit?.(product)}
              className="flex-1 py-2 rounded-xl border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-body hover:bg-[#C9A84C]/10 transition-colors duration-200"
            >
              تعديل
            </button>
            <button
              onClick={() => onDelete?.(product.id)}
              className="flex-1 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-500 text-xs font-body hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              حذف
            </button>
          </div>
        )}
      </div>
    </>
  );
}
