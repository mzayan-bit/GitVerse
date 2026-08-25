'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/auth/hooks';
import { ConnectGitHub } from '@/components/auth/ConnectGitHub';
import { OrganizationExplorer } from '@/components/auth/OrganizationExplorer';
import { DeveloperDashboard } from '@/components/dashboard';
import { ImportEngine } from '@/github';
import type { ClientMetrics, GitHubRateLimitResponse } from '@/github';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { RepositoryExplorerHUD } from '@/repository-scene/ui/RepositoryExplorerHUD';
import { BuildingTooltip } from '@/repository-scene/ui/BuildingTooltip';
import { Minimap } from '@/repository-scene/ui/Minimap';
import { useRepositoryScene } from '@/repository-scene/SceneManager';
import { WorkspaceLayout } from '@/workspace/WorkspaceLayout';
import { CommandPalette } from '@/workspace/command/CommandPalette';
import { MovementTutorialModal } from '@/components/navigation/MovementTutorialModal';
import { MotionPanel } from '@/components/motion/MotionPanel';
import { MotionProvider } from '@/components/motion/MotionProvider';
import {
  SampleUniverseBuilder,
  SAMPLE_REPOSITORIES,
} from '@/universe/SampleUniverseBuilder';

// Dynamically import the 3D canvas with SSR disabled
const GitVerseCanvas = dynamic(() => import('@/components/canvas-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
      <Loader2 className="size-8 animate-spin text-purple-400" />
    </div>
  ),
});

export default function Home() {
  const { isAuthenticated, isLoading, accessToken } = useAuth();

  // UI State Machine
  const [showAuth, setShowAuth] = useState(false);
  const [showOrgExplorer, setShowOrgExplorer] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMotion, setShowMotion] = useState(false);

  // Data States initialized with SAMPLE_REPOSITORIES for instant 3D demo readiness
  const [repositories, setRepositories] =
    useState<RepositoryDomainModel[]>(SAMPLE_REPOSITORIES);
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics>();
  const [rateLimit, setRateLimit] = useState<GitHubRateLimitResponse>();

  const hasImported = repositories.length > 0;

  useEffect(() => {
    SampleUniverseBuilder.loadSampleUniverse();
  }, []);

  // Repository Scene State
  const repoSceneMode = useRepositoryScene((s) => s.mode);
  const repoSceneLayout = useRepositoryScene((s) => s.layout);
  const isRepoSceneActive = repoSceneMode !== 'idle';

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
        const { UniverseBuilder } = await import('@/universe/UniverseBuilder');
        const { useGalaxyManager } = await import('@/galaxy/GalaxyManager');

        useGalaxyManager.getState().setShowGalaxyUI(false);
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
    <main className="relative h-screen w-full overflow-hidden bg-[#0B0F17] selection:bg-purple-500/30">
      <MotionProvider>
        <WorkspaceLayout
          onOpenSearch={() => setShowSearch(true)}
          onOpenImport={handleEnter}
        >
          {/* 3D Viewport Hero Canvas */}
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <GitVerseCanvas />
          </div>

          {/* Unauthenticated / Landing View */}
          {!showOrgExplorer && !isImporting && !hasImported && (
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between p-8 font-sans">
              <header className="w-full max-w-7xl flex items-center justify-between text-[11px] font-mono tracking-widest text-white/50 uppercase">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>System Online</span>
                </div>
                <div>
                  <span>GitVerse v1.0 Enterprise GA</span>
                </div>
              </header>

              <div className="flex flex-col items-center justify-center translate-y-[-10%] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white select-none mb-4 drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                  GitVerse
                </h1>
                <p className="text-sm md:text-base font-light tracking-widest text-gray-400 max-w-md text-center leading-relaxed">
                  3D Spatial Software Engineering Platform
                </p>
              </div>

              <div className="pointer-events-auto flex items-center justify-center mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                <Button
                  variant="outline"
                  onClick={handleEnter}
                  className="rounded-2xl border-purple-500/30 bg-purple-600/20 hover:bg-purple-600/30 text-white font-semibold tracking-wide px-8 py-6 h-auto transition-all backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mr-2 size-4" />
                  ) : null}
                  {isAuthenticated ? 'Open Workspace' : 'Connect GitHub'}
                </Button>
              </div>
            </div>
          )}

          {/* GitHub Auth & Import Modals */}
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
              <div className="flex flex-col items-center gap-4 text-white font-sans">
                <Loader2 className="size-8 animate-spin text-cyan-400" />
                <p className="text-xs font-mono tracking-widest uppercase text-gray-400">
                  Synthesizing 3D Universe from GitHub Repositories...
                </p>
              </div>
            </div>
          )}

          {/* Developer Dashboard Modal */}
          {!isRepoSceneActive && (
            <DeveloperDashboard
              isOpen={showDashboard}
              onClose={() => setShowDashboard(false)}
              clientMetrics={clientMetrics}
              rateLimit={rateLimit?.resources.core}
              importedRepoCount={repositories.length}
              orgCount={1}
            />
          )}

          {/* Command Palette (⌘K) */}
          <CommandPalette
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            onOpenImport={handleEnter}
          />

          {/* Navigation & Movement Tutorial Modal */}
          <MovementTutorialModal
            isOpen={showTutorial}
            onClose={() => setShowTutorial(false)}
          />

          {/* Motion System Inspector */}
          <MotionPanel
            isOpen={showMotion}
            onClose={() => setShowMotion(false)}
          />

          {/* Repository City Scene Overlay */}
          {repoSceneMode === 'exploring' && (
            <div className="absolute inset-0 z-50 pointer-events-none">
              <RepositoryExplorerHUD />
              {repoSceneLayout && (
                <>
                  <BuildingTooltip layout={repoSceneLayout} />
                  <Minimap layout={repoSceneLayout} />
                </>
              )}
            </div>
          )}
        </WorkspaceLayout>
      </MotionProvider>
    </main>
  );
}
