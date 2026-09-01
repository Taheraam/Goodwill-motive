import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Goodwill Motive — Learn Together. Help Others. Change Real Lives.',
  description: 'A cross-platform humanitarian social-learning ecosystem where learning, teaching, and contribution generate measurable humanitarian impact.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link href="https://fonts.cdnfonts.com/css/coolvetica-2" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-[var(--color-background)] text-zinc-900 antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(64,145,108,0.15)',
                borderRadius: '12px',
                color: '#1B4332',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}