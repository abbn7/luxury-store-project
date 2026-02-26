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
  const [addState, setAddState] = useState('idle'); // idle | adding | added
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const sync = () => {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(c.reduce((s, i) => s + i.quantity, 0));
    };
    sync();
    window.addEventListener('cartUpdate', sync);
    return () => window.removeEventListener('cartUpdate', sync);
  }, []);

  useEffect(() => {
    getProduct(id)
      .then((p) => { setProduct(p); })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const images = (() => {
    if (!product) return [];
    try { const imgs = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]'); return imgs.length ? imgs : product.image ? [product.image] : []; }
    catch { return product.image ? [product.image] : []; }
  })();

  const addToCart = () => {
    if (addState !== 'idle') return;
    setAddState('adding');
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const ex = cart.find((i) => i.id === product.id);
      if (ex) ex.quantity += qty;
      else cart.push({ ...product, quantity: qty });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdate'));
      setAddState('added');
      setTimeout(() => setAddState('idle'), 2200);
    }, 350);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0c0c0c]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="skeleton rounded-3xl" style={{ aspectRatio: '1' }} />
            <div className="space-y-4 pt-4">
              <div className="skeleton h-4 w-28 rounded-full" />
              <div className="skeleton h-10 w-3/4 rounded-2xl" />
              <div className="skeleton h-4 w-full rounded-lg" />
              <div className="skeleton h-4 w-2/3 rounded-lg" />
              <div className="skeleton h-12 w-36 rounded-2xl mt-8" />
              <div className="skeleton h-14 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.old_price > 0 && product.old_price > product.price
    ? Math.round((1 - product.price / product.old_price) * 100) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c]">
      <Navbar cartCount={cartCount} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-body text-[#9CA3AF] mb-10 animate-fade-in">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">المتجر</Link>
          <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
          <span className="text-[#111827] dark:text-white">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Images ── */}
          <div className="animate-fade-up" style={{ animationFillMode:'both', opacity:0 }}>
            {/* Main image */}
            <div
              className="relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 mb-3"
              style={{ aspectRatio: '1' }}
            >
              {images[activeImg] ? (
                <Image src={images[activeImg]} alt={product.name} fill
                  className="object-cover transition-opacity duration-300" priority
                  sizes="(max-width:768px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full card-mesh flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              )}
              {discount && (
                <div className="absolute top-4 right-4 w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c96a)' }}>
                  <span className="font-display font-black text-xl leading-none text-[#1a1208]">-{discount}</span>
                  <span className="text-[10px] font-body text-[#1a1208]/70">%</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`gallery-thumb flex-shrink-0 ${activeImg === i ? 'active' : ''}`}
                    style={{ width: 64, height: 64 }}
                  >
                    <Image src={url} alt="" width={64} height={64} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col opacity-0 animate-fade-up" data-d="2" style={{ animationFillMode:'forwards' }}>
            {/* Stock */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: product.stock > 0 ? '#10B981' : '#EF4444' }}
              />
              <span
                className="text-xs font-body font-medium"
                style={{ color: product.stock > 0 ? '#10B981' : '#EF4444' }}
              >
                {product.stock > 0 ? `متوفر — ${product.stock} قطعة` : 'نفد المخزون'}
              </span>
            </div>

            <h1
              className="font-display font-bold text-[#111827] dark:text-white mb-3 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', letterSpacing: '-0.02em' }}
            >
              {product.name}
            </h1>

            {product.description && (
              <p className="text-base font-body text-[#6B7280] dark:text-gray-400 leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            <div className="gold-line my-5" />

            {/* Price */}
            <div className="flex items-end gap-3 mb-7">
              <span className="font-display font-black text-[#111827] dark:text-white" style={{ fontSize: '2.4rem', lineHeight: 1 }}>
                {Number(product.price).toLocaleString('ar-EG')}
              </span>
              <span className="font-body text-base text-[#6B7280] mb-1">ج.م</span>
              {product.old_price > 0 && product.old_price > product.price && (
                <span className="font-body text-lg line-through text-[#9CA3AF] mb-1">
                  {Number(product.old_price).toLocaleString('ar-EG')} ج.م
                </span>
              )}
            </div>

            {/* Qty selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-7">
                <span className="text-sm font-body font-medium text-[#111827] dark:text-white">الكمية:</span>
                <div
                  className="flex items-center gap-1 rounded-2xl p-1"
                  style={{ background: '#F8F9FB', border: '1.5px solid rgba(0,0,0,0.09)' }}
                >
                  {[
                    { d: -1, icon: '−' },
                    { d: null },
                    { d: 1, icon: '+' },
                  ].map((btn, i) => btn.d === null ? (
                    <span key="v" className="w-10 text-center font-display font-bold text-lg text-[#111827] dark:text-white">
                      {qty}
                    </span>
                  ) : (
                    <button key={i} type="button"
                      onClick={() => setQty(Math.max(1, Math.min(product.stock, qty + btn.d)))}
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-body text-lg transition-all duration-200 hover:scale-110"
                      style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
                      {btn.icon}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={addToCart}
                disabled={product.stock === 0 || addState === 'adding'}
                className="flex-1 py-4 rounded-2xl text-base flex items-center justify-center gap-2 font-body font-semibold transition-all duration-400"
                style={{
                  background: product.stock === 0 ? '#F3F4F6' :
                    addState === 'added' ? 'linear-gradient(135deg,#10B981,#059669)' :
                    'linear-gradient(135deg,#C9A84C,#e8c96a)',
                  backgroundSize: '200% auto',
                  color: product.stock === 0 ? '#9CA3AF' : '#1a1208',
                  boxShadow: product.stock > 0 && addState !== 'added' ? '0 6px 20px rgba(201,168,76,0.25)' :
                    addState === 'added' ? '0 6px 20px rgba(16,185,129,0.25)' : 'none',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  transform: addState === 'added' ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                {addState === 'adding' ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : addState === 'added' ? (
                  <>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="text-white">تمت الإضافة</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    {product.stock === 0 ? 'نفد المخزون' : `إضافة${qty > 1 ? ` ${qty}` : ''} للسلة`}
                  </>
                )}
              </button>

              <Link href="/cart"
                className="btn-outline px-7 py-4 rounded-2xl text-base text-center flex items-center justify-center gap-2">
                السلة
              </Link>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>, label: 'توصيل سريع' },
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>, label: 'دفع آمن' },
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>, label: 'إرجاع مجاني' },
              ].map((b) => (
                <div key={b.label} className="text-center p-3 rounded-2xl card-mesh">
                  <div className="text-[#C9A84C] flex justify-center mb-1">{b.icon}</div>
                  <div className="text-[11px] font-body text-[#6B7280] dark:text-gray-400">{b.label}</div>
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
