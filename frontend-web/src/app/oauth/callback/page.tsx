'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth.store';
import { LeafIcon, SparklesIcon } from '@/lib/icons';

function CallbackContent() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    // Tokens arrive in the URL fragment (#token=…), which browsers never send to servers.
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get('token');
    const refreshToken = params.get('refreshToken') ?? undefined;
    // Scrub tokens from the address bar and browser history immediately.
    window.history.replaceState(null, '', window.location.pathname);

    if (!token) {
      router.replace('/login?error=oauth_failed');
      return;
    }

    api
      .get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data: user }) => {
        if (!user?.id) throw new Error('No user');
        setAuth(user, token, refreshToken);
        router.replace('/dashboard');
      })
      .catch(() => router.replace('/login?error=oauth_failed'));
  }, [setAuth, router]);

  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center mx-auto mb-6 animate-float shadow-lg shadow-[#40916C]/30">
        <LeafIcon size={36} className="text-white" />
      </div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <SparklesIcon size={16} className="text-[#40916C]" />
        <span className="text-sm font-semibold text-[#40916C]">Completing sign in...</span>
      </div>
      <h2 className="text-2xl font-display font-bold text-[#1B4332]">Welcome to Goodwill Motive</h2>
      <p className="text-[#40916C]/60 mt-2">Setting up your contribution journey</p>
      <div className="mt-6 flex items-center justify-center gap-1">
        {[1,2,3].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#40916C]/30 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8f9f4 0%, #e8f5ef 50%, #caf0f8 100%)' }}>
      <Suspense fallback={
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center mx-auto mb-6 animate-float shadow-lg shadow-[#40916C]/30">
            <LeafIcon size={36} className="text-white" />
          </div>
          <p className="text-[#40916C]/60">Loading...</p>
        </div>
      }>
        <CallbackContent />
      </Suspense>
    </div>
  );
}