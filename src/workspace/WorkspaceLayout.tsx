import { useState, useEffect } from 'react';
import { usePanelStore } from './PanelController';
import { PANEL_REGISTRY, PanelType } from './PanelRegistry';
import { PanelRenderer } from './PanelRenderer';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightContextPanel } from '@/components/layout/RightContextPanel';
import { MinimapWidget } from '@/components/layout/MinimapWidget';
import { SystemHealthOrbitHUD } from '@/components/hud/SystemHealthOrbitHUD';
import { ArchitectureImpactWaveHUD } from '@/components/hud/ArchitectureImpactWaveHUD';
import { SpotlightOverlay } from '@/demo/onboarding/SpotlightOverlay';
import { PresentationBar } from '@/demo/onboarding/PresentationBar';
import {
  WorkspaceModeController,
  WorkspaceMode,
} from './WorkspaceModeController';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  onOpenSearch?: () => void;
  onOpenControls?: () => void;
  onOpenMotion?: () => void;
  onToggleIntegration?: () => void;
  onToggleCommandCenter?: () => void;
}

export function WorkspaceLayout({
  children,
  onOpenSearch,
  onToggleCommandCenter,
}: WorkspaceLayoutProps) {
  const modeController = WorkspaceModeController.getInstance();
  const [currentMode, setCurrentMode] = useState<WorkspaceMode>(
    modeController.getMode()
  );

  const panels = usePanelStore((s) => s.panels);
  const activeDockTab = usePanelStore((s) => s.activeDockTab);
  const openPanel = usePanelStore((s) => s.openPanel);
  const setActiveDockTab = usePanelStore((s) => s.setActiveDockTab);

  useEffect(() => {
    return modeController.subscribe((mode) => {
      setCurrentMode(mode);
    });
  }, [modeController]);

  const leftPanels = panels.filter((p) => p.dockPosition === 'left');
  const rightPanels = panels.filter((p) => p.dockPosition === 'right');
  const floatingPanels = panels.filter((p) => p.dockPosition === 'floating');

  const activeLeftPanel =
    leftPanels.find((p) => p.id === activeDockTab.left) || leftPanels[0];
  const activeRightPanel =
    rightPanels.find((p) => p.id === activeDockTab.right) || rightPanels[0];

  return (
    <div className="relative w-full h-full overflow-hidden select-none font-sans bg-[#0B0F17]">
      {/* Zone 1: Top Navigation Bar */}
      <TopNavBar
        onOpenSearch={onOpenSearch || onToggleCommandCenter}
        onLaunchDemo={() => openPanel('demo')}
      />

      {/* Zone 2: Left Collapsible Sidebar */}
      <LeftSidebar onOpenPanel={(pType) => openPanel(pType as PanelType)} />

      {/* Zone 3: Main 3D Canvas / Viewport */}
      <div className="absolute inset-0 pt-12 pb-6 pointer-events-auto">
        {children}
      </div>

      {/* Floating 3D HUD Widgets */}
      {currentMode === 'EXPLORE' && <SystemHealthOrbitHUD />}
      {currentMode === 'ANALYZE' && <ArchitectureImpactWaveHUD />}

      {/* 3D Minimap Orientation Widget */}
      <MinimapWidget />

      {/* Floating Windows Layer */}
      {floatingPanels.map((p) => (
        <PanelRenderer key={p.id} panel={p} />
      ))}

      {/* Left Docked Panel Container (When explicitly triggered) */}
      {leftPanels.length > 0 && (
        <aside className="absolute top-12 bottom-6 left-52 w-80 z-30 bg-[#0B0F17]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col pointer-events-auto shadow-2xl">
          <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto custom-scrollbar">
            {leftPanels.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveDockTab('left', p.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeLeftPanel?.id === p.id
                    ? 'border-purple-500 text-purple-300 bg-white/5'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{PANEL_REGISTRY[p.type].title}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden p-2">
            {activeLeftPanel && <PanelRenderer panel={activeLeftPanel} />}
          </div>
        </aside>
      )}

      {/* Right Docked Panel Container */}
      {rightPanels.length > 0 && (
        <aside className="absolute top-12 bottom-6 right-0 w-88 z-30 bg-[#0B0F17]/90 backdrop-blur-2xl border-l border-white/10 flex flex-col pointer-events-auto shadow-2xl">
          <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto custom-scrollbar">
            {rightPanels.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveDockTab('right', p.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeRightPanel?.id === p.id
                    ? 'border-purple-500 text-purple-300 bg-white/5'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{PANEL_REGISTRY[p.type].title}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden p-2">
            {activeRightPanel && <PanelRenderer panel={activeRightPanel} />}
          </div>
        </aside>
      )}

      {/* Zone 4: Slide-over Context Panel */}
      <RightContextPanel />

      {/* Guided Tour & Keynote Overlays */}
      <SpotlightOverlay />
      <PresentationBar />

      {/* Bottom Status Bar */}
      <footer className="absolute bottom-0 left-0 right-0 h-6 z-40 bg-[#0B0F17]/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-4 text-[10px] text-gray-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">
            MODE: {currentMode}
          </span>
          <span>Panels: {panels.length} Active</span>
        </div>
        <div>
          <span>GitVerse v1.0 GA Platform</span>
        </div>
      </footer>
    </div>
  );
}
