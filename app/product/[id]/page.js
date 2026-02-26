'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProduct } from '@/lib/supabase';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
    };
    updateCart();
    window.addEventListener('cartUpdate', updateCart);
    return () => window.removeEventListener('cartUpdate', updateCart);
  }, []);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdate'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
        <Navbar cartCount={cartCount} />
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square skeleton rounded-3xl" />
            <div className="space-y-4 pt-4">
              <div className="h-10 skeleton rounded-xl w-3/4" />
              <div className="h-4 skeleton rounded-lg w-full" />
              <div className="h-4 skeleton rounded-lg w-2/3" />
              <div className="h-12 skeleton rounded-2xl w-1/2 mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.old_price && product.old_price > product.price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted dark:text-gray-500 font-body mb-10">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">المتجر</Link>
          <span>/</span>
          <span className="text-charcoal dark:text-gray-300">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="animate-fade-up">
            <div className="product-img-wrap aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative shadow-2xl">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full card-gradient flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {discount && (
                <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-[#C9A84C] text-white flex items-center justify-center shadow-lg">
                  <span className="text-sm font-body font-bold leading-none text-center">
                    -{discount}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col animate-fade-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full card-gradient text-xs font-body text-[#C9A84C] mb-4 border border-[#C9A84C]/20">
                {product.stock > 0 ? `${product.stock} في المخزون` : 'نفد المخزون'}
              </div>

              <h1 className="font-display font-bold text-4xl lg:text-5xl text-charcoal dark:text-white mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="gold-divider my-6" />

              {product.description && (
                <p className="text-base text-muted dark:text-gray-400 font-body leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Price */}
              <div className="flex items-end gap-3 mb-8">
                <span className="font-display font-bold text-4xl text-charcoal dark:text-white">
                  {Number(product.price).toLocaleString()} ر.س
                </span>
                {product.old_price && product.old_price > product.price && (
                  <span className="text-xl text-muted dark:text-gray-500 line-through font-body mb-1">
                    {Number(product.old_price).toLocaleString()} ر.س
                  </span>
                )}
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-sm text-muted dark:text-gray-400 font-body">الكمية:</span>
                  <div className="flex items-center gap-3 card-gradient rounded-2xl px-4 py-2">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/50 dark:hover:bg-black/20 transition-colors text-charcoal dark:text-white font-body text-lg"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-display font-semibold text-charcoal dark:text-white">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/50 dark:hover:bg-black/20 transition-colors text-charcoal dark:text-white font-body text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 rounded-2xl text-base font-body font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    product.stock === 0
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      : added
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200/50'
                      : 'btn-gold text-charcoal shadow-xl hover:shadow-2xl'
                  }`}
                >
                  {added ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      تمت الإضافة!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {product.stock === 0 ? 'نفد المخزون' : 'أضف إلى السلة'}
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-charcoal dark:text-white text-base font-body font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
                >
                  عرض السلة
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { icon: '🚚', label: 'توصيل سريع' },
                { icon: '🔒', label: 'دفع آمن' },
                { icon: '↩️', label: 'إرجاع مجاني' },
              ].map((b) => (
                <div key={b.label} className="text-center p-3 rounded-2xl card-gradient">
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs text-muted dark:text-gray-400 font-body">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
