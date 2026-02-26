'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(localStorage.getItem('theme') === 'dark');
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  if (!mounted) return <div className="w-12 h-6 rounded-full bg-gray-100 dark:bg-gray-800" />;

  return (
    <button
      onClick={toggle}
      aria-label="تبديل الوضع"
      className="relative w-12 h-6 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40 transition-all duration-400"
      style={{
        background: dark ? 'linear-gradient(135deg, #1c1228, #0d1c2a)' : 'linear-gradient(135deg, #F3E8FF, #E0F2FE)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full shadow-sm flex items-center justify-center transition-all duration-400"
        style={{
          left: dark ? '26px' : '2px',
          background: dark ? '#1a1208' : '#ffffff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      >
        {dark ? (
          <svg className="w-3 h-3 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </span>
    </button>
  );
}
