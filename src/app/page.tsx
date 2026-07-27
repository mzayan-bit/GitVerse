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
import { CommandCenter } from '@/components/infrastructure/CommandCenter';
import { useRepositoryScene } from '@/repository-scene/SceneManager';
import { RepositoryExplorerHUD } from '@/repository-scene/ui/RepositoryExplorerHUD';
import { BuildingTooltip } from '@/repository-scene/ui/BuildingTooltip';
import { Minimap } from '@/repository-scene/ui/Minimap';
import { ObservabilityCommandCenter } from '@/components/observability/ObservabilityCommandCenter';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { TeamWorkspace } from '@/components/collaboration/TeamWorkspace';
import { NavigationHUD } from '@/components/navigation/NavigationHUD';
import { ContextMenu } from '@/engine/interaction/ContextMenu';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { WorkspaceLayout } from '@/workspace/WorkspaceLayout';
import { CommandPalette } from '@/workspace/command/CommandPalette';
import { MovementTutorialModal } from '@/components/navigation/MovementTutorialModal';
import { MotionPanel } from '@/components/motion/MotionPanel';

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
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMotion, setShowMotion] = useState(false);

  // Data States
  const [repositories, setRepositories] = useState<RepositoryDomainModel[]>([]);
  const [clientMetrics, setClientMetrics] = useState<ClientMetrics>();
  const [rateLimit, setRateLimit] = useState<GitHubRateLimitResponse>();

  const hasImported = repositories.length > 0;

  // Repository Scene State for decoupled UI rendering
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
      setShowCommandCenter(true);
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black selection:bg-white/20">
      <MotionProvider>
        <WorkspaceLayout
          onOpenSearch={() => setShowSearch(true)}
          onOpenControls={() => setShowTutorial(true)}
          onOpenMotion={() => setShowMotion(true)}
          onToggleIntegration={() => setShowDashboard(!showDashboard)}
          onToggleCommandCenter={() => setShowCommandCenter(!showCommandCenter)}
        >
          {/* 3D Scene Background - Running independently as requested */}
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <GitVerseCanvas />
          </div>

          {/* Landing UI */}
          {!showOrgExplorer && !isImporting && !hasImported && (
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

          {/* Workspace Modals & Overlays */}
          <CommandPalette
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
          />

          <MovementTutorialModal
            isOpen={showTutorial}
            onClose={() => setShowTutorial(false)}
          />

          <MotionPanel
            isOpen={showMotion}
            onClose={() => setShowMotion(false)}
          />

          {/* Live Universe UI Overlays */}
          {!isRepoSceneActive && (
            <>
              <UniverseSearch />
              <UniverseHUD />
            </>
          )}

          <CommandCenter
            isOpen={showCommandCenter}
            onClose={() => setShowCommandCenter(false)}
          />

          {/* Hero Overlay (if not imported) */}
          {!hasImported && !isImporting && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
              <div className="max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl pointer-events-auto transition-all duration-500 hover:border-white/20">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4">
                  Explore Code as a Live Universe
                </h1>
                <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-lg mx-auto">
                  Transform repositories into dynamic solar systems. Understand
                  architecture, evolutionary history, and multi-agent operations
                  visually.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={handleEnter}
                    className="bg-white text-black hover:bg-slate-200 font-semibold px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Enter Universe
                  </Button>
                  {isAuthenticated && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setShowOrgExplorer(true)}
                      className="border-white/20 bg-black/40 hover:bg-white/10 text-white font-semibold px-8 rounded-xl backdrop-blur-md transition-all duration-300"
                    >
                      Import Repositories
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Live GitHub Universe Features */}
          {hasImported && (
            <>
              {/* Search Bar */}
              <UniverseSearch />

              {/* Universe HUD */}
              <UniverseHUD />

              {/* Impact Analysis Dashboard */}
              <ImpactDashboard />

              {/* Observability Live Platform */}
              <ObservabilityCommandCenter />

              {/* Engineering Simulation Platform */}
              <SimulationWorkspace />

              {/* Team Collaboration */}
              <TeamWorkspace />

              {/* Navigation HUD & Context Menu */}
              <NavigationHUD />
              <ContextMenu />
            </>
          )}

          {/* Decoupled Repository Scene UI Overlays */}
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

          {/* Background Controls (optional, disabled for dashboard focus) */}
          <div className="hidden">
            <GalaxyControls />
            <SimulationControls />
          </div>
        </WorkspaceLayout>
      </MotionProvider>
    </main>
  );
}
