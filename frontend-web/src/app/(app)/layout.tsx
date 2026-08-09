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
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-24">
      <main className="max-w-lg mx-auto">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 glass-strong border-t border-[rgba(64,145,108,0.1)]">
        <div className="max-w-lg mx-auto px-2">
          <div className="flex items-stretch justify-around py-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white shadow-lg shadow-[#40916C]/30'
                      : 'text-[#40916C]/60 hover:text-[#40916C] hover:bg-[#40916C]/5'
                  }`}
                >
                  <item.icon size={22} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/profile"
              className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                pathname === '/profile'
                  ? 'bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white shadow-lg shadow-[#40916C]/30'
                  : 'text-[#40916C]/60 hover:text-[#40916C] hover:bg-[#40916C]/5'
              }`}
            >
              {pathname === '/profile' ? (
                <UserIcon size={22} />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center">
                  <UserIcon size={14} className="text-white" />
                </div>
              )}
              <span className="text-xs font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}