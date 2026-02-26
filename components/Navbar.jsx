'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-md group-hover:shadow-yellow-200/50 transition-shadow duration-300">
              <span className="text-white font-display font-bold text-sm">L</span>
            </div>
            <span className="font-display text-xl font-semibold tracking-wide text-charcoal dark:text-white">
              Luxe
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'المتجر' },
              { href: '/cart', label: 'السلة' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-body text-muted dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#C9A84C] to-[#E0F2FE] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#F3E8FF] to-[#E0F2FE] dark:from-[#1e1028] dark:to-[#0d1f2d] hover:shadow-md transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-charcoal dark:text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="flex flex-col gap-1.5">
                <span className={`block w-5 h-px bg-charcoal dark:bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-px bg-charcoal dark:bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-px bg-charcoal dark:bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="gold-divider mb-4" />
            {[
              { href: '/', label: 'المتجر' },
              { href: '/cart', label: 'السلة' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-center font-body text-charcoal dark:text-white hover:text-[#C9A84C] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
