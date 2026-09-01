'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import { BotIcon, SendIcon, SparklesIcon, LeafIcon } from '@/lib/icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedQuestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  'How does learning turn into real food?',
  'How do daily streaks and XP work?',
  'How do I sponsor meals directly?',
  'What are the community guidelines?',
];

export default function RagBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi there! 🌱 I am your **Goodwill Motive Assistant**. Ask me anything about how quizzes work, streak multipliers, direct meal sponsorships, or humanitarian impact campaigns!',
      suggestedQuestions: DEFAULT_SUGGESTIONS,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { data } = await api.post('/bot/chat', {
        message: query.trim(),
        history,
      });

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I could not find an answer. Try asking another question!',
        suggestedQuestions: data.suggestedQuestions || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had trouble connecting to the knowledge base. Please try again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: 'Chat cleared! Feel free to ask another question about Goodwill Motive.',
        suggestedQuestions: DEFAULT_SUGGESTIONS,
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white shadow-xl shadow-[#1B4332]/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
        >
          <div className="relative">
            <BotIcon size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFD54F] animate-pulse" />
          </div>
          <span className="font-display font-bold text-sm tracking-wide hidden sm:inline">
            Goodwill FAQ Bot
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="relative w-[340px] sm:w-[380px] h-[520px] bg-[#FAFBF7] border border-[rgba(64,145,108,0.25)] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-scale">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white font-bold">
                <LeafIcon size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white leading-tight">
                  Goodwill Assistant
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9FD4B4] animate-pulse" />
                  <span className="text-[10px] text-white/80 font-medium">Instant RAG FAQ</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset Chat"
                className="w-7 h-7 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center text-xs transition-all"
              >
                ↺
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize"
                className="w-7 h-7 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#1B4332] text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-[rgba(64,145,108,0.15)] text-[#1B4332] rounded-bl-none shadow-sm'
                  }`}
                >
                  <div
                    className="prose prose-sm max-w-none break-words"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {m.content}
                  </div>
                </div>

                {/* Suggested prompt chips under bot messages */}
                {m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                  <div className="mt-2 space-y-1.5 max-w-[95%]">
                    {m.suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="block w-full text-left px-2.5 py-1.5 rounded-xl bg-[#E8F5EF] hover:bg-[#D8F3DC] border border-[rgba(64,145,108,0.2)] text-[11px] text-[#1B4332] font-semibold transition-all hover:translate-x-0.5 active:scale-98"
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-[rgba(64,145,108,0.15)] text-[#40916C] w-fit">
                <SparklesIcon size={14} className="animate-spin" />
                <span className="text-[11px] font-medium">Finding answers...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[rgba(64,145,108,0.15)] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[rgba(64,145,108,0.2)] bg-[#FAFBF7] text-[#1B4332] text-xs font-medium outline-none focus:border-[#40916C] focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white flex items-center justify-center disabled:opacity-40 transition-all"
            >
              <SendIcon size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
