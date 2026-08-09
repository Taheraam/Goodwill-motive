'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuthStore } from '@/lib/stores/admin-auth.store';
import { UsersIcon, ShieldIcon, ArrowLeftIcon, SearchIcon, SettingsIcon, ChevronRightIcon } from '@/lib/icons';

export default function AdminUsersPage() {
  const { isAuthenticated, admin, logout } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/admin/login');
  }, [isAuthenticated, router]);

  const handleLogout = () => { logout(); router.push('/admin/login'); };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F8FAF7 0%, #EDF5EF 100%)' }}>
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' }}>
        <div className="relative max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
                <ArrowLeftIcon size={16} />
                Back
              </Link>
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <UsersIcon size={20} className="text-white/80" />
              </div>
              <div>
                <p className="text-[#D8F3DC] text-xs font-semibold uppercase tracking-wider">Admin Portal</p>
                <h1 className="text-xl font-display font-bold text-white">Manage Users</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white font-semibold text-sm">{admin?.username ?? 'Admin'}</p>
              </div>
              <button onClick={handleLogout} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-all duration-300">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-3">
          <SearchIcon size={20} className="text-[#40916C]/50" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            className="flex-1 bg-transparent text-[#1B4332] placeholder:text-[#40916C]/40 outline-none text-sm"
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 glass rounded-xl text-xs font-semibold text-[#40916C] hover:bg-[#D8F3DC]/50 transition-all duration-300">
              All
            </button>
            <button className="px-4 py-2 glass rounded-xl text-xs font-semibold text-[#40916C]/50 hover:bg-[#D8F3DC]/50 transition-all duration-300">
              Admins
            </button>
            <button className="px-4 py-2 glass rounded-xl text-xs font-semibold text-[#40916C]/50 hover:bg-[#D8F3DC]/50 transition-all duration-300">
              Learners
            </button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center mx-auto mb-5">
            <UsersIcon size={28} className="text-[#1B4332]" />
          </div>
          <h2 className="text-xl font-display font-bold text-[#1B4332] mb-2">User Management</h2>
          <p className="text-[#40916C]/60 max-w-md mx-auto leading-relaxed">
            Complete user listing, role management, account controls, and activity monitoring — all coming soon.
          </p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <SettingsIcon size={14} className="text-[#40916C]/40" />
            <span className="text-xs text-[#40916C]/40 font-medium">Backend API integration pending</span>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Active Users', value: '—', icon: UsersIcon, color: 'from-[#0077B6] to-[#00B4D8]' },
            { label: 'New This Week', value: '—', icon: ShieldIcon, color: 'from-[#40916C] to-[#52B788]' },
            { label: 'Pending Verification', value: '—', icon: SearchIcon, color: 'from-[#8B5E3C] to-[#C19A6B]' },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-[#1B4332]">{item.value}</p>
                <p className="text-xs text-[#40916C]/60 font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}