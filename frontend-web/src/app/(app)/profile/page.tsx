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
    <div className="px-4 pt-6 pb-4 space-y-6 stagger-children">
      {/* Profile Header */}
      <div className="relative rounded-2xl overflow-hidden glass-card">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332]/95 to-[#40916C]/80" />
        <div className="relative p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <UserIcon size={28} className="text-white/80" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-display font-bold text-white">{user?.username ?? 'New User'}</h1>
              <p className="text-white/60 text-sm">{user?.email ?? 'user@example.com'}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold text-white">
                <AwardIcon size={12} />
                {user?.role ?? 'user'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur text-white/70 hover:text-white transition-all duration-300"
            >
              <LogOutIcon size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: TrophyIcon, label: 'Contribution Score', value: stats?.contributionScore ?? user?.contributionScore ?? 0, color: 'text-[#52B788]' },
              { icon: FlameIcon, label: 'Day Streak', value: stats?.streakCount ?? user?.streakCount ?? 0, color: 'text-[#C19A6B]' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <item.icon size={18} className={item.color} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-white">{item.value}</p>
                  <p className="text-[10px] text-white/50 font-medium uppercase tracking-wide">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-base font-semibold text-[#1B4332] mb-3 flex items-center gap-2">
          <BarChartIcon size={16} className="text-[#40916C]" />
          Activity Statistics
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {loading ? (
            <>
              {[1,2,3,4].map(i => <StatSkeleton key={i} />)}
            </>
          ) : (
            statCards.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <p className="text-2xl font-display font-bold text-[#1B4332]">{s.value}</p>
                <p className="text-xs text-[#40916C]/60 mt-1">{s.label}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card rounded-2xl p-5">
        <h2 className="text-base font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
          <AwardIcon size={16} className="text-[#C19A6B]" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4E4D4] flex items-center justify-center">
              <TrendingUpIcon size={18} className="text-[#8B5E3C]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1B4332]">Longest Streak</p>
              <p className="text-lg font-display font-bold text-[#40916C]">{stats?.longestStreak ?? user?.longestStreak ?? 0}</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <TrophyIcon size={18} className="text-[#40916C]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1B4332]">Reputation</p>
              <p className="text-lg font-display font-bold text-[#40916C]">{stats?.reputationScore ?? user?.reputationScore ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Impact */}
      <div className="glass-card rounded-2xl p-5">
        <h2 className="text-base font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
          <LeafIcon size={16} className="text-[#40916C]" />
          Total Impact
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Meals Funded', value: Math.floor((stats?.contributionScore ?? 0) / 100) },
            { label: 'Knowledge Shared', value: (stats?.answerCount ?? 0) * 10 },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#D8F3DC]/50 to-[#F4E4D4]/30">
              <p className="text-3xl font-display font-bold text-[#40916C]">{item.value}</p>
              <p className="text-xs text-[#8B5E3C] mt-1 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <button className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all duration-300">
        <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
          <SettingsIcon size={18} className="text-[#40916C]" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-[#1B4332] text-sm">Account Settings</p>
          <p className="text-xs text-[#40916C]/60">Manage your profile and preferences</p>
        </div>
        <div className="ml-auto">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#40916C" strokeWidth={2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>
    </div>
  );
}