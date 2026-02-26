'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #1e1028 0%, #0d1f2d 100%)'
          : 'linear-gradient(135deg, #F3E8FF 0%, #E0F2FE 100%)',
        boxShadow: dark
          ? 'inset 0 2px 6px rgba(0,0,0,0.4)'
          : 'inset 0 2px 6px rgba(0,0,0,0.1)',
      }}
      aria-label="Toggle theme"
    >
      <span
        className="absolute top-1 w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center text-xs shadow-md"
        style={{
          left: dark ? 'calc(100% - 24px)' : '4px',
          background: dark
            ? 'linear-gradient(135deg, #C9A84C, #F5E6C8)'
            : 'linear-gradient(135deg, #fff, #f0f0e8)',
        }}
      >
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
