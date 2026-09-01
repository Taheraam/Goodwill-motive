'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import api from '@/lib/api';
import { BookOpenIcon, MessageCircleIcon, CalculatorIcon, FlaskIcon, GlobeIcon, CpuIcon, HelpCircleIcon, SparklesIcon, ArrowRightIcon } from '@/lib/icons';
import AskQuestionModal from '@/components/AskQuestionModal';
import { CardSkeleton } from '@/components/Skeleton';
import { toast } from 'sonner';

interface Quiz { id: string; title: string; difficulty: string; contributionValue: number; category: { name: string } | null; }
interface Question { id: string; title: string; content: string; _count: { answers: number }; }

const categoryConfigs = [
  { type: 'math', icon: CalculatorIcon, gradient: 'from-[#0077B6] to-[#00B4D8]', label: 'Math' },
  { type: 'science', icon: FlaskIcon, gradient: 'from-[#40916C] to-[#52B788]', label: 'Science' },
  { type: 'tech', icon: CpuIcon, gradient: 'from-[#8B5E3C] to-[#C19A6B]', label: 'Tech' },
  { type: 'geo', icon: GlobeIcon, gradient: 'from-[#1B4332] to-[#40916C]', label: 'Geography' },
];

import { useQuery } from '@tanstack/react-query';

export default function LearnPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'qa'>('quizzes');
  const [showAskModal, setShowAskModal] = useState(false);

  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await api.get('/quizzes');
      return res.data as Quiz[];
    },
  });

  const { data: questions = [], isLoading: qaLoading, refetch: fetchQuestions } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await api.get('/questions');
      return res.data as Question[];
    },
  });

  const getDifficultyColor = (d: string) => d === 'beginner' ? 'bg-[#D8F3DC] text-[#40916C]' : 'bg-[#F4E4D4] text-[#8B5E3C]';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] flex items-center justify-center">
              <BookOpenIcon size={16} className="text-[#1B4332]" />
            </div>
            <span className="text-xs font-bold text-[#40916C] uppercase tracking-wider">Social Academy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1B4332] tracking-tight">
            Learn, Teach & Earn Impact
          </h1>
          <p className="text-xs sm:text-sm text-[#40916C]/70 mt-1 font-medium">
            Test your knowledge through quizzes and participate in peer-to-peer Q&A.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 p-1.5 glass-strong rounded-2xl border border-[rgba(64,145,108,0.15)] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'quizzes'
                ? 'bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-md shadow-[#1B4332]/20'
                : 'text-[#40916C]/70 hover:text-[#1B4332] hover:bg-[#40916C]/10'
            }`}
          >
            <BookOpenIcon size={16} />
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'qa'
                ? 'bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-md shadow-[#1B4332]/20'
                : 'text-[#40916C]/70 hover:text-[#1B4332] hover:bg-[#40916C]/10'
            }`}
          >
            <HelpCircleIcon size={16} />
            Community Q&A
          </button>
        </div>
      </div>

      {/* Category Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categoryConfigs.map((cat) => (
          <div
            key={cat.type}
            className="group glass-card rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border border-[rgba(64,145,108,0.12)]"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
              <cat.icon size={18} />
            </div>
            <div>
              <p className="font-display font-bold text-[#1B4332] text-sm">{cat.label}</p>
              <span className="text-[10px] font-semibold text-[#40916C]/70">Explore</span>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'quizzes' ? (
        <div className="space-y-4">
          <h2 className="text-lg font-display font-bold text-[#1B4332] flex items-center gap-2">
            <span>Featured Quizzes</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-xs font-bold text-[#1B4332]">
              {quizzes.length}
            </span>
          </h2>

          {quizzesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <BookOpenIcon size={24} className="text-[#40916C]" />
              </div>
              <p className="text-base font-bold text-[#1B4332]">No quizzes available yet</p>
              <p className="text-xs text-[#40916C]/70 mt-1">Check back soon for newly published community lessons!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => toast.info('Starting quiz interface...')}
                  className="group glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#40916C]/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-[rgba(64,145,108,0.12)] space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <BookOpenIcon size={22} className="text-[#1B4332]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                          {quiz.category?.name ?? 'General'}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-[#1B4332] text-base group-hover:text-[#40916C] transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-[#40916C]/70 mt-1 font-medium">
                        Answer questions to earn contribution points towards real aid.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(64,145,108,0.1)]">
                    <div className="flex items-center gap-1.5">
                      <SparklesIcon size={14} className="text-[#40916C]" />
                      <span className="text-xs font-bold text-[#1B4332]">+{quiz.contributionValue} Contribution XP</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#40916C] group-hover:text-[#1B4332] group-hover:translate-x-1 transition-all">
                      Start Quiz <ArrowRightIcon size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-[#1B4332] flex items-center gap-2">
              <span>Community Questions</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EDE2D3] text-xs font-bold text-[#8B5E3C]">
                {questions.length}
              </span>
            </h2>
            <button
              onClick={() => setShowAskModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white text-xs font-bold rounded-full shadow-md shadow-[#1B4332]/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <HelpCircleIcon size={14} />
              Ask a Question
            </button>
          </div>

          {qaLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EDE2D3] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <HelpCircleIcon size={24} className="text-[#8B5E3C]" />
              </div>
              <p className="text-base font-bold text-[#1B4332]">No questions asked yet</p>
              <p className="text-xs text-[#40916C]/70 mt-1">Be the first to post a doubt or help someone learn!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="group glass-card rounded-3xl p-5 hover:shadow-md hover:border-[#40916C]/30 hover:-translate-y-0.5 transition-all border border-[rgba(64,145,108,0.12)] space-y-2 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EDE2D3] flex items-center justify-center text-[#8B5E3C] shrink-0">
                        <MessageCircleIcon size={16} />
                      </div>
                      <h3 className="font-display font-bold text-[#1B4332] text-sm sm:text-base group-hover:text-[#40916C] transition-colors">
                        {q.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#D8F3DC] text-[11px] font-bold text-[#1B4332] shrink-0">
                      {q._count?.answers ?? 0} answers
                    </span>
                  </div>
                  <p className="text-xs text-[#40916C]/70 line-clamp-2 leading-relaxed font-medium pl-12">
                    {q.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ask & Answer Bottom Banner */}
      <div className="glass-card rounded-3xl p-6 border border-[rgba(64,145,108,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D8F3DC] to-[#F4E4D4] flex items-center justify-center shadow-sm shrink-0">
            <SparklesIcon size={22} className="text-[#1B4332]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[#1B4332] text-base">Have a Question or Know an Answer?</h2>
            <p className="text-xs text-[#40916C]/70 font-medium">Earn contribution XP for answering community questions.</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowAskModal(true)}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white font-bold text-xs rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Ask a Question
          </button>
        </div>
      </div>

      <AskQuestionModal open={showAskModal} onClose={() => setShowAskModal(false)} onSuccess={fetchQuestions} />
    </div>
  );
}