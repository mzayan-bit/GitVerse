import { usePanelStore } from './PanelController';
import { PANEL_REGISTRY, PanelType } from './PanelRegistry';
import { PanelRenderer } from './PanelRenderer';
import {
  LayoutGrid,
  RotateCcw,
  Search,
  Gamepad2,
  Activity,
  SlidersHorizontal,
  Terminal,
  Sparkles,
  Monitor,
  Package,
} from 'lucide-react';
import { SpotlightOverlay } from '@/demo/onboarding/SpotlightOverlay';
import { PresentationBar } from '@/demo/onboarding/PresentationBar';

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
  onOpenControls,
  onOpenMotion,
  onToggleIntegration,
  onToggleCommandCenter,
}: WorkspaceLayoutProps) {
  const panels = usePanelStore((s) => s.panels);
  const activeDockTab = usePanelStore((s) => s.activeDockTab);
  const openPanel = usePanelStore((s) => s.openPanel);
  const setActiveDockTab = usePanelStore((s) => s.setActiveDockTab);
  const restoreDefaultLayout = usePanelStore((s) => s.restoreDefaultLayout);

  const leftPanels = panels.filter((p) => p.dockPosition === 'left');
  const rightPanels = panels.filter((p) => p.dockPosition === 'right');
  const floatingPanels = panels.filter((p) => p.dockPosition === 'floating');

  const activeLeftPanel =
    leftPanels.find((p) => p.id === activeDockTab.left) || leftPanels[0];
  const activeRightPanel =
    rightPanels.find((p) => p.id === activeDockTab.right) || rightPanels[0];

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Top Workspace Toolbar */}
      <header className="absolute top-0 left-0 right-0 h-10 z-40 bg-black/85 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase text-indigo-400">
            <LayoutGrid className="w-4 h-4" />
            <span>Workspace</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Quick Panel Openers */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => openPanel('cosmos')}
              className="px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-md transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Cosmos</span>
            </button>

            <button
              onClick={() => openPanel('graphics')}
              className="px-2.5 py-1 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-md transition-colors flex items-center gap-1"
            >
              <Monitor className="w-3 h-3 text-indigo-400" />
              <span>Graphics</span>
            </button>

            <button
              onClick={() => openPanel('marketplace')}
              className="px-2.5 py-1 text-[11px] font-semibold text-purple-300 hover:text-purple-200 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 rounded-md transition-colors flex items-center gap-1"
            >
              <Package className="w-3 h-3 text-purple-400" />
              <span>Marketplace</span>
            </button>

            {(
              [
                'explorer',
                'inspector',
                'graph',
                'ai',
                'simulation',
                'metrics',
              ] as PanelType[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => openPanel(type)}
                className="px-2.5 py-1 text-[11px] font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors capitalize"
              >
                {PANEL_REGISTRY[type].title.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Quick Tool Triggers */}
          <div className="flex items-center gap-1">
            {onToggleIntegration && (
              <button
                onClick={onToggleIntegration}
                className="flex items-center gap-1 px-2 py-1 text-[11px] text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
                <span>Integration</span>
              </button>
            )}
            {onToggleCommandCenter && (
              <button
                onClick={onToggleCommandCenter}
                className="flex items-center gap-1 px-2 py-1 text-[11px] text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Command Center</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Section Tools */}
        <div className="flex items-center gap-2">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-white/5 border border-white/10 hover:border-indigo-500/50 rounded-md text-gray-300 hover:text-white transition-all"
            >
              <Search className="w-3 h-3 text-indigo-400" />
              <span>Search</span>
              <kbd className="px-1 py-0.2 text-[9px] bg-white/10 rounded font-mono text-gray-400">
                ⌘K
              </kbd>
            </button>
          )}

          {onOpenControls && (
            <button
              onClick={onOpenControls}
              title="Controls Tutorial"
              className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-sky-400" />
            </button>
          )}

          {onOpenMotion && (
            <button
              onClick={onOpenMotion}
              title="Motion Preferences"
              className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          <div className="h-4 w-px bg-white/10" />

          <button
            onClick={restoreDefaultLayout}
            title="Reset Workspace Layout"
            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main 3D Canvas / Content Area */}
      <div className="absolute inset-0 pt-10 pb-6 pointer-events-auto">
        {children}
      </div>

      {/* Floating Windows Layer */}
      {floatingPanels.map((p) => (
        <PanelRenderer key={p.id} panel={p} />
      ))}

      {/* Left Dock Panel Bar */}
      {leftPanels.length > 0 && (
        <aside className="absolute top-10 bottom-6 left-0 w-80 z-30 bg-black/85 backdrop-blur-2xl border-r border-white/10 flex flex-col pointer-events-auto shadow-2xl">
          {/* Dock Tabs */}
          <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto custom-scrollbar">
            {leftPanels.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveDockTab('left', p.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeLeftPanel?.id === p.id
                    ? 'border-indigo-500 text-indigo-300 bg-white/5'
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

      {/* Right Dock Panel Bar */}
      {rightPanels.length > 0 && (
        <aside className="absolute top-10 bottom-6 right-0 w-88 z-30 bg-black/85 backdrop-blur-2xl border-l border-white/10 flex flex-col pointer-events-auto shadow-2xl">
          {/* Dock Tabs */}
          <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto custom-scrollbar">
            {rightPanels.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveDockTab('right', p.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeRightPanel?.id === p.id
                    ? 'border-indigo-500 text-indigo-300 bg-white/5'
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

      {/* Bottom Status Bar */}
      <footer className="absolute bottom-0 left-0 right-0 h-6 z-40 bg-black/90 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-4 text-[10px] text-gray-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">READY</span>
          <span>Panels: {panels.length} Active</span>
        </div>
        <div>
          <span>GitVerse Modular Workspace v1.0</span>
        </div>
      </footer>

      {/* Guided Tour & Presentation Overlays */}
      <SpotlightOverlay />
      <PresentationBar />
    </div>
  );
}
