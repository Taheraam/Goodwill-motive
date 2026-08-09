'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 nav-glass">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
            <span className="text-white font-bold text-sm">GM</span>
          </div>
          <span className="font-display font-bold text-base text-[#1B4332]">Goodwill Motive</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-[#2D6A4F]/70 hover:text-[#1B4332] transition-colors">Features</a>
          <a href="#works" className="text-sm font-medium text-[#2D6A4F]/70 hover:text-[#1B4332] transition-colors">How It Works</a>
          <a href="#impact" className="text-sm font-medium text-[#2D6A4F]/70 hover:text-[#1B4332] transition-colors">Impact</a>
          <Link href="/login" className="text-sm font-semibold text-[#40916C] hover:text-[#1B4332] transition-colors">Sign In</Link>
          <Link href="/signup" className="px-5 py-2 text-sm font-semibold text-white bg-[#1B4332] rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Get Started
          </Link>
        </div>

        <button onClick={() => setShowMenu(!showMenu)} className="md:hidden p-2 text-[#1B4332]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {showMenu ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {showMenu && (
        <div className="md:hidden nav-glass px-4 py-4 space-y-3">
          <a href="#features" onClick={() => setShowMenu(false)} className="block text-sm font-medium text-[#2D6A4F]/70 hover:text-[#1B4332]">Features</a>
          <a href="#works" onClick={() => setShowMenu(false)} className="block text-sm font-medium text-[#2D6A4F]/70 hover:text-[#1B4332]">How It Works</a>
          <a href="#impact" onClick={() => setShowMenu(false)} className="block text-sm font-medium text-[#2D6A4F]/70 hover:text-[#1B4332]">Impact</a>
          <Link href="/login" onClick={() => setShowMenu(false)} className="block text-sm font-semibold text-[#40916C] hover:text-[#1B4332]">Sign In</Link>
          <Link href="/signup" onClick={() => setShowMenu(false)} className="block text-sm font-semibold text-white bg-[#1B4332] rounded-full px-4 py-2 text-center hover:bg-[#2D6A4F]">Get Started</Link>
        </div>
      )}
    </nav>
  );
}