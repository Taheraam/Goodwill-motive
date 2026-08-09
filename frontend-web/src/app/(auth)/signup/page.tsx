'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth.store';
import api from '@/lib/api';
import { GoogleIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from '@/lib/icons';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading, error, setError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(email, password, username);
    if (useAuthStore.getState().isAuthenticated) router.push('/dashboard');
  };

  const handleGoogle = async () => {
    try {
      const { data } = await api.get('/auth/google');
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || 'Google OAuth not configured yet');
      }
    } catch {
      setError('Google OAuth not available');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8 stagger-children">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center shadow-lg shadow-[#40916C]/25 animate-float">
            <span className="text-white font-bold text-xl">GM</span>
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-[#1B4332]">Join the movement</h1>
        <p className="text-[#40916C]/70 mt-2">Start contributing. Start changing lives.</p>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-5 animate-fade-in-scale">
        {error && (
          <div className="flex items-center gap-3 bg-[#F4E4D4]/80 border border-[#C19A6B]/30 rounded-xl px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-sm text-[#8B5E3C] font-medium">{error}</span>
          </div>
        )}

        <button
          onClick={handleGoogle}
          className="w-full py-4 border-2 border-[rgba(64,145,108,0.15)] bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 hover:border-[rgba(64,145,108,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 text-[#1B4332] font-medium"
        >
          <GoogleIcon size={20} />
          Sign up with Google
        </button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-[rgba(64,145,108,0.15)]" />
          <span className="text-xs text-[#40916C]/50 font-medium px-2">or</span>
          <div className="flex-1 h-px bg-[rgba(64,145,108,0.15)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1B4332] mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your unique username"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-[rgba(64,145,108,0.15)] bg-white/60 backdrop-blur-sm text-[#1B4332] placeholder:text-[#40916C]/40 focus:border-[#40916C] focus:bg-white/80 focus:ring-4 focus:ring-[#40916C]/10 outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B4332] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-[rgba(64,145,108,0.15)] bg-white/60 backdrop-blur-sm text-[#1B4332] placeholder:text-[#40916C]/40 focus:border-[#40916C] focus:bg-white/80 focus:ring-4 focus:ring-[#40916C]/10 outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B4332] mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-[rgba(64,145,108,0.15)] bg-white/60 backdrop-blur-sm text-[#1B4332] placeholder:text-[#40916C]/40 focus:border-[#40916C] focus:bg-white/80 focus:ring-4 focus:ring-[#40916C]/10 outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#40916C]/50 hover:text-[#40916C] transition-colors"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#40916C]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRightIcon size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#40916C]/70">
          Already have an account?{' '}
          <Link href="/login" className="text-[#40916C] font-semibold hover:text-[#1B4332] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}