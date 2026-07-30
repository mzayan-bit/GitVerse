'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/auth/hooks';
import { ConnectGitHub } from '@/components/auth/ConnectGitHub';
import { OrganizationExplorer } from '@/components/auth/OrganizationExplorer';
import { DeveloperDashboard } from '@/components/dashboard';
import { ImportEngine } from '@/github';
import type { ClientMetrics, GitHubRateLimitResponse } from '@/github';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { CommandCenter } from '@/components/infrastructure/CommandCenter';
import { useRepositoryScene } from '@/repository-scene/SceneManager';
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
  const { isAuthenticated, accessToken } = useAuth();

  // UI States
  const [showAuth] = useState(false);
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

  // Repository Scene State
  const repoSceneMode = useRepositoryScene((s) => s.mode);
  const isRepoSceneActive = repoSceneMode !== 'idle';

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
      setShowCommandCenter(true);
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0B0F17] selection:bg-white/20">
      <MotionProvider>
        <WorkspaceLayout
          onOpenSearch={() => setShowSearch(true)}
          onOpenControls={() => setShowTutorial(true)}
          onOpenMotion={() => setShowMotion(true)}
          onToggleIntegration={() => setShowDashboard(!showDashboard)}
          onToggleCommandCenter={() => setShowCommandCenter(!showCommandCenter)}
        >
          {/* Fullscreen 3D WebGL Canvas */}
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <GitVerseCanvas />
          </div>

          {/* Modals & Authentication Overlays */}
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

          {/* Workspace Modals & Command Palette */}
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

          <CommandCenter
            isOpen={showCommandCenter}
            onClose={() => setShowCommandCenter(false)}
          />

          {/* 3D Context Menu */}
          <ContextMenu />
        </WorkspaceLayout>
      </MotionProvider>
    </main>
  );
}
