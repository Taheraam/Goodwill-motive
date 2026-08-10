'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import api from '@/lib/api';
import { LeafIcon, FlameIcon, HeartIcon, ShieldIcon, ArrowRightIcon, TrendingUpIcon } from '@/lib/icons';
import { CardSkeleton } from '@/components/Skeleton';
import { toast } from 'sonner';

interface Campaign { id: string; name: string; description?: string; sponsor?: string; currentAmount: number; targetAmount: number; unit: string; isActive: boolean; }

import { useQuery } from '@tanstack/react-query';

export default function ImpactPage() {
  const { user } = useAuthStore();

  const { data: campaigns = [], isLoading: loading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await api.get('/impact/campaigns');
      return res.data as Campaign[];
    },
  });

  const personalMeals = user?.contributionScore ? Math.floor(user.contributionScore / 100) : 0;
  const activeCampaigns = campaigns.filter(c => c.isActive);

  return (
    <div className="px-4 pt-6 pb-4 space-y-6 stagger-children">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#1B4332]">Impact</h1>
        <p className="text-sm text-[#40916C]/70 mt-1">Your actions create real-world change.</p>
      </div>

      {/* Personal Impact Card */}
      <div className="relative rounded-2xl overflow-hidden glass-card">
        <div className="absolute inset-0 gradient-forest" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332]/95 to-[#40916C]/85" />
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUpIcon size={16} className="text-[#52B788]" />
            <p className="text-[#D8F3DC]/80 text-xs font-semibold uppercase tracking-wider">Your Personal Impact</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <LeafIcon size={22} />, value: personalMeals, label: 'Meals Funded', color: 'text-[#52B788]' },
              { icon: <FlameIcon size={22} />, value: user?.contributionScore ?? 0, label: 'Points Earned', color: 'text-[#C19A6B]' },
              { icon: <HeartIcon size={22} />, value: user?.streakCount ?? 0, label: 'Day Streak', color: 'text-[#48CAE4]' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`${item.color} flex justify-center mb-2`}>{item.icon}</div>
                <p className="text-3xl font-display font-bold text-white">{item.value}</p>
                <p className="text-xs text-[#D8F3DC]/60 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : activeCampaigns.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#1B4332] mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
              <HeartIcon size={14} className="text-[#40916C]" />
            </div>
            Active Campaigns
          </h2>
          <div className="space-y-4">
            {activeCampaigns.map((c) => {
              const pct = c.targetAmount > 0 ? Math.round((c.currentAmount / c.targetAmount) * 100) : 0;
              return (
                <div key={c.id} className="glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-[#1B4332]">{c.name}</h3>
                      {c.sponsor && <p className="text-xs text-[#40916C]/60 mt-0.5">by {c.sponsor}</p>}
                      {c.description && <p className="text-xs text-[#40916C]/60 mt-1 leading-relaxed">{c.description}</p>}
                    </div>
                    <span className="text-xs bg-[#D8F3DC] text-[#40916C] px-2.5 py-0.5 rounded-full font-semibold shrink-0">Active</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[#40916C]/60">{c.currentAmount.toLocaleString()} / {c.targetAmount.toLocaleString()} {c.unit}</span>
                      <span className="font-bold text-[#40916C]">{pct}%</span>
                    </div>
                    <div className="bg-[#D8F3DC] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1B4332] to-[#40916C] rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && activeCampaigns.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-4">
            <HeartIcon size={24} className="text-[#40916C]" />
          </div>
          <p className="text-sm text-[#40916C]/60">No active campaigns yet. Check back soon!</p>
        </div>
      )}

      {/* Transparency Promise */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
            <ShieldIcon size={20} className="text-[#40916C]" />
          </div>
          <h2 className="font-semibold text-[#1B4332]">Transparency Promise</h2>
        </div>
        <p className="text-sm text-[#40916C]/60 leading-relaxed">
          Every meal, every hour of tutoring, every educational material is tracked and verified. Our impact reports are public and auditable by anyone.
        </p>
      </div>
    </div>
  );
}