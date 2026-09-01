'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import api from '@/lib/api';
import { FlameIcon, LeafIcon, TargetIcon, CheckCircleIcon, ArrowRightIcon, SparklesIcon } from '@/lib/icons';
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <TargetIcon size={16} className="text-[#1B4332]" />
            </div>
            <span className="text-xs font-bold text-[#40916C] uppercase tracking-wider">Missions Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1B4332] tracking-tight">
            Active Community Missions
          </h1>
          <p className="text-xs sm:text-sm text-[#40916C]/70 mt-1 font-medium">
            Complete daily quests, earn XP, and unlock humanitarian impact milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-strong rounded-2xl px-4 py-2.5 flex items-center gap-2.5 border border-[#40916C]/20">
            <span className="text-xs text-[#2D6A4F]/70 font-semibold">Available:</span>
            <span className="text-base font-display font-bold text-[#1B4332]">{missions.length}</span>
          </div>
        </div>
      </div>

      {/* Streak Calendar Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-[#8B5E3C]/10 glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5E3C] via-[#9C6B45] to-[#C19A6B]" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-wider mb-2">
                <FlameIcon size={12} className="text-[#FFD54F]" />
                Daily Consistency
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
                  {user?.streakCount ?? 0}
                </span>
                <span className="text-white/80 font-bold text-sm">Days Active</span>
              </div>
              <p className="text-[#F4E4D4]/90 text-xs sm:text-sm mt-1 font-medium">
                Keep the momentum going by completing a quest today!
              </p>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <LeafIcon size={32} className="text-white/90" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2 max-w-md">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
              const isComplete = i < ((user?.streakCount ?? 0) % 7);
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isComplete
                        ? 'bg-white text-[#8B5E3C] shadow-md shadow-black/10 scale-105'
                        : 'bg-white/15 text-white/70 border border-white/20'
                    }`}
                  >
                    {isComplete ? <CheckCircleIcon size={16} /> : d.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold text-[#F4E4D4]/80 tracking-tight">{d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-[#1B4332] flex items-center gap-2">
          <span>Available Quests</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-xs font-bold text-[#1B4332]">
            {missions.length}
          </span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <TargetIcon size={24} className="text-[#40916C]" />
            </div>
            <p className="text-base font-bold text-[#1B4332]">All Missions Completed!</p>
            <p className="text-xs text-[#40916C]/70 mt-1 max-w-sm mx-auto">
              You have completed all available missions for today. Check back tomorrow for fresh rewards.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map((m) => (
              <div
                key={m.id}
                className="group glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#40916C]/30 hover:-translate-y-1 transition-all duration-300 border border-[rgba(64,145,108,0.12)] space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <TargetIcon size={22} className="text-[#1B4332]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                        {m.missionType}
                      </span>
                      {m.isDaily && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EDE2D3] text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                          Daily
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-[#1B4332] text-base group-hover:text-[#40916C] transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-[#40916C]/70 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[rgba(64,145,108,0.1)]">
                  <div className="flex items-center gap-1.5">
                    <SparklesIcon size={14} className="text-[#40916C]" />
                    <span className="text-xs font-bold text-[#1B4332]">+{m.contributionReward} XP Points</span>
                  </div>
                  <button
                    onClick={() => handleComplete(m.id)}
                    className="px-4 py-2 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white text-xs font-bold rounded-full shadow-md shadow-[#1B4332]/20 hover:shadow-lg hover:shadow-[#1B4332]/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    Complete Quest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}