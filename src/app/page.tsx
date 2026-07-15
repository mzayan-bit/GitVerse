'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { SimulationControls } from '@/components/SimulationControls';
import { GalaxyControls } from '@/components/GalaxyControls';
import { EntityInspector } from '@/components/EntityInspector';
import { useSolarSystemManager } from '@/systems/SolarSystem/SolarSystemManager';
import { useGalaxyManager } from '@/galaxy/GalaxyManager';
import { ConnectGitHub } from '@/components/auth/ConnectGitHub';
import { ImportLoading } from '@/components/auth/ImportLoading';
import { GithubService } from '@/lib/github/GithubService';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';

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
  const { data: session, status } = useSession();
  const [hasEntered, setHasEntered] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [repositories, setRepositories] = useState<RepositoryDomainModel[]>([]);

  const setCameraMode = useSolarSystemManager((s) => s.setCameraMode);
  const generateGalaxy = useGalaxyManager((s) => s.generateGalaxy);

  const startImport = async () => {
    setIsImporting(true);
    try {
      if (
        session &&
        (session as unknown as Record<string, unknown>).accessToken
      ) {
        const github = new GithubService(
          (session as unknown as Record<string, unknown>).accessToken as string
        );
        const repos = await github.fetchUserRepositories();
        setRepositories(repos);

        // Generate the galaxy using real data
        generateGalaxy('github-universe', undefined, 'spiral', repos);
      }
    } catch (err) {
      console.error('Failed to import repositories:', err);
      setIsImporting(false);
    }
  };

  const handleEnter = () => {
    if (status === 'authenticated') {
      startImport();
    } else {
      setShowAuth(true);
    }
  };

  const handleImportComplete = () => {
    setIsImporting(false);
    setHasEntered(true);
    setCameraMode('orbit');
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black selection:bg-white/20">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {hasEntered && <GitVerseCanvas />}
      </div>

      {/* UI Overlay - Space OS */}
      {!hasEntered && !isImporting && (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between p-8 font-sans transition-opacity duration-1000">
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
          <div className="flex flex-col items-center justify-center translate-y-[-10%] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-light tracking-[-0.04em] text-white/90 select-none mb-4 drop-shadow-2xl">
              GitVerse
            </h1>
            <p className="text-sm md:text-base font-light tracking-[0.05em] text-white/50 max-w-md text-center leading-relaxed">
              A cinematic operating system for your repositories.
            </p>
          </div>

          {/* Bottom Dock */}
          <div className="pointer-events-auto flex items-center justify-center mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
            <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:bg-white/[0.05]">
              <Button
                variant="outline"
                onClick={handleEnter}
                className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-light tracking-wide px-8 py-6 h-auto transition-all"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin mr-2 size-4" />
                ) : null}
                Enter Universe
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Overlay */}
      {showAuth && !isImporting && (
        <div className="absolute inset-0 z-50 pointer-events-auto">
          <ConnectGitHub />
        </div>
      )}

      {/* Import Loading Screen */}
      {isImporting && (
        <div className="absolute inset-0 z-50 pointer-events-auto bg-black">
          <ImportLoading
            repositories={repositories}
            onComplete={handleImportComplete}
          />
        </div>
      )}

      {/* Simulation UI overlay */}
      {hasEntered && (
        <div className="pointer-events-auto animate-in fade-in duration-1000 z-10 relative">
          <GalaxyControls />
          <SimulationControls />
          <EntityInspector />
        </div>
      )}
    </main>
  );
}
