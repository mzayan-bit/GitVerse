'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/auth/hooks';
import { SimulationControls } from '@/components/SimulationControls';
import { GalaxyControls } from '@/components/GalaxyControls';
import { ConnectGitHub } from '@/components/auth/ConnectGitHub';
import { OrganizationExplorer } from '@/components/auth/OrganizationExplorer';
import { DeveloperDashboard } from '@/components/dashboard';
import { ImportEngine } from '@/github';
import type { ClientMetrics, GitHubRateLimitResponse } from '@/github';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { UniverseSearch, UniverseHUD } from '@/universe';
import { ImpactDashboard } from '@/components/impact';

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
  const { isAuthenticated, isLoading, accessToken } = useAuth();

  // UI States
  const [showAuth, setShowAuth] = useState(false);
  const [showOrgExplorer, setShowOrgExplorer] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Data States
  const [repositories, setRepositories] = useState<RepositoryDomainModel[]>([]);
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics>();
  const [rateLimit, setRateLimit] = useState<GitHubRateLimitResponse>();

  const handleEnter = () => {
    if (isAuthenticated) {
      setShowOrgExplorer(true);
    } else {
      setShowAuth(true);
    }
  };

  const startImport = async (mode: 'personal' | 'org', orgLogin?: string) => {
    if (!accessToken) return;

    setShowOrgExplorer(false);
    setIsImporting(true);

    const engine = new ImportEngine(accessToken);

    try {
      let result;
      if (mode === 'personal') {
        result = await engine.importUserRepositories();
      } else if (orgLogin) {
        result = await engine.importOrgRepositories(orgLogin);
      }

      if (result) {
        setRepositories(result.repositories);
        // Build the Live Universe
        const { UniverseBuilder } = await import('@/universe/UniverseBuilder');
        const { useGalaxyManager } = await import('@/galaxy/GalaxyManager');

        // Hide the procedural background galaxy
        useGalaxyManager.getState().setShowGalaxyUI(false);
        // Wait for state to settle then build universe
        setTimeout(() => {
          UniverseBuilder.build(result.repositories);
        }, 100);
      }

      const metrics = engine.getClient().getMetrics();
      const limits = await engine.getClient().getRateLimit();

      setClientMetrics(metrics);
      setRateLimit(limits);
    } catch (err) {
      console.error('Import failed:', err);
    } finally {
      setIsImporting(false);
      setShowDashboard(true);
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black selection:bg-white/20">
      {/* 3D Scene Background - Running independently as requested */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <GitVerseCanvas />
      </div>

      {/* Landing UI */}
      {!showOrgExplorer && !isImporting && !showDashboard && (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between p-8 font-sans">
          <header className="w-full max-w-7xl flex items-center justify-between text-[11px] font-mono tracking-widest text-white/50 uppercase">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
              <span>System Online</span>
            </div>
            <div>
              <span>GitVerse v0.2.0</span>
            </div>
          </header>

          <div className="flex flex-col items-center justify-center translate-y-[-10%] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-light tracking-[-0.04em] text-white/90 select-none mb-4 drop-shadow-2xl">
              GitVerse
            </h1>
            <p className="text-sm md:text-base font-light tracking-[0.05em] text-white/50 max-w-md text-center leading-relaxed">
              Integration Platform Dashboard
            </p>
          </div>

          <div className="pointer-events-auto flex items-center justify-center mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Button
              variant="outline"
              onClick={handleEnter}
              className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-light tracking-wide px-8 py-6 h-auto transition-all backdrop-blur-xl"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2 size-4" />
              ) : null}
              {isAuthenticated ? 'Open Dashboard' : 'Connect GitHub'}
            </Button>
          </div>
        </div>
      )}

      {/* Modals & Overlays */}
      {showAuth && !isAuthenticated && <ConnectGitHub />}

      {showOrgExplorer && accessToken && (
        <OrganizationExplorer
          accessToken={accessToken}
          onSelectPersonal={() => startImport('personal')}
          onSelectOrg={(org) => startImport('org', org)}
        />
      )}

      {isImporting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 text-white">
            <Loader2 className="size-8 animate-spin text-emerald-400" />
            <p className="text-sm tracking-widest uppercase text-white/50">
              Importing Repositories...
            </p>
          </div>
        </div>
      )}

      {/* Developer Dashboard - The Operational View */}
      <DeveloperDashboard
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        clientMetrics={clientMetrics}
        rateLimit={rateLimit?.resources.core}
        importedRepoCount={repositories.length}
        orgCount={1}
      />

      {/* Live Universe UI Overlays */}
      <UniverseSearch />
      <UniverseHUD />

      {/* Impact Analysis Overlay */}
      <ImpactDashboard />

      {/* Background Controls (optional, disabled for dashboard focus) */}
      <div className="hidden">
        <GalaxyControls />
        <SimulationControls />
      </div>
    </main>
  );
}
