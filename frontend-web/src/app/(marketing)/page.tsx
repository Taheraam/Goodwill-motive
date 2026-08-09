'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import Navbar from '@/components/Navbar';
import HeroVideo from '@/components/HeroVideo';
import {
  SparklesIcon, LeafIcon, TrophyIcon, UsersIcon, ZapIcon,
  ShieldIcon, HelpCircleIcon, BookOpenIcon, FlameIcon,
  HeartFilledIcon, ArrowRightIcon, TargetIcon,
  FlagIcon, UtensilsIcon, PackageIcon, HomeIcon
} from '@/lib/icons';

const features = [
  { icon: SparklesIcon, title: 'Learn & Earn', desc: 'Master skills through interactive quizzes while accumulating contribution points that fund real-world aid.', gradient: 'from-[#40916C]/10 to-[#52B788]/10' },
  { icon: LeafIcon, title: 'Give Back', desc: 'Turn your learning into direct humanitarian impact through verified campaigns you can track in real time.', gradient: 'from-[#0077B6]/10 to-[#00B4D8]/10' },
  { icon: TrophyIcon, title: 'Earn Recognition', desc: 'Collect badges, maintain streaks, and climb the leaderboard as you contribute and grow.', gradient: 'from-[#8B5E3C]/10 to-[#C19A6B]/10' },
  { icon: UsersIcon, title: 'Join Communities', desc: 'Connect with peers in communities focused on causes you care about — from education to climate.', gradient: 'from-[#1B4332]/10 to-[#2D6A4F]/10' },
  { icon: HelpCircleIcon, title: 'Ask & Answer', desc: 'Get help from experts and share your knowledge. Every answered question earns contribution points.', gradient: 'from-[#CAF0F8]/30 to-[#E6F4FC]/30' },
  { icon: ShieldIcon, title: 'Verified Impact', desc: 'Every contribution is tracked transparently. See exactly how your learning translates into real-world change.', gradient: 'from-[#D8F3DC]/30 to-[#B7E4C7]/30' },
];

const steps = [
  { step: '01', title: 'Learn & Quiz', desc: 'Take interactive quizzes, complete lessons, and earn contribution points with every correct answer.', icon: BookOpenIcon },
  { step: '02', title: 'Build Streaks', desc: 'Keep your daily streak alive. Consistency is rewarded and tracked with beautiful statistics.', icon: FlameIcon },
  { step: '03', title: 'Create Impact', desc: 'Your accumulated points fund verified real-world campaigns. Education becomes tangible change.', icon: HeartFilledIcon },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const totalSteps = 60;
    const increment = target / totalSteps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 2000 / totalSteps);
    return () => clearInterval(timer);
  }, [visible, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const globalMetrics = [
  { icon: FlagIcon, target: 5000, suffix: '+', label: 'Campaigns Launched' },
  { icon: UtensilsIcon, target: 1200000, suffix: '+', label: 'Meals Funded' },
  { icon: PackageIcon, target: 380000, suffix: '+', label: 'Aid Delivered' },
  { icon: HomeIcon, target: 45000, suffix: '+', label: 'Refuge Provided' },
];

const testimonials = [
  { name: 'Sarah K.', text: "I've earned over 200 contribution points while learning. It feels amazing knowing my progress helps real people.", role: 'Community Member', initials: 'SK' },
  { name: 'Michael R.', text: 'The streak system keeps me coming back every day. Learning has never been this addictive.', role: 'Top Contributor', initials: 'MR' },
  { name: 'Aisha M.', text: 'Being part of a community that combines education with humanitarian aid is truly meaningful.', role: 'Community Leader', initials: 'AM' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)]">
      <Navbar />
      <HeroVideo />

      {/* Hero Stats */}
      <section className="relative mt-6 md:mt-10 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-5 md:p-6 grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <p className="text-xl md:text-3xl font-display font-bold text-[#1B4332]">10K+</p>
              <p className="text-xs md:text-sm text-[#40916C]/60 font-medium mt-1">Active Learners</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-3xl font-display font-bold text-[#1B4332]">500+</p>
              <p className="text-xs md:text-sm text-[#40916C]/60 font-medium mt-1">Contributions Made</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-3xl font-display font-bold text-[#1B4332]">50+</p>
              <p className="text-xs md:text-sm text-[#40916C]/60 font-medium mt-1">Impact Campaigns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-spacing">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-semibold text-[#40916C] tracking-[0.15em] uppercase mb-3">Platform</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1B4332] leading-[1.1] mb-5">
              Everything you need<br />
              <span className="text-[#40916C]">to make an impact</span>
            </h2>
            <p className="text-[#40916C]/60 text-lg leading-relaxed max-w-2xl mx-auto">
              We've built a complete system that rewards learning and converts it into real humanitarian contributions.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 70}>
              <div className={`group glass-card rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-500 bg-gradient-to-br ${f.gradient}`}>
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <f.icon size={22} className="text-[#1B4332]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4332] mb-2.5">{f.title}</h3>
                <p className="text-sm text-[#40916C]/60 leading-relaxed">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="works" className="section-spacing bg-gradient-to-b from-[#f8f9f4] to-[#e8f5ef]">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-semibold text-[#40916C] tracking-[0.15em] uppercase mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1B4332] leading-[1.1] mb-5">
              Three steps to change
            </h2>
            <p className="text-[#40916C]/60 text-lg">Simple. Impactful. Rewarding.</p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 120}>
              <div className="group glass-card rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1.5 transition-all duration-500">
                <div className="text-6xl font-display font-bold text-[#40916C]/10 mb-2 leading-none">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={24} className="text-[#1B4332]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1B4332] mb-3">{item.title}</h3>
                <p className="text-sm text-[#40916C]/60 leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Global Impact */}
      <section id="impact" className="section-spacing relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a1711 0%, #0d2b1d 50%, #08180e 100%)' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 40%, #1a5a3a 0%, transparent 70%)' }} />
        {/* Placeholder for 4K Earth image — replace background above with <img src="/images/earth-4k.jpg" /> */}
        
        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-semibold text-[#52B788] tracking-[0.15em] uppercase mb-3">Global Impact</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-[1.1] mb-5">
                Our collective<br />
                <span className="text-[#52B788]">honor roll</span>
              </h2>
              <p className="text-[#D8F3DC]/50 text-lg leading-relaxed">
                Real metrics from verified humanitarian campaigns powered by your contributions.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {globalMetrics.map((m, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div
                  className="group rounded-2xl p-6 md:p-8 hover:-translate-y-1 transition-all duration-500"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[rgba(82,183,136,0.12)] flex items-center justify-center mb-4">
                    <m.icon size={20} className="text-[#52B788]" />
                  </div>
                  <p className="md:text-6xl text-5xl font-display font-bold text-white leading-none tracking-tight">
                    <AnimatedCounter target={m.target} suffix={m.suffix} />
                  </p>
                  <p className="text-sm text-[#D8F3DC]/50 mt-2 font-medium">{m.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="text-center mt-10">
              <Link href="/impact" className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[rgba(255,255,255,0.06)] backdrop-blur-sm border border-[rgba(255,255,255,0.10)] text-[#D8F3DC] rounded-full font-semibold text-sm hover:bg-[rgba(255,255,255,0.12)] transition-all duration-300">
                See the Global Impact
                <ArrowRightIcon size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-spacing">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-semibold text-[#40916C] tracking-[0.15em] uppercase mb-3">Community</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1B4332] leading-[1.1] mb-5">
              Loved by contributors<br />
              <span className="text-[#8B5E3C]">worldwide</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="glass-card rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(n => (
                    <svg key={n} width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#C19A6B" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#2D6A4F]/70 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center text-white font-bold text-xs">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1B4332]">{t.name}</p>
                    <p className="text-xs text-[#40916C]/50">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(232,245,239,0.5) 100%)' }} />
        <div className="relative max-w-3xl mx-auto text-center stagger-children">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#40916C] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#40916C]/25 animate-float-slow">
            <LeafIcon size={28} className="text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1B4332] mb-4 leading-[1.1]">
            Ready to change the world?
          </h2>
          <p className="text-lg text-[#40916C]/60 mb-10 max-w-xl mx-auto">
            Join thousands of learners making education mean something more. It takes 30 seconds to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white font-bold rounded-full shadow-xl shadow-[#40916C]/25 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-sm">
              Create Free Account
              <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/learn" className="group inline-flex items-center gap-2 px-8 py-4 glass rounded-full text-sm font-semibold hover:bg-white/80 transition-all duration-300">
              Explore Courses
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="-scale-x-100 group-hover:-translate-x-1 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 nav-glass border-t border-white/20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center">
                <span className="text-white font-bold text-sm">GM</span>
              </div>
              <span className="font-display font-bold text-[#1B4332]">Goodwill Motive</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/about" className="text-[#1B4332]/40 hover:text-[#1B4332] transition-colors">About</a>
              <a href="/privacy" className="text-[#1B4332]/40 hover:text-[#1B4332] transition-colors">Privacy</a>
              <a href="/terms" className="text-[#1B4332]/40 hover:text-[#1B4332] transition-colors">Terms</a>
              <Link href="/admin/login" className="px-3 py-1 rounded-full border border-[#40916C]/20 text-[#40916C]/60 hover:text-[#40916C] hover:border-[#40916C]/40 text-xs font-medium transition-all">Admin →</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[rgba(64,145,108,0.1)] text-center text-sm text-[#1B4332]/30">
            Built with care for humanity. Every contribution counts.
          </div>
        </div>
      </footer>
    </div>
  );
}