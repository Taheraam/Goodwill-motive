'use client';

import Link from 'next/link';

export default function HeroVideo() {
  return (
    <section className="hero-section" style={{ minHeight: '100dvh' }}>
      <video autoPlay loop muted playsInline preload="auto" className="hero-video">
        <source src="/videos/earth.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />

      <div className="hero-content flex flex-col items-center justify-center h-full text-center px-5 md:px-8 pb-8 md:pb-12 pt-36 md:pt-44">
        <div className="flex flex-col items-center w-full max-w-4xl">
          <p className="text-[10px] md:text-sm font-medium text-white/70 tracking-[0.2em] uppercase mb-2 md:mb-4">
            The Future of Social Learning
          </p>

          <h1 className="text-[1.8rem] leading-[1.1] sm:text-4xl md:text-7xl font-display font-bold text-white max-w-4xl mb-2 md:mb-4">
            Learn Together.
            <br />
            <span className="bg-gradient-to-r from-[#52B788] via-[#00B4D8] to-[#C19A6B] bg-clip-text text-transparent">
              Help Others.
            </span>
            <br />
            Change Real Lives.
          </h1>

          <p className="text-white/60 text-xs md:text-lg max-w-2xl mb-3 md:mb-6 leading-relaxed px-1 md:px-4">
            A gamified social-learning platform where every quiz you take, every question you answer,
            and every contribution you make creates measurable impact in communities worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-6 md:mb-10">
            <Link href="/signup" className="group inline-flex items-center gap-2 px-5 md:px-8 py-2.5 md:py-3.5 bg-white text-[#1B4332] rounded-full font-semibold text-xs md:text-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              Start Contributing
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="group-hover:translate-x-1 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#features" className="group inline-flex items-center gap-2 px-5 md:px-8 py-2.5 md:py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-xs md:text-sm hover:bg-white/20 transition-all duration-300">
              Explore Features
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="group-hover:translate-y-1 transition-transform">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}