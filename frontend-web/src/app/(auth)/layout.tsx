'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@/lib/icons';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9f4] via-[#e8f5ef] to-[#caf0f8] relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#40916C]/8 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0077B6]/6 rounded-full blur-3xl animate-float" />
      <Link
        href="/"
        className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-[#40916C]/60 hover:text-[#40916C] hover:bg-white/60 backdrop-blur-sm transition-all duration-300"
      >
        <ArrowLeftIcon size={14} />
        Back to Home
      </Link>
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}