'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { XIcon, SendIcon, HelpCircleIcon } from '@/lib/icons';

interface AskQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AskQuestionModal({ open, onClose, onSuccess }: AskQuestionModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/questions', { title, content });
      toast.success('Question posted!');
      setTitle('');
      setContent('');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative glass-strong rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center">
              <HelpCircleIcon size={20} className="text-[#1B4332]" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-[#1B4332]">Ask a Question</h2>
              <p className="text-xs text-[#40916C]/60">Share your doubt with the community</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#40916C]/40 hover:text-[#40916C] transition-colors rounded-xl hover:bg-[#D8F3DC]/30">
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What's your question?"
            required
            maxLength={255}
            className="w-full px-4 py-3 rounded-xl border border-[rgba(64,145,108,0.15)] bg-white/60 backdrop-blur-sm text-[#1B4332] placeholder:text-[#40916C]/40 focus:border-[#40916C] focus:bg-white/80 focus:ring-4 focus:ring-[#40916C]/10 outline-none transition-all text-sm"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Provide some details..."
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-[rgba(64,145,108,0.15)] bg-white/60 backdrop-blur-sm text-[#1B4332] placeholder:text-[#40916C]/40 focus:border-[#40916C] focus:bg-white/80 focus:ring-4 focus:ring-[#40916C]/10 outline-none transition-all text-sm resize-none"
          />
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 glass rounded-xl text-sm font-semibold text-[#40916C]/70 hover:text-[#40916C] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white rounded-xl text-sm font-semibold hover:shadow-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting...</>
              ) : (
                <><SendIcon size={15} /> Post Question</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}