'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${scrolled ? 'glass-nav shadow-sm' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-shadow duration-300 group-hover:shadow-[#C9A84C]/30"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #a87e2a)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <span className="font-display font-semibold text-xl text-[#111827] dark:text-white tracking-wide">Luxe</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'المتجر' },
              { href: '/cart', label: 'السلة' },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="px-4 py-2 rounded-xl text-sm font-body text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-all duration-200">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            <Link href="/cart"
              className="relative flex items-center justify-center w-9 h-9 rounded-xl card-mesh hover:shadow-md transition-all duration-300 hover:scale-105">
              <svg className="w-5 h-5 text-[#111827] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-scale-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button className="md:hidden w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-[5px]"
              onClick={() => setOpen(!open)}>
              {[0,1,2].map((i) => (
                <span key={i} className="block h-px bg-[#111827] dark:bg-white rounded-full transition-all duration-300"
                  style={{
                    width: i === 1 ? '12px' : '18px',
                    transform: open ? (i === 0 ? 'rotate(45deg) translate(4px,4px)' : i === 2 ? 'rotate(-45deg) translate(4px,-4px)' : 'none') : 'none',
                    opacity: open && i === 1 ? 0 : 1,
                  }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="gold-line mb-3" />
            {[
              { href: '/', label: 'المتجر' },
              { href: '/cart', label: `السلة${cartCount > 0 ? ` (${cartCount})` : ''}` },
            ].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block py-3 text-center text-sm font-body text-[#111827] dark:text-white hover:text-[#C9A84C] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
