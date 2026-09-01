'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import api from '@/lib/api';
import { LeafIcon, FlameIcon, HeartIcon, ShieldIcon, UtensilsIcon, HeartHandshakeIcon, TrendingUpIcon } from '@/lib/icons';
import { CardSkeleton } from '@/components/Skeleton';
import SponsorModal from '@/components/SponsorModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  sponsor?: string;
  currentAmount: number;
  targetAmount: number;
  unit: string;
  isActive: boolean;
}

export default function ImpactPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [sponsorOpen, setSponsorOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<{ id: string; name: string } | null>(null);

  const { data: campaigns = [], isLoading: loading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await api.get('/impact/campaigns');
      return res.data as Campaign[];
    },
  });

  const personalMeals = user?.contributionScore ? Math.floor(user.contributionScore / 100) : 0;
  const activeCampaigns = campaigns.filter((c) => c.isActive);

  const handleOpenSponsor = (campaign?: { id: string; name: string }) => {
    setSelectedCampaign(campaign || null);
    setSponsorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <LeafIcon size={16} className="text-[#1B4332]" />
            </div>
            <span className="text-xs font-bold text-[#40916C] uppercase tracking-wider">
              Humanitarian Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1B4332] tracking-tight">
            Measurable Real-World Impact
          </h1>
          <p className="text-xs sm:text-sm text-[#40916C]/70 mt-1 font-medium">
            Every correct quiz answer, question answered, and quest completed converts directly into verified aid.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => handleOpenSponsor()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white font-display font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <HeartHandshakeIcon size={16} />
            Sponsor Meals Directly
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#D8F3DC] text-xs font-bold text-[#1B4332]">
            <ShieldIcon size={14} className="text-[#40916C]" />
            100% Audited
          </span>
        </div>
      </div>

      {/* Personal Impact Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-[#1B4332]/10 glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] via-[#245942] to-[#40916C]" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUpIcon size={16} className="text-[#9FD4B4]" />
              <p className="text-[#D8F3DC]/90 text-xs font-bold uppercase tracking-wider">
                Your Personal Impact
              </p>
            </div>
            <button
              onClick={() => handleOpenSponsor()}
              className="text-xs font-bold text-[#FFD54F] hover:underline flex items-center gap-1"
            >
              + Fund More Meals
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: <UtensilsIcon size={24} />, value: personalMeals, label: 'Meals Funded', color: 'text-[#9FD4B4]' },
              { icon: <FlameIcon size={24} />, value: user?.contributionScore ?? 0, label: 'Contribution XP', color: 'text-[#FFD54F]' },
              { icon: <HeartIcon size={24} />, value: user?.streakCount ?? 0, label: 'Days Consistent', color: 'text-[#80CBED]' },
            ].map((item, i) => (
              <div key={i} className="text-center glass-strong rounded-2xl p-4 sm:p-5 border border-white/10">
                <div className={`${item.color} flex justify-center mb-2`}>{item.icon}</div>
                <p className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  {item.value.toLocaleString()}
                </p>
                <p className="text-[11px] font-bold text-[#D8F3DC]/80 mt-1 uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-[#1B4332] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <HeartIcon size={16} className="text-[#40916C]" />
            </div>
            <span>Active Humanitarian Campaigns</span>
          </h2>
          <span className="text-xs font-bold text-[#40916C]">
            {activeCampaigns.length} Active
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : activeCampaigns.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-3">
              <LeafIcon size={24} className="text-[#40916C]" />
            </div>
            <p className="text-base font-bold text-[#1B4332]">No active campaigns at this moment</p>
            <p className="text-xs text-[#40916C]/70 mt-1">
              New humanitarian initiatives are being reviewed and will launch shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCampaigns.map((c) => {
              const pct = c.targetAmount > 0 ? Math.round((c.currentAmount / c.targetAmount) * 100) : 0;
              return (
                <div
                  key={c.id}
                  className="group glass-card rounded-3xl p-6 hover:shadow-lg hover:border-[#40916C]/30 hover:-translate-y-1 transition-all duration-300 border border-[rgba(64,145,108,0.12)] space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display font-bold text-[#1B4332] text-base group-hover:text-[#40916C] transition-colors">
                        {c.name}
                      </h3>
                      {c.sponsor && (
                        <p className="text-xs font-semibold text-[#8B5E3C] mt-0.5">Sponsored by {c.sponsor}</p>
                      )}
                      {c.description && (
                        <p className="text-xs text-[#40916C]/70 mt-1.5 leading-relaxed line-clamp-2 font-medium">
                          {c.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] bg-[#D8F3DC] text-[#1B4332] px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0">
                      Live
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#40916C]/80">
                        {c.currentAmount.toLocaleString()} / {c.targetAmount.toLocaleString()} {c.unit}
                      </span>
                      <span className="font-display font-bold text-[#1B4332] text-sm">{pct}%</span>
                    </div>
                    <div className="bg-[#D8F3DC] rounded-full h-3 overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#1B4332] to-[#40916C] rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => handleOpenSponsor({ id: c.id, name: c.name })}
                      className="px-3.5 py-1.5 rounded-xl bg-[#E8F5EF] hover:bg-[#D8F3DC] text-[#1B4332] text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <UtensilsIcon size={14} className="text-[#40916C]" />
                      Sponsor This Campaign
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transparency Promise Banner */}
      <div className="glass-card rounded-3xl p-6 border border-[rgba(64,145,108,0.15)] flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#D8F3DC] flex items-center justify-center text-[#1B4332] shrink-0">
          <ShieldIcon size={24} />
        </div>
        <div>
          <h3 className="font-display font-bold text-[#1B4332] text-base">Audited Transparency Promise</h3>
          <p className="text-xs text-[#40916C]/70 mt-1 leading-relaxed font-medium">
            Every meal, tree planted, and educational grant is transparently tracked. All direct sponsorships receive an immediate digital certificate & tax receipt.
          </p>
        </div>
      </div>

      {/* Sponsor Checkout Modal */}
      <SponsorModal
        isOpen={sponsorOpen}
        onClose={() => setSponsorOpen(false)}
        campaignId={selectedCampaign?.id}
        campaignName={selectedCampaign?.name}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        }}
      />
    </div>
  );
}