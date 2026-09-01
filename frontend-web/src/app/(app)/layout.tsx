'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { HomeIcon, TargetIcon, BookOpenIcon, LeafIcon, UserIcon } from '@/lib/icons';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/missions', label: 'Missions', icon: TargetIcon },
  { href: '/learn', label: 'Learn', icon: BookOpenIcon },
  { href: '/impact', label: 'Impact', icon: LeafIcon },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { fetchMe, isAuthenticated, user } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      fetchMe().then(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [fetchMe, isAuthenticated]);

  useEffect(() => {
    if (!checking && !isAuthenticated) {
      router.push('/login');
    }
  }, [checking, isAuthenticated, router]);

  if (checking || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col pb-24 md:pb-8">
      {/* Desktop Header Navigation */}
      <header className="hidden md:block sticky top-0 z-40 glass-strong border-b border-[rgba(64,145,108,0.12)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center shadow-md shadow-[#1B4332]/20 group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-display font-bold text-base tracking-wide">GM</span>
            </div>
            <div>
              <span className="font-display font-bold text-lg text-[#1B4332] tracking-tight block">Goodwill Motive</span>
              <span className="text-[10px] text-[#40916C]/70 font-semibold tracking-wider uppercase -mt-1 block">Learn & Impact</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1.5 glass-card p-1.5 rounded-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-md shadow-[#1B4332]/20'
                      : 'text-[#2D6A4F]/70 hover:text-[#1B4332] hover:bg-[#40916C]/10'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 ${
                pathname === '/profile'
                  ? 'glass-card border border-[#40916C]/30 text-[#1B4332] shadow-sm'
                  : 'hover:bg-[#40916C]/10 text-[#1B4332]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center text-white font-bold text-xs shadow-inner">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold leading-tight text-[#1B4332]">{user?.username ?? 'Learner'}</p>
                <p className="text-[10px] font-semibold text-[#40916C] leading-none">{user?.contributionScore ?? 0} pts</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass-strong border-t border-[rgba(64,145,108,0.12)]">
        <div className="max-w-md mx-auto px-3">
          <div className="flex items-stretch justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white shadow-md shadow-[#40916C]/30'
                      : 'text-[#40916C]/70 hover:text-[#40916C] hover:bg-[#40916C]/5'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/profile"
              className={`flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-2xl transition-all duration-300 ${
                pathname === '/profile'
                  ? 'bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white shadow-md shadow-[#40916C]/30'
                  : 'text-[#40916C]/70 hover:text-[#40916C] hover:bg-[#40916C]/5'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">{user?.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
              </div>
              <span className="text-[11px] font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}