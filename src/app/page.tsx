'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, GitBranch, Compass } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D canvas with SSR disabled
const GitVerseCanvas = dynamic(() => import('@/components/canvas-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
      <Loader2 className="size-8 animate-spin text-white/50" />
    </div>
  ),
});

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-black font-sans selection:bg-white/30 selection:text-white">
      {/* 3D Universe Canvas Background */}
      <GitVerseCanvas />

      {/* Glassmorphic Navigation */}
      <header className="absolute inset-x-0 top-6 z-50 flex justify-center px-4 md:px-8">
        <nav className="flex items-center gap-8 rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 backdrop-blur-xl transition-all hover:bg-white/[0.05]">
          <div className="flex items-center gap-2">
            <Compass className="size-5 text-white" />
            <span className="text-sm font-semibold tracking-widest text-white">
              GITVERSE
            </span>
          </div>
        </nav>
      </header>

      {/* Hero Content (Center-Bottom Aligned) */}
      <main className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-end pb-24 md:pb-32 px-4">
        <div className="pointer-events-auto flex max-w-3xl flex-col items-center text-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/[0.04]">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-wide text-white sm:text-5xl md:text-6xl lg:text-[64px]">
            Explore the <br className="hidden sm:block" /> Code Cosmos
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-[1.6] text-gray-400 md:text-[18px]">
            Visualize your open-source impact across a sprawling 3D star-map of
            repositories. A cinematic universe for every commit.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 rounded-lg bg-white text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all px-8 text-[15px] font-medium"
            >
              Launch Universe
            </Button>

            <a
              href="https://github.com/mzayan-bit/GitVerse"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full sm:w-auto h-12 rounded-lg border border-white/20 bg-transparent text-white hover:bg-white/10 transition-all px-8 text-[15px] font-medium'
              )}
            >
              <GitBranch className="mr-2 size-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
