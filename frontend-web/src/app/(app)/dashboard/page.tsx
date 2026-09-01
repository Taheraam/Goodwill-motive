'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import api from '@/lib/api';
import { ArrowRightIcon, FlameIcon, TrophyIcon, SparklesIcon, TargetIcon, BookOpenIcon, MessageCircleIcon, LeafIcon, TrendingUpIcon, CheckCircleIcon } from '@/lib/icons';
import { CardSkeleton, StatSkeleton } from '@/components/Skeleton';

const quickActions = [
  { label: 'Take a Quiz', icon: BookOpenIcon, href: '/learn', gradient: 'from-[#0077B6] to-[#00B4D8]' },
  { label: 'Ask a Question', icon: MessageCircleIcon, href: '/learn', gradient: 'from-[#8B5E3C] to-[#C19A6B]' },
  { label: 'Answer Doubts', icon: SparklesIcon, href: '/learn', gradient: 'from-[#40916C] to-[#52B788]' },
  { label: 'View Impact', icon: LeafIcon, href: '/impact', gradient: 'from-[#1B4332] to-[#40916C]' },
];

interface Mission { id: string; title: string; contributionReward: number; missionType: string; }
interface Campaign { id: string; name: string; currentAmount: number; targetAmount: number; unit: string; }

import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: missions = [], isLoading: loadingMissions } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const res = await api.get('/missions');
      return res.data.slice(0, 3) as Mission[];
    },
  });

  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await api.get('/impact/campaigns');
      return res.data as Campaign[];
    },
  });

  const loading = loadingMissions || loadingCampaigns;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Header Profile Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] flex items-center justify-center text-white font-display font-bold text-2xl shadow-md shadow-[#1B4332]/20">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-[#40916C] font-bold uppercase tracking-wider">{greeting}</p>
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
              <span className="text-xs text-[#2D6A4F]/70 font-semibold">{user?.role ?? 'Member'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1B4332] tracking-tight">
              {user?.username ?? 'Goodwill Hero'}
            </h1>
          </div>
        </div>

        {/* Streak & Reputation Stats */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="glass-strong rounded-2xl px-4 py-2.5 flex items-center gap-2.5 border border-[#C19A6B]/20">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFD54F] to-[#FFA726] flex items-center justify-center text-white shadow-sm">
              <FlameIcon size={16} />
            </div>
            <div>
              <p className="text-lg font-display font-bold text-[#8B5E3C] leading-none">{user?.streakCount ?? 0}</p>
              <p className="text-[10px] font-bold text-[#8B5E3C]/70 uppercase tracking-wider">Day Streak</p>
            </div>
          </div>

          <div className="glass-strong rounded-2xl px-4 py-2.5 flex items-center gap-2.5 border border-[#40916C]/20">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center text-white shadow-sm">
              <TrophyIcon size={16} />
            </div>
            <div>
              <p className="text-lg font-display font-bold text-[#1B4332] leading-none">{user?.reputationScore ?? 0}</p>
              <p className="text-[10px] font-bold text-[#40916C]/70 uppercase tracking-wider">Reputation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid for Desktop (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contribution Score Banner */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-[#1B4332]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] via-[#245942] to-[#40916C]" />
            <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-wider mb-2">
                  <SparklesIcon size={12} className="text-[#9FD4B4]" />
                  Impact Metric
                </span>
                <p className="text-5xl sm:text-6xl font-display font-bold text-white tracking-tight">
                  {(user?.contributionScore ?? 0).toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-5 h-5 rounded-full bg-[#52B788]/20 flex items-center justify-center">
                    <TrendingUpIcon size={12} className="text-[#9FD4B4]" />
                  </div>
                  <span className="text-xs text-white/80 font-medium">
                    Every point directly funds real humanitarian aid campaigns.
                  </span>
                </div>
              </div>

              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner self-end sm:self-center">
                <LeafIcon size={36} className="text-[#9FD4B4]" />
              </div>
            </div>
          </div>

          {/* Available Missions */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
                  <TargetIcon size={16} className="text-[#1B4332]" />
                </div>
                <h2 className="text-lg font-display font-bold text-[#1B4332]">Recommended Missions</h2>
              </div>
              <Link href="/missions" className="text-xs font-bold text-[#40916C] hover:text-[#1B4332] flex items-center gap-1">
                View all <ArrowRightIcon size={12} />
              </Link>
            </div>

            {loadingMissions ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : missions.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-3">
                  <TargetIcon size={20} className="text-[#40916C]" />
                </div>
                <p className="text-sm font-semibold text-[#1B4332]">All caught up!</p>
                <p className="text-xs text-[#40916C]/70 mt-1">Check back later for newly unlocked community missions.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {missions.map((m) => (
                  <Link
                    key={m.id}
                    href="/missions"
                    className="group glass-strong rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:border-[#40916C]/40 hover:-translate-y-0.5 transition-all duration-300 border border-[rgba(64,145,108,0.12)]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center group-hover:scale-105 transition-all">
                        <TargetIcon size={18} className="text-[#1B4332]" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-[#1B4332] text-sm group-hover:text-[#40916C] transition-colors">
                          {m.title}
                        </p>
                        <span className="text-[11px] font-semibold text-[#40916C]/70 uppercase tracking-wide">
                          {m.missionType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#D8F3DC] text-xs font-bold text-[#1B4332]">
                        +{m.contributionReward} XP
                      </span>
                      <ArrowRightIcon size={14} className="text-[#40916C]/40 group-hover:text-[#1B4332] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span on desktop) */}
        <div className="space-y-6">
          {/* Quick Actions Grid */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-display font-bold text-[#1B4332]">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className={`bg-gradient-to-br ${a.gradient} rounded-2xl p-4 text-white flex flex-col items-center text-center gap-2.5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <a.icon size={20} />
                  </div>
                  <span className="text-xs font-bold leading-tight">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Campaigns Progress */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EDE2D3] flex items-center justify-center">
                  <LeafIcon size={16} className="text-[#8B5E3C]" />
                </div>
                <h2 className="text-lg font-display font-bold text-[#1B4332]">Live Impact</h2>
              </div>
              <Link href="/impact" className="text-xs font-bold text-[#40916C] hover:text-[#1B4332] flex items-center gap-1">
                Details <ArrowRightIcon size={12} />
              </Link>
            </div>

            {loadingCampaigns ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <p className="text-xs text-[#40916C]/60 text-center py-4">No active campaigns running.</p>
            ) : (
              <div className="space-y-4">
                {campaigns.slice(0, 2).map((c) => {
                  const pct = c.targetAmount > 0 ? Math.round((c.currentAmount / c.targetAmount) * 100) : 0;
                  return (
                    <div key={c.id} className="glass-strong rounded-2xl p-4 border border-[rgba(64,145,108,0.1)] space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#1B4332] truncate max-w-[150px]">{c.name}</p>
                        <span className="text-xs font-bold text-[#40916C]">{pct}%</span>
                      </div>
                      <div className="bg-[#D8F3DC] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1B4332] to-[#40916C] rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#40916C]/70 font-semibold">
                        <span>{c.currentAmount.toLocaleString()} {c.unit}</span>
                        <span>Goal: {c.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}