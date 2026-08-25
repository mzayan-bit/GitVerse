import { usePanelStore } from './PanelController';
import { PANEL_REGISTRY, PanelType } from './PanelRegistry';
import { PanelRenderer } from './PanelRenderer';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightDrawer } from '@/components/layout/RightDrawer';
import { SpotlightOverlay } from '@/demo/onboarding/SpotlightOverlay';
import { PresentationBar } from '@/demo/onboarding/PresentationBar';
import { ZoomControlsWidget } from '@/components/layout/ZoomControlsWidget';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  onOpenSearch?: () => void;
  onOpenImport?: () => void;
}

export function WorkspaceLayout({
  children,
  onOpenSearch,
  onOpenImport,
}: WorkspaceLayoutProps) {
  const panels = usePanelStore((s) => s.panels);
  const activeDockTab = usePanelStore((s) => s.activeDockTab);
  const openPanel = usePanelStore((s) => s.openPanel);
  const setActiveDockTab = usePanelStore((s) => s.setActiveDockTab);

  const leftPanels = panels.filter((p) => p.dockPosition === 'left');
  const rightPanels = panels.filter((p) => p.dockPosition === 'right');
  const activeLeftPanel =
    leftPanels.find((p) => p.id === activeDockTab.left) || leftPanels[0];
  const activeRightPanel =
    rightPanels.find((p) => p.id === activeDockTab.right) || rightPanels[0];

  return (
    <div className="relative w-full h-full overflow-hidden select-none font-sans bg-[#0B0F17]">
      {/* Zone 1: Top Navigation Bar */}
      <TopNavBar onOpenSearch={onOpenSearch} onOpenImport={onOpenImport} />

      {/* Zone 2: Left Icon Rail Navigation */}
      <LeftSidebar onOpenPanel={(pType) => openPanel(pType as PanelType)} />

      {/* Zone 3: Main Hero 3D Canvas / Viewport */}
      <div className="absolute inset-0 pt-12 pl-14 pointer-events-auto">
        {children}
      </div>

      {/* Left Docked Panel Container (When explicitly opened) */}
      {leftPanels.length > 0 && (
        <aside className="absolute top-12 bottom-0 left-14 w-80 z-30 bg-[#0B0F17]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col pointer-events-auto shadow-2xl">
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
                <span>{PANEL_REGISTRY[p.type]?.title || p.type}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden p-2">
            {activeLeftPanel && <PanelRenderer panel={activeLeftPanel} />}
          </div>
        </aside>
      )}

      {/* Right Docked Panel Container (When explicitly opened) */}
      {rightPanels.length > 0 && (
        <aside className="absolute top-12 bottom-0 right-0 w-88 z-30 bg-[#0B0F17]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col pointer-events-auto shadow-2xl">
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
                <span>{PANEL_REGISTRY[p.type]?.title || p.type}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden p-2">
            {activeRightPanel && <PanelRenderer panel={activeRightPanel} />}
          </div>
        </aside>
      )}

      {/* Zone 4: Context-Aware Unified Right Drawer */}
      <RightDrawer />

      {/* Guided Tour & Keynote Overlays */}
      <SpotlightOverlay />
      <PresentationBar />

      {/* 3D Viewport Quick Zoom Controls */}
      <ZoomControlsWidget />
    </div>
  );
}
