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

export default function LearnPage() {
  const { user } = useAuthStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'qa'>('quizzes');
  const [showAskModal, setShowAskModal] = useState(false);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [qaLoading, setQaLoading] = useState(true);

  const fetchQuestions = () => {
    setQaLoading(true);
    api.get('/questions').then(r => setQuestions(r.data)).catch(() => {}).finally(() => setQaLoading(false));
  };

  useEffect(() => {
    api.get('/quizzes').then(r => setQuizzes(r.data)).catch(() => {}).finally(() => setQuizzesLoading(false));
    fetchQuestions();
  }, []);

  const getDifficultyColor = (d: string) => d === 'beginner' ? 'bg-[#D8F3DC] text-[#40916C]' : 'bg-[#F4E4D4] text-[#8B5E3C]';

  return (
    <div className="px-4 pt-6 pb-4 space-y-6 stagger-children">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#1B4332]">Learn</h1>
        <p className="text-sm text-[#40916C]/70 mt-1">Choose a category and start growing.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 glass-card rounded-2xl">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'quizzes' ? 'bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white shadow-md' : 'text-[#40916C]/60 hover:text-[#40916C]'
          }`}
        >
          <BookOpenIcon size={16} />
          Quizzes
        </button>
        <button
          onClick={() => setActiveTab('qa')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'qa' ? 'bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white shadow-md' : 'text-[#40916C]/60 hover:text-[#40916C]'
          }`}
        >
          <HelpCircleIcon size={16} />
          Q&A
        </button>
      </div>

      {activeTab === 'quizzes' ? (
        <div>
          {quizzesLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon size={24} className="text-[#40916C]" />
              </div>
              <p className="text-sm text-[#40916C]/60">No quizzes available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div key={quiz.id} onClick={() => toast.info('Quiz taking coming soon!')} className="glass-card rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center shrink-0">
                      <BookOpenIcon size={20} className="text-[#1B4332]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1B4332] text-sm">{quiz.title}</h3>
                      <p className="text-xs text-[#40916C]/60 mt-0.5">{quiz.category?.name ?? 'General'} · {quiz.difficulty}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                        <span className="text-xs font-bold text-[#40916C]">+{quiz.contributionValue} pts</span>
                      </div>
                    </div>
                    <ArrowRightIcon size={18} className="text-[#40916C]/40 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {qaLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : questions.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] flex items-center justify-center mx-auto mb-4">
                <HelpCircleIcon size={24} className="text-[#40916C]" />
              </div>
              <p className="text-sm text-[#40916C]/60">No questions yet. Be the first to ask!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="glass-card rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] flex items-center justify-center shrink-0">
                      <MessageCircleIcon size={18} className="text-[#40916C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1B4332] text-sm">{q.title}</h3>
                      <p className="text-xs text-[#40916C]/60 mt-1 line-clamp-2">{q.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-[#40916C] font-medium flex items-center gap-1">
                          <MessageCircleIcon size={12} />
                          {q._count.answers} answers
                        </span>
                      </div>
                    </div>
                    <ArrowRightIcon size={16} className="text-[#40916C]/40 shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ask & Answer CTA */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8F3DC] to-[#F4E4D4] flex items-center justify-center">
            <SparklesIcon size={20} className="text-[#1B4332]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#1B4332]">Ask or Answer</h2>
            <p className="text-xs text-[#40916C]/60">Help the community grow</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAskModal(true)} className="flex-1 py-3 glass border border-[rgba(64,145,108,0.15)] text-[#8B5E3C] font-semibold rounded-xl text-sm hover:bg-[#F4E4D4]/30 transition-all duration-300">
            Ask Question
          </button>
          <button onClick={() => setActiveTab('qa')} className="flex-1 py-3 bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white font-semibold rounded-xl text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Browse Questions
          </button>
        </div>
      </div>

      <AskQuestionModal open={showAskModal} onClose={() => setShowAskModal(false)} onSuccess={fetchQuestions} />
    </div>
  );
}