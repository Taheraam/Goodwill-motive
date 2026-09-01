'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import api from '@/lib/api';
import { UserIcon, LogOutIcon, FlameIcon, TrophyIcon, AwardIcon, TrendingUpIcon, LeafIcon, MessageCircleIcon, TargetIcon, SettingsIcon, BarChartIcon } from '@/lib/icons';
import { CardSkeleton, StatSkeleton } from '@/components/Skeleton';

interface UserStats {
  contributionScore: number;
  streakCount: number;
  longestStreak: number;
  reputationScore: number;
  quizCount: number;
  questionCount: number;
  answerCount: number;
  missionCount: number;
}

import { useQuery } from '@tanstack/react-query';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const { data: stats, isLoading: loading } = useQuery({
    queryKey: ['profileStats'],
    queryFn: async () => {
      const res = await api.get('/contributions/me');
      return res.data as UserStats;
    },
  });

  const handleLogout = () => { logout(); router.push('/login'); };

  const statCards = [
    { icon: TargetIcon, label: 'Quizzes Completed', value: stats?.quizCount ?? 0, color: 'text-[#0077B6]', bg: 'bg-[#E6F4FC]' },
    { icon: MessageCircleIcon, label: 'Questions Asked', value: stats?.questionCount ?? 0, color: 'text-[#8B5E3C]', bg: 'bg-[#F4E4D4]' },
    { icon: AwardIcon, label: 'Answers Given', value: stats?.answerCount ?? 0, color: 'text-[#40916C]', bg: 'bg-[#D8F3DC]' },
    { icon: TargetIcon, label: 'Missions Done', value: stats?.missionCount ?? 0, color: 'text-[#0077B6]', bg: 'bg-[#E6F4FC]' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-[#1B4332]/10 glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] via-[#245942] to-[#40916C]" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-display font-bold text-3xl shadow-inner">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                    {user?.role ?? 'Member'}
                  </span>
                  <span className="text-white/70 text-xs font-semibold">Joined Member</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {user?.username ?? 'Goodwill Hero'}
                </h1>
                <p className="text-white/80 text-xs sm:text-sm font-medium">{user?.email ?? 'user@example.com'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <LogOutIcon size={16} />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg">
            {[
              { icon: TrophyIcon, label: 'Contribution Score', value: stats?.contributionScore ?? user?.contributionScore ?? 0, color: 'text-[#9FD4B4]' },
              { icon: FlameIcon, label: 'Day Streak', value: stats?.streakCount ?? user?.streakCount ?? 0, color: 'text-[#FFD54F]' },
            ].map((item, i) => (
              <div key={i} className="glass-strong rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 border border-white/15">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                  <item.icon size={20} className={item.color} />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white leading-none tracking-tight">
                    {item.value.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider mt-1">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Statistics */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <BarChartIcon size={16} className="text-[#1B4332]" />
            </div>
            <h2 className="text-lg font-display font-bold text-[#1B4332]">Activity Breakdown</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <StatSkeleton key={i} />
                ))}
              </>
            ) : (
              statCards.map((s, i) => (
                <div
                  key={i}
                  className="glass-strong rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-[rgba(64,145,108,0.1)]"
                >
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2.5`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  <p className="text-2xl font-display font-bold text-[#1B4332]">{s.value}</p>
                  <p className="text-[11px] font-bold text-[#40916C]/70 mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Milestones & Total Impact */}
        <div className="space-y-6">
          {/* Achievements Cards */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EDE2D3] flex items-center justify-center">
                <AwardIcon size={16} className="text-[#8B5E3C]" />
              </div>
              <h2 className="text-lg font-display font-bold text-[#1B4332]">Milestones & Rank</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 border border-[rgba(64,145,108,0.1)]">
                <div className="w-10 h-10 rounded-xl bg-[#F4E4D4] flex items-center justify-center shrink-0">
                  <TrendingUpIcon size={18} className="text-[#8B5E3C]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#8B5E3C]/80 uppercase tracking-wider">Best Streak</p>
                  <p className="text-xl font-display font-bold text-[#1B4332]">
                    {stats?.longestStreak ?? user?.longestStreak ?? 0} days
                  </p>
                </div>
              </div>

              <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 border border-[rgba(64,145,108,0.1)]">
                <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] flex items-center justify-center shrink-0">
                  <TrophyIcon size={18} className="text-[#40916C]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#40916C]/80 uppercase tracking-wider">Reputation</p>
                  <p className="text-xl font-display font-bold text-[#1B4332]">
                    {stats?.reputationScore ?? user?.reputationScore ?? 0} pts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings Card */}
          <div className="glass-card rounded-3xl p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer border border-[rgba(64,145,108,0.12)]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#D8F3DC] flex items-center justify-center text-[#1B4332]">
                <SettingsIcon size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-[#1B4332] text-sm">Account & Preferences</p>
                <p className="text-xs text-[#40916C]/70 font-medium">Manage notifications, email, and security</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#40916C]/10 flex items-center justify-center text-[#40916C]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}