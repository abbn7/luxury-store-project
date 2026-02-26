'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const load = () => setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    load();
    window.addEventListener('cartUpdate', load);
    return () => window.removeEventListener('cartUpdate', load);
  }, []);

  const save = (updated) => {
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const updateQty = (id, d) => save(cart.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i));
  const remove = (id) => save(cart.filter((i) => i.id !== id));
  const clear = () => { localStorage.removeItem('cart'); setCart([]); window.dispatchEvent(new Event('cartUpdate')); };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const savings = cart.reduce((s, i) => s + (i.old_price > i.price ? (i.old_price - i.price) * i.quantity : 0), 0);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c]">
      <Navbar cartCount={count} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationFillMode:'both', opacity:0 }}>
          <h1 className="font-display font-bold text-[#111827] dark:text-white" style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing:'-0.02em' }}>
            سلة المشتريات
          </h1>
          {count > 0 && (
            <span className="badge-gold">{count} منتج</span>
          )}
        </div>
        <div className="gold-line mb-8" />

        {/* Empty */}
        {cart.length === 0 && (
          <div className="text-center py-24 animate-scale-in">
            <div className="w-20 h-20 rounded-3xl card-mesh mx-auto mb-5 flex items-center justify-center">
              <svg className="w-9 h-9 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <h2 className="font-display font-semibold text-2xl text-[#111827] dark:text-white mb-2">السلة فارغة</h2>
            <p className="text-sm font-body text-[#6B7280] mb-7">تصفح منتجاتنا وأضف ما يعجبك</p>
            <Link href="/" className="btn-dark px-8 py-3.5 rounded-2xl text-sm inline-block">تصفح المنتجات</Link>
          </div>
        )}

        {/* Cart layout */}
        {cart.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item, i) => {
                const mainImg = (() => {
                  try { const imgs = Array.isArray(item.images) ? item.images : JSON.parse(item.images||'[]'); return imgs[0] || item.image; }
                  catch { return item.image; }
                })();
                return (
                  <div key={item.id}
                    className="product-card flex gap-4 p-4 opacity-0 animate-fade-up"
                    data-d={String(Math.min(i+1,6))}
                    style={{ animationFillMode:'forwards' }}>

                    {/* Image */}
                    <div className="relative flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800"
                      style={{ width: 80, height: 80 }}>
                      {mainImg
                        ? <Image src={mainImg} alt={item.name} fill className="object-cover" sizes="80px" />
                        : <div className="w-full h-full card-mesh" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <h3 className="font-display font-semibold text-base text-[#111827] dark:text-white truncate leading-snug">
                          {item.name}
                        </h3>
                        <button onClick={() => remove(item.id)}
                          className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                          style={{ color: '#dc2626' }}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Qty */}
                        <div className="flex items-center gap-1 rounded-xl p-0.5"
                          style={{ background: '#F8F9FB', border: '1.5px solid rgba(0,0,0,0.09)' }}>
                          {[[-1,'−'],[null,null],[1,'+']].map(([d,lbl],idx) => d===null ? (
                            <span key="v" className="w-8 text-center font-display font-bold text-sm text-[#111827] dark:text-white">
                              {item.quantity}
                            </span>
                          ) : (
                            <button key={idx} onClick={() => updateQty(item.id,d)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
                              style={{ background:'rgba(201,168,76,0.1)', color:'#C9A84C' }}>
                              {lbl}
                            </button>
                          ))}
                        </div>

                        <span className="font-display font-bold text-base text-[#111827] dark:text-white">
                          {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button onClick={clear}
                className="text-xs font-body text-[#9CA3AF] hover:text-red-500 transition-colors mt-1 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"/>
                </svg>
                إفراغ السلة
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl p-5 animate-fade-in card-mesh"
                style={{ border:'1px solid rgba(255,255,255,0.7)' }}>
                <h2 className="font-display font-semibold text-lg text-[#111827] dark:text-white mb-5">ملخص الطلب</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm font-body text-[#6B7280]">
                    <span>المنتجات ({count})</span>
                    <span>{total.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-sm font-body" style={{ color:'#10B981' }}>
                      <span>توفير</span>
                      <span>-{savings.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-body text-[#6B7280]">
                    <span>الشحن</span>
                    <span className="font-semibold" style={{ color:'#10B981' }}>مجاناً</span>
                  </div>
                  <div className="gold-line" />
                  <div className="flex justify-between">
                    <span className="font-display font-semibold text-lg text-[#111827] dark:text-white">الإجمالي</span>
                    <span className="font-display font-bold text-xl text-[#111827] dark:text-white">{total.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="btn-gold w-full py-3.5 rounded-2xl text-base mb-3">
                  إتمام الطلب
                </button>
                <Link href="/" className="btn-outline w-full py-3 rounded-2xl text-sm text-center block">
                  متابعة التسوق
                </Link>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-[#9CA3AF]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span className="text-xs font-body">دفع آمن ومشفر</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
