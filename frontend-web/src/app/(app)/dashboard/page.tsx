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

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/missions').then(r => setMissions(r.data.slice(0, 3))).catch(() => {}),
      api.get('/impact/campaigns').then(r => setCampaigns(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between stagger-children">
        <div>
          <p className="text-sm text-[#40916C]/70 font-medium">{greeting},</p>
          <h1 className="text-2xl font-display font-bold text-[#1B4332]">{user?.username ?? 'New User'}</h1>
          <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full glass-card text-xs font-semibold text-[#1B4332]">
            <SparklesIcon size={12} className="text-[#40916C]" />
            {user?.role ?? 'user'}
          </span>
        </div>

        {/* Streak Badge */}
        <div className="glass-card rounded-2xl px-4 py-3 text-center">
          <div className="flex items-center gap-1.5 mb-0.5">
            <FlameIcon size={18} className="text-[#C19A6B]" />
            <span className="text-2xl font-display font-bold text-[#8B5E3C]">{user?.streakCount ?? 0}</span>
          </div>
          <p className="text-[10px] font-medium text-[#8B5E3C]/60 uppercase tracking-wide">day streak</p>
        </div>
      </div>

      {/* Contribution Score Card */}
      <div className="relative rounded-2xl overflow-hidden glass-card">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/90 to-[#40916C]/80" />
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Contribution Score</p>
            <p className="text-5xl font-display font-bold text-white">{(user?.contributionScore ?? 0).toLocaleString()}</p>
            <div className="flex items-center gap-1.5 mt-3">
              <TrendingUpIcon size={14} className="text-[#52B788]" />
              <span className="text-xs text-white/70 font-medium">Keep going! You're making an impact.</span>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <LeafIcon size={28} className="text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1B4332]">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={`bg-gradient-to-br ${a.gradient} rounded-2xl p-5 text-white flex flex-col items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <a.icon size={24} />
              </div>
              <span className="text-sm font-semibold">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Missions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1B4332] flex items-center gap-2">
            <TargetIcon size={16} className="text-[#40916C]" />
            Available Missions
          </h2>
          <Link href="/missions" className="text-xs text-[#40916C] font-medium hover:text-[#1B4332] flex items-center gap-1">
            View all <ArrowRightIcon size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : missions.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-3">
              <TargetIcon size={20} className="text-[#40916C]" />
            </div>
            <p className="text-sm text-[#40916C]/60">No missions available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {missions.map((m) => (
              <div key={m.id} className="glass-card rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center">
                    <TargetIcon size={18} className="text-[#1B4332]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1B4332] text-sm">{m.title}</p>
                    <p className="text-xs text-[#40916C]/60">{m.missionType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#40916C]">+{m.contributionReward}</span>
                  <ArrowRightIcon size={16} className="text-[#40916C]/40" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Impact Campaigns */}
      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : campaigns.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#1B4332] flex items-center gap-2">
              <TrophyIcon size={16} className="text-[#C19A6B]" />
              Impact Campaigns
            </h2>
            <Link href="/impact" className="text-xs text-[#40916C] font-medium hover:text-[#1B4332] flex items-center gap-1">
              View all <ArrowRightIcon size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            {campaigns.map((c) => {
              const pct = c.targetAmount > 0 ? Math.round((c.currentAmount / c.targetAmount) * 100) : 0;
              return (
                <div key={c.id} className="glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#1B4332]">{c.name}</p>
                    <span className="text-xs font-bold text-[#40916C]">{pct}%</span>
                  </div>
                  <div className="bg-[#D8F3DC] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1B4332] to-[#40916C] rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-[#40916C]/60">{c.currentAmount} {c.unit}</span>
                    <span className="text-xs text-[#40916C]/60">Goal: {c.targetAmount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Streak & Achievement Summary */}
      <div className="glass-card rounded-2xl p-5 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-[#F4E4D4] flex items-center justify-center mx-auto mb-2">
            <FlameIcon size={18} className="text-[#8B5E3C]" />
          </div>
          <p className="text-2xl font-display font-bold text-[#1B4332]">{user?.streakCount ?? 0}</p>
          <p className="text-xs text-[#40916C]/60 mt-1">Day Streak</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-2">
            <TrophyIcon size={18} className="text-[#40916C]" />
          </div>
          <p className="text-2xl font-display font-bold text-[#1B4332]">{user?.longestStreak ?? 0}</p>
          <p className="text-xs text-[#40916C]/60 mt-1">Best Streak</p>
        </div>
      </div>
    </div>
  );
}