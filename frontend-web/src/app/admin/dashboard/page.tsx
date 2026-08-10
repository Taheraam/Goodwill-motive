'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuthStore } from '@/lib/stores/admin-auth.store';
import { adminApi } from '@/lib/api';
import { UsersIcon, BookOpenIcon, TargetIcon, HeartIcon, LogOutIcon, SettingsIcon, BarChartIcon, ShieldIcon, AlertTriangleIcon } from '@/lib/icons';

interface DashboardStats { totalUsers: number; totalQuizzes: number; totalMissions: number; totalCampaigns: number; }

import { useQuery } from '@tanstack/react-query';

export default function AdminDashboardPage() {
  const { admin, logout } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!useAdminAuthStore.getState().isAuthenticated) { router.push('/admin/login'); return; }
  }, [router]);

  const { data: stats = { totalUsers: 0, totalQuizzes: 0, totalMissions: 0, totalCampaigns: 0 } } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const res = await adminApi.get('/contributions/dashboard');
      return res.data as DashboardStats;
    },
    enabled: useAdminAuthStore.getState().isAuthenticated,
  });

  const handleLogout = () => { logout(); router.push('/admin/login'); };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon, gradient: 'from-[#0077B6] to-[#00B4D8]' },
    { label: 'Quizzes', value: stats.totalQuizzes, icon: BookOpenIcon, gradient: 'from-[#40916C] to-[#52B788]' },
    { label: 'Missions', value: stats.totalMissions, icon: TargetIcon, gradient: 'from-[#8B5E3C] to-[#C19A6B]' },
    { label: 'Campaigns', value: stats.totalCampaigns, icon: HeartIcon, gradient: 'from-[#1B4332] to-[#2D6A4F]' },
  ];

  const quickLinks = [
    { href: '/admin/users', title: 'Manage Users', desc: 'View and manage user accounts, roles, and permissions.', icon: UsersIcon, color: 'from-[#0077B6] to-[#00B4D8]' },
    { href: '/admin/reports', title: 'View Reports', desc: 'Access moderation reports, flagged content, and user complaints.', icon: AlertTriangleIcon, color: 'from-[#8B5E3C] to-[#C19A6B]' },
    { href: '/dashboard', title: 'User Dashboard', desc: 'Preview the learner experience.', icon: BarChartIcon, color: 'from-[#40916C] to-[#52B788]' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F8FAF7 0%, #EDF5EF 100%)' }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <ShieldIcon size={24} className="text-[#40916C]" />
              </div>
              <div>
                <p className="text-[#D8F3DC] text-xs font-semibold uppercase tracking-wider">Admin Portal</p>
                <h1 className="text-2xl font-display font-bold text-white">Goodwill Motive</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-semibold text-sm">{admin?.username ?? 'Admin'}</p>
                <p className="text-[#D8F3DC] text-xs">{admin?.email ?? 'admin@goodwill.com'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-white text-sm font-medium transition-all duration-300"
              >
                <LogOutIcon size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 stagger-children">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`} />
              <div className="relative p-6">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center mb-4">
                  <s.icon size={20} className="text-white/80" />
                </div>
                <p className="text-4xl font-display font-bold text-white mb-1">{s.value}</p>
                <p className="text-sm text-white/70 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
            <SettingsIcon size={18} className="text-[#40916C]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href}
                className="group glass-card rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <h2 className="text-lg font-semibold text-[#1B4332] mb-1">{item.title}</h2>
                <p className="text-sm text-[#40916C]/60 leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-[#40916C] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Go to <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}