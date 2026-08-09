'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuthStore } from '@/lib/stores/admin-auth.store';
import { ShieldIcon, EyeIcon, EyeOffIcon, ArrowRightIcon, AlertTriangleIcon } from '@/lib/icons';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAdminAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    if (useAdminAuthStore.getState().isAuthenticated) router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #081C15 0%, #0D2B1F 50%, #112B1F 100%)' }}>
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#40916C]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#0077B6]/5 rounded-full blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-[#40916C]/30 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <ShieldIcon size={28} className="text-[#40916C]" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Admin Portal</h1>
            <p className="text-[#40916C]/70 mt-2">Goodwill Motive — Restricted Access</p>
          </div>

          <div className="rounded-3xl p-8 space-y-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)', backdropFilter: 'blur(20px)' }}>
            {error && (
              <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(244,228,212,0.1)', border: '1px solid rgba(193,154,107,0.3)' }}>
                <AlertTriangleIcon size={18} className="text-[#C19A6B]" />
                <span className="text-sm text-[#C19A6B] font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@goodwill.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/30 focus:border-[#40916C] focus:bg-white/10 focus:ring-4 focus:ring-[#40916C]/20 outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/30 focus:border-[#40916C] focus:bg-white/10 focus:ring-4 focus:ring-[#40916C]/20 outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#40916C] to-[#52B788] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#40916C]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Enter Admin Portal
                    <ArrowRightIcon size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <Link href="/login" className="text-sm text-white/50 hover:text-white/80 transition-colors font-medium">
                ← Back to user login
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/30">This portal is for authorized administrators only. All access is logged and monitored.</p>
          </div>
        </div>
      </div>
    </div>
  );
}