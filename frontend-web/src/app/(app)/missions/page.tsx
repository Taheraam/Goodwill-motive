'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import api from '@/lib/api';
import { FlameIcon, LeafIcon, TargetIcon, CheckCircleIcon, ArrowRightIcon } from '@/lib/icons';
import { CardSkeleton } from '@/components/Skeleton';
import { toast } from 'sonner';

interface Mission { id: string; title: string; description: string; contributionReward: number; missionType: string; isDaily: boolean; }

import { useQuery } from '@tanstack/react-query';

export default function MissionsPage() {
  const { user } = useAuthStore();

  const { data: missions = [], isLoading: loading, refetch: refetchMissions } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const res = await api.get('/missions');
      return res.data as Mission[];
    },
  });

  const handleComplete = async (missionId: string) => {
    try {
      await api.post(`/missions/${missionId}/complete`);
      toast.success('Mission completed!');
      refetchMissions();
    } catch {
      toast.error('Failed to complete mission');
    }
  };

  const dailyMissions = missions.filter(m => m.isDaily);
  const allMissions = missions.filter(m => !m.isDaily);

  return (
    <div className="px-4 pt-6 pb-4 space-y-6 stagger-children">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#1B4332]">Missions</h1>
        <p className="text-sm text-[#40916C]/70 mt-1">Complete missions. Earn rewards. Create impact.</p>
      </div>

      {/* Streak Card */}
      <div className="relative rounded-2xl overflow-hidden glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5E3C] to-[#C19A6B]" />
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#F4E4D4]/80 text-xs font-semibold uppercase tracking-wider mb-1">Your Streak</p>
              <div className="flex items-center gap-2">
                <FlameIcon size={32} className="text-white/90" />
                <span className="text-5xl font-display font-bold text-white">{user?.streakCount ?? 0}</span>
              </div>
              <p className="text-[#C19A6B] text-sm mt-1">Keep it going tomorrow!</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <LeafIcon size={28} className="text-white/80" />
            </div>
          </div>
          <div className="mt-5 flex justify-between gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
              const isComplete = i < ((user?.streakCount ?? 0) % 7);
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isComplete ? 'bg-white text-[#8B5E3C] shadow-md' : 'bg-white/20 text-white/60'
                  }`}>
                    {isComplete ? <CheckCircleIcon size={14} /> : d}
                  </div>
                  <span className="text-[10px] font-medium text-[#C19A6B]">{d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Missions */}
      {dailyMissions.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#1B4332] mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F4E4D4] flex items-center justify-center">
              <FlameIcon size={14} className="text-[#8B5E3C]" />
            </div>
            Daily Missions
          </h2>
          <div className="space-y-3">
            {dailyMissions.map((m) => (
              <div key={m.id} className="glass-card rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F4E4D4] to-[#E0C8A0] flex items-center justify-center shrink-0">
                    <TargetIcon size={20} className="text-[#8B5E3C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1B4332] text-sm">{m.title}</h3>
                    <p className="text-xs text-[#40916C]/60 mt-0.5 line-clamp-1">{m.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-[#40916C]">+{m.contributionReward}</span>
                    <button onClick={() => handleComplete(m.id)} className="px-3 py-1.5 bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white text-xs font-semibold rounded-full hover:shadow-md transition-all">
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Missions */}
      {allMissions.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-[#1B4332] mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
              <LeafIcon size={14} className="text-[#40916C]" />
            </div>
            Available Missions
          </h2>
          <div className="space-y-3">
            {allMissions.map((m) => (
              <div key={m.id} className="glass-card rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center shrink-0">
                    <TargetIcon size={20} className="text-[#1B4332]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1B4332] text-sm">{m.title}</h3>
                    <p className="text-xs text-[#40916C]/60 mt-0.5 line-clamp-1">{m.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-[#40916C]">+{m.contributionReward}</span>
                    <button onClick={() => handleComplete(m.id)} className="px-3 py-1.5 bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white text-xs font-semibold rounded-full hover:shadow-md transition-all">
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : missions.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-4">
            <TargetIcon size={24} className="text-[#40916C]" />
          </div>
          <p className="text-sm text-[#40916C]/60">No missions available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}