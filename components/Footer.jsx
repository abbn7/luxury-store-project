'use client';
import { useState } from 'react';
import Link from 'next/link';

const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://instagram.com', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )},
  { name: 'Twitter/X', href: 'https://twitter.com', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
  { name: 'WhatsApp', href: 'https://wa.me/', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )},
];

export default function Footer({ onAdminActivate }) {
  const [email, setEmail] = useState('');
  const [hint, setHint] = useState('');

  const handleAdminInput = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setHint('✓ Admin Mode Active');
      onAdminActivate?.(true);
    } else {
      setHint('');
      onAdminActivate?.(false);
    }
  };

  return (
    <footer className="relative mt-24 border-t border-gray-100 dark:border-gray-800">
      {/* Gold divider top */}
      <div className="gold-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">L</span>
              </div>
              <span className="font-display text-xl font-semibold text-charcoal dark:text-white">Luxe</span>
            </div>
            <p className="text-sm text-muted dark:text-gray-400 leading-relaxed font-body">
              متجر فاخر يقدم أرقى المنتجات المختارة بعناية لذوي الأذواق الرفيعة.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-charcoal dark:text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'المتجر' },
                { href: '/cart', label: 'سلة المشتريات' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted dark:text-gray-400 hover:text-[#C9A84C] transition-colors font-body">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-charcoal dark:text-white mb-4">تابعنا</h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl card-gradient flex items-center justify-center text-muted dark:text-gray-400 hover:text-[#C9A84C] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 gold-divider" />
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted dark:text-gray-500 font-body">
            © {new Date().getFullYear()} Luxe Store. جميع الحقوق محفوظة.
          </p>

          {/* Hidden Admin Input */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={handleAdminInput}
              placeholder="."
              className="w-4 h-4 opacity-0 focus:opacity-100 focus:w-48 focus:h-9 focus:px-3 focus:py-2 transition-all duration-500 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-xs text-charcoal dark:text-white input-luxury font-body cursor-default focus:cursor-text"
              aria-label="Admin access"
              autoComplete="off"
            />
            {hint && (
              <span className="absolute left-0 -top-6 text-xs text-green-500 font-body whitespace-nowrap animate-fade-in">
                {hint}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
