'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { SimulationControls } from '@/components/SimulationControls';

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
    <main className="relative h-screen w-full overflow-hidden bg-black selection:bg-white/20">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <GitVerseCanvas />
      </div>

      {/* UI Overlay - Space OS */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between p-8 font-sans">
        {/* Top Status Bar */}
        <header className="w-full max-w-7xl flex items-center justify-between text-[11px] font-mono tracking-widest text-white/50 uppercase">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <span>System Online</span>
          </div>
          <div>
            <span>GitVerse v0.1.0</span>
          </div>
        </header>

        {/* Center Content - Floating gracefully */}
        <div className="flex flex-col items-center justify-center translate-y-[-10%]">
          <h1 className="text-5xl md:text-7xl font-light tracking-[-0.04em] text-white/90 select-none mb-4">
            GitVerse
          </h1>
          <p className="text-sm md:text-base font-light tracking-[0.05em] text-white/50 max-w-md text-center leading-relaxed">
            A cinematic operating system for your repositories.
          </p>
        </div>

        {/* Bottom Dock */}
        <div className="pointer-events-auto flex items-center justify-center mb-8">
          <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:bg-white/[0.05]">
            <Button
              variant="outline"
              className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-light tracking-wide px-8 py-6 h-auto transition-all"
            >
              Enter Universe
            </Button>
            <Button
              variant="ghost"
              className="rounded-2xl text-white/50 hover:text-white hover:bg-white/5 px-6 py-6 h-auto font-light transition-all"
            >
              Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Simulation UI overlay */}
      <div className="pointer-events-auto">
        <SimulationControls />
      </div>
    </main>
  );
}
