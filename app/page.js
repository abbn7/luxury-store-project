'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import AdminModal from '@/components/AdminModal';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/supabase';

function SkeletonCard() {
  return (
    <div className="product-card overflow-hidden">
      <div className="skeleton" style={{ aspectRatio: '4/5' }} />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-6 w-1/3 mt-2" />
      </div>
      <div className="px-4 pb-4"><div className="skeleton h-11 w-full rounded-2xl" /></div>
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('الكل');

  const load = useCallback(async () => {
    try { setError(null); const d = await getProducts(); setProducts(d || []); }
    catch (e) { setError('تعذر تحميل المنتجات — ' + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const sync = () => {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(c.reduce((s, i) => s + i.quantity, 0));
    };
    sync();
    window.addEventListener('cartUpdate', sync);
    return () => window.removeEventListener('cartUpdate', sync);
  }, []);

  const handleSave = async (data) => {
    if (editProduct) {
      const u = await updateProduct(editProduct.id, data);
      setProducts((p) => p.map((x) => (x.id === u.id ? u : x)));
    } else {
      const c = await createProduct(data);
      setProducts((p) => [c, ...p]);
    }
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    await deleteProduct(id);
    setProducts((p) => p.filter((x) => x.id !== id));
  };

  const FILTERS = ['الكل', 'متوفر', 'تخفيضات'];
  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchQ = !q || p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchF = filter === 'الكل'
      || (filter === 'متوفر' && p.stock > 0)
      || (filter === 'تخفيضات' && p.old_price > p.price);
    return matchQ && matchF;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c]">
      <Navbar cartCount={cartCount} />

      {/* ── Hero ── */}
      <section className="hero-mesh pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-body font-medium text-[#C9A84C] animate-fade-in"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', animationDelay:'0.1s', animationFillMode:'both', opacity:0 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            كولكشن 2025
          </div>

          <h1
            className="font-display font-bold text-[#111827] dark:text-white mb-4 animate-fade-up"
            style={{ fontSize: 'clamp(2.8rem,8vw,6rem)', lineHeight: 1.05, letterSpacing: '-0.02em', animationDelay:'0.15s', animationFillMode:'both', opacity:0 }}
          >
            الفخامة في
            <br />
            <span style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #e8c96a 40%, #a87e2a 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              كل تفصيل
            </span>
          </h1>

          <p
            className="text-base font-body text-[#6B7280] dark:text-gray-400 max-w-md mx-auto mb-8 animate-fade-up"
            style={{ lineHeight: 1.7, animationDelay:'0.25s', animationFillMode:'both', opacity:0 }}
          >
            منتجات مختارة بعناية لتعكس أسلوب حياتك الراقي.
          </p>

          {/* Search */}
          <div
            className="relative max-w-sm mx-auto animate-fade-up"
            style={{ animationDelay:'0.35s', animationFillMode:'both', opacity:0 }}
          >
            <div className="flex items-center rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1a]"
              style={{ border: '1.5px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="pr-4 pl-2">
                <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="flex-1 py-3.5 pl-3 bg-transparent text-sm font-body text-[#111827] dark:text-white placeholder-[#9CA3AF] outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="px-3 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Admin bar ── */}
      {isAdmin && (
        <div className="sticky top-16 z-40 animate-fade-in"
          style={{ background: 'rgba(201,168,76,0.06)', borderBottom: '1px solid rgba(201,168,76,0.2)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#C9A84C] text-sm font-body">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span className="font-medium">وضع المسؤول</span>
            </div>
            <button
              onClick={() => { setEditProduct(null); setShowModal(true); }}
              className="btn-gold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              إضافة منتج
            </button>
          </div>
        </div>
      )}

      {/* ── Products ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Filter chips */}
        {!loading && !error && products.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-5 py-2 rounded-2xl text-sm font-body font-medium transition-all duration-250"
                style={{
                  background: filter === f ? '#111827' : '#ffffff',
                  color: filter === f ? '#ffffff' : '#6B7280',
                  border: filter === f ? '1.5px solid transparent' : '1.5px solid rgba(0,0,0,0.09)',
                  boxShadow: filter === f ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.05)',
                }}>
                {f}
              </button>
            ))}
            <span className="text-xs font-body text-[#9CA3AF] mr-auto">
              {filtered.length} منتج
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-3xl p-8 text-center card-mesh">
            <svg className="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="font-body text-sm text-[#6B7280] mb-4">{error}</p>
            <button onClick={load} className="btn-gold px-6 py-2.5 rounded-xl text-sm">إعادة المحاولة</button>
          </div>
        )}

        {/* Loading */}
        {!error && loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!error && !loading && filtered.length === 0 && (
          <div className="text-center py-24 animate-scale-in">
            <div className="w-20 h-20 rounded-3xl card-mesh mx-auto mb-5 flex items-center justify-center">
              <svg className="w-9 h-9 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <h3 className="font-display font-semibold text-2xl text-[#111827] dark:text-white mb-2">
              {search ? 'لا توجد نتائج' : 'لا توجد منتجات'}
            </h3>
            <p className="text-sm font-body text-[#6B7280]">
              {search ? `لم نجد نتائج لـ "${search}"` : isAdmin ? 'ابدأ بإضافة أول منتج' : 'ستتوفر المنتجات قريباً'}
            </p>
          </div>
        )}

        {/* Grid */}
        {!error && !loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} isAdmin={isAdmin} index={i}
                onEdit={(p) => { setEditProduct(p); setShowModal(true); }}
                onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>

      <Footer onAdminActivate={setIsAdmin} />

      {showModal && (
        <AdminModal
          product={editProduct}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
        />
      )}
    </div>
  );
}
