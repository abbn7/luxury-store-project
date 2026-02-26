'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
    setCartCount(stored.reduce((s, i) => s + i.quantity, 0));

    const onUpdate = () => {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(c);
      setCartCount(c.reduce((s, i) => s + i.quantity, 0));
    };
    window.addEventListener('cartUpdate', onUpdate);
    return () => window.removeEventListener('cartUpdate', onUpdate);
  }, []);

  const updateQty = (id, delta) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const remove = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar cartCount={cartCount} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-charcoal dark:text-white mb-2">
            سلة المشتريات
          </h1>
          <p className="text-muted dark:text-gray-400 font-body text-sm">
            {totalItems > 0 ? `${totalItems} منتج في سلتك` : 'سلتك فارغة'}
          </p>
          <div className="gold-divider mt-4" />
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="w-24 h-24 rounded-3xl card-gradient flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="font-display font-semibold text-2xl text-charcoal dark:text-white mb-3">
              سلتك فارغة
            </h2>
            <p className="text-muted dark:text-gray-400 font-body text-sm mb-8">
              استكشف منتجاتنا الفاخرة وأضف ما يعجبك
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl btn-gold text-charcoal font-body font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              تسوق الآن
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, i) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl card-gradient animate-fade-up border border-white/50 dark:border-gray-800/50"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
                >
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 relative">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-lg text-charcoal dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#C9A84C] font-body font-medium text-sm mt-1">
                      {Number(item.price).toLocaleString()} ر.س
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2 bg-white/60 dark:bg-black/20 rounded-xl px-3 py-1.5">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-charcoal dark:text-white font-body"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-display font-semibold text-sm text-charcoal dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-charcoal dark:text-white font-body"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-display font-semibold text-charcoal dark:text-white">
                          {(item.price * item.quantity).toLocaleString()} ر.س
                        </span>
                        <button
                          onClick={() => remove(item.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-500 font-body transition-colors py-2"
              >
                إفراغ السلة بالكامل
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 card-gradient rounded-3xl p-6 border border-white/50 dark:border-gray-800/50 animate-fade-in">
                <h2 className="font-display font-semibold text-xl text-charcoal dark:text-white mb-6">
                  ملخص الطلب
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-body text-muted dark:text-gray-400">
                    <span>المنتجات ({totalItems})</span>
                    <span>{total.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm font-body text-muted dark:text-gray-400">
                    <span>الشحن</span>
                    <span className="text-green-500">مجاناً</span>
                  </div>
                  <div className="gold-divider" />
                  <div className="flex justify-between font-display font-semibold text-xl text-charcoal dark:text-white">
                    <span>الإجمالي</span>
                    <span>{total.toLocaleString()} ر.س</span>
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl btn-gold text-charcoal font-body font-medium text-base">
                  إتمام الشراء
                </button>

                <Link
                  href="/"
                  className="mt-3 w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-muted dark:text-gray-400 font-body text-sm text-center block hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  متابعة التسوق
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
