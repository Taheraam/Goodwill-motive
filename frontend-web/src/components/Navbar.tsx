'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong border-b border-[rgba(64,145,108,0.15)] shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center shadow-md shadow-[#1B4332]/20 group-hover:scale-105 transition-all duration-300">
            <span className="text-white font-display font-bold text-base tracking-wide">GM</span>
          </div>
          <div>
            <span className="font-display font-bold text-lg text-[#1B4332] tracking-tight block">Goodwill Motive</span>
            <span className="text-[10px] text-[#40916C]/80 font-semibold tracking-wider uppercase -mt-0.5 block">Learn & Impact</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <a href="#features" className="text-sm font-semibold text-[#2D6A4F]/80 hover:text-[#1B4332] transition-colors">
            Features
          </a>
          <a href="#works" className="text-sm font-semibold text-[#2D6A4F]/80 hover:text-[#1B4332] transition-colors">
            How It Works
          </a>
          <a href="#impact" className="text-sm font-semibold text-[#2D6A4F]/80 hover:text-[#1B4332] transition-colors">
            Impact
          </a>
          <Link
            href="/login"
            className="text-sm font-semibold text-[#1B4332] hover:text-[#40916C] transition-colors px-3 py-1.5 rounded-full hover:bg-[#40916C]/10"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] rounded-full shadow-md shadow-[#1B4332]/20 hover:shadow-lg hover:shadow-[#1B4332]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Get Started Free
          </Link>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2 rounded-xl text-[#1B4332] hover:bg-[#40916C]/10 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            {showMenu ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {showMenu && (
        <div className="md:hidden glass-strong border-b border-[rgba(64,145,108,0.15)] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <a
            href="#features"
            onClick={() => setShowMenu(false)}
            className="block text-base font-semibold text-[#2D6A4F] hover:text-[#1B4332]"
          >
            Features
          </a>
          <a
            href="#works"
            onClick={() => setShowMenu(false)}
            className="block text-base font-semibold text-[#2D6A4F] hover:text-[#1B4332]"
          >
            How It Works
          </a>
          <a
            href="#impact"
            onClick={() => setShowMenu(false)}
            className="block text-base font-semibold text-[#2D6A4F] hover:text-[#1B4332]"
          >
            Impact
          </a>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setShowMenu(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#1B4332] rounded-full glass-card hover:bg-[#40916C]/10"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setShowMenu(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] rounded-full shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}