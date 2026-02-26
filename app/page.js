'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import AdminModal from '@/components/AdminModal';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/supabase';

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] skeleton rounded-2xl mb-4" />
      <div className="card-gradient rounded-2xl p-4 space-y-2">
        <div className="h-5 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-full" />
        <div className="h-6 skeleton rounded-lg w-1/3 mt-3" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      setError('تعذر تحميل المنتجات. تحقق من إعدادات Supabase.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
    };
    updateCart();
    window.addEventListener('cartUpdate', updateCart);
    return () => window.removeEventListener('cartUpdate', updateCart);
  }, []);

  const handleSave = async (data) => {
    if (editProduct) {
      const updated = await updateProduct(editProduct.id, data);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await createProduct(data);
      setProducts((prev) => [created, ...prev]);
    }
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar cartCount={cartCount} />

      {/* Hero */}
      <section className="hero-mesh pt-24 pb-16 lg:pt-36 lg:pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-gradient text-xs font-body text-[#C9A84C] mb-6 border border-[#C9A84C]/20 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            كولكشن حصري لعام 2025
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-charcoal dark:text-white mb-6 leading-none tracking-tight animate-fade-up">
            الفخامة
            <span className="block text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 50%, #C9A84C 100%)',
            }}>
              في كل تفصيل
            </span>
          </h1>
          <p className="text-lg text-muted dark:text-gray-400 font-body max-w-xl mx-auto mb-10 animate-fade-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
            منتجات مختارة بعناية فائقة لتعكس أسلوب حياتك الراقي وذوقك المتميز.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto animate-fade-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full px-6 py-4 pl-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-charcoal dark:text-white font-body text-sm input-luxury shadow-sm transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Admin Bar */}
      {isAdmin && (
        <div className="sticky top-16 z-40 bg-[#C9A84C]/10 border-y border-[#C9A84C]/30 backdrop-blur-sm animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#C9A84C] text-sm font-body">
              <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              وضع المسؤول نشط
            </div>
            <button
              onClick={() => { setEditProduct(null); setShowModal(true); }}
              className="px-5 py-2 rounded-xl btn-gold text-charcoal text-sm font-body font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة منتج
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-muted dark:text-gray-400 font-body mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 rounded-xl btn-gold text-charcoal text-sm font-body font-medium"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {!error && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!error && !loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl card-gradient flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-2xl text-charcoal dark:text-white mb-2">
              {search ? 'لا توجد نتائج' : 'لا توجد منتجات'}
            </h3>
            <p className="text-muted dark:text-gray-400 font-body text-sm">
              {search ? 'جرب البحث بكلمات أخرى' : isAdmin ? 'ابدأ بإضافة أول منتج' : 'سيتم إضافة منتجات قريباً'}
            </p>
          </div>
        )}

        {!error && !loading && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted dark:text-gray-400 text-sm font-body">
                {filtered.length} منتج{filtered.length !== 1 ? '' : ''}
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={isAdmin}
                  index={i}
                  onEdit={(p) => { setEditProduct(p); setShowModal(true); }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
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
