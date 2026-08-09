'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuthStore } from '@/lib/stores/admin-auth.store';
import { AlertTriangleIcon, ShieldIcon, ArrowLeftIcon, SearchIcon, MessageCircleIcon, CheckCircleIcon, ChevronRightIcon } from '@/lib/icons';

export default function AdminReportsPage() {
  const { isAuthenticated, admin, logout } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/admin/login');
  }, [isAuthenticated, router]);

  const handleLogout = () => { logout(); router.push('/admin/login'); };

  const reports = [
    { id: 1, type: 'Content Report', title: 'Inappropriate content in Q&A section', status: 'Pending', severity: 'high', time: '2 hours ago' },
    { id: 2, type: 'User Report', title: 'Suspicious account behavior detected', status: 'Under Review', severity: 'medium', time: '5 hours ago' },
    { id: 3, type: 'Spam Report', title: 'Repeated promotional messages in community', status: 'Resolved', severity: 'low', time: '1 day ago' },
  ];

  const getSeverityStyle = (s: string) => {
    if (s === 'high') return 'bg-[#F4E4D4] text-[#8B5E3C]';
    if (s === 'medium') return 'bg-[#CAF0F8] text-[#0077B6]';
    return 'bg-[#D8F3DC] text-[#40916C]';
  };

  const getStatusStyle = (s: string) => {
    if (s === 'Pending') return 'text-[#8B5E3C]';
    if (s === 'Under Review') return 'text-[#0077B6]';
    return 'text-[#40916C]';
  };

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
                <AlertTriangleIcon size={20} className="text-white/80" />
              </div>
              <div>
                <p className="text-[#D8F3DC] text-xs font-semibold uppercase tracking-wider">Admin Portal</p>
                <h1 className="text-xl font-display font-bold text-white">Reports & Moderation</h1>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Reports', value: '3', icon: AlertTriangleIcon, gradient: 'from-[#8B5E3C] to-[#C19A6B]' },
            { label: 'Pending', value: '1', icon: MessageCircleIcon, gradient: 'from-[#0077B6] to-[#00B4D8]' },
            { label: 'Resolved', value: '1', icon: CheckCircleIcon, gradient: 'from-[#40916C] to-[#52B788]' },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
                <item.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-[#1B4332]">{item.value}</p>
                <p className="text-xs text-[#40916C]/60 font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reports List */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[rgba(64,145,108,0.1)] flex items-center gap-3">
            <SearchIcon size={18} className="text-[#40916C]/50" />
            <input
              type="text"
              placeholder="Search reports..."
              className="flex-1 bg-transparent text-[#1B4332] placeholder:text-[#40916C]/40 outline-none text-sm"
            />
          </div>

          {reports.map((report, i) => (
            <div key={report.id} className={`p-5 flex items-center gap-4 hover:bg-[#D8F3DC]/20 transition-colors ${i < reports.length - 1 ? 'border-b border-[rgba(64,145,108,0.08)]' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${report.severity === 'high' ? 'bg-[#F4E4D4]' : report.severity === 'medium' ? 'bg-[#CAF0F8]' : 'bg-[#D8F3DC]'}`}>
                <AlertTriangleIcon size={18} className={report.severity === 'high' ? 'text-[#8B5E3C]' : report.severity === 'medium' ? 'text-[#0077B6]' : 'text-[#40916C]'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getSeverityStyle(report.severity)}`}>
                    {report.severity}
                  </span>
                  <span className="text-xs text-[#40916C]/40">{report.type}</span>
                </div>
                <p className="text-sm font-semibold text-[#1B4332] truncate">{report.title}</p>
                <p className="text-xs text-[#40916C]/50 mt-0.5">{report.time}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold ${getStatusStyle(report.status)}`}>{report.status}</span>
                <ChevronRightIcon size={16} className="text-[#40916C]/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Note */}
        <div className="mt-6 glass-card rounded-2xl p-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-3">
            <ShieldIcon size={22} className="text-[#40916C]" />
          </div>
          <h3 className="font-semibold text-[#1B4332] mb-1">Full Moderation Tools</h3>
          <p className="text-sm text-[#40916C]/60">Advanced flagging, automated moderation, and community health dashboards — coming soon.</p>
        </div>
      </div>
    </div>
  );
}