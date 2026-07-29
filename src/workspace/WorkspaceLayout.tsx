import { useState, useEffect } from 'react';
import { usePanelStore } from './PanelController';
import { PANEL_REGISTRY, PanelType } from './PanelRegistry';
import { PanelRenderer } from './PanelRenderer';
import {
  Search,
  Bot,
  Compass,
  Network,
  Activity,
  Package,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SpotlightOverlay } from '@/demo/onboarding/SpotlightOverlay';
import { PresentationBar } from '@/demo/onboarding/PresentationBar';
import { ContextualInspectorDrawer } from './ContextualInspectorDrawer';
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
  const restoreDefaultLayout = usePanelStore((s) => s.restoreDefaultLayout);

  useEffect(() => {
    return modeController.subscribe((mode) => {
      setCurrentMode(mode);
    });
  }, [modeController]);

  const handleSelectMode = (mode: WorkspaceMode) => {
    modeController.setMode(mode);
    const modeInfo = WorkspaceModeController.MODES[mode];
    if (modeInfo.primaryPanels.length > 0) {
      openPanel(modeInfo.primaryPanels[0] as PanelType);
    }
  };

  const leftPanels = panels.filter((p) => p.dockPosition === 'left');
  const rightPanels = panels.filter((p) => p.dockPosition === 'right');
  const floatingPanels = panels.filter((p) => p.dockPosition === 'floating');

  const activeLeftPanel =
    leftPanels.find((p) => p.id === activeDockTab.left) || leftPanels[0];
  const activeRightPanel =
    rightPanels.find((p) => p.id === activeDockTab.right) || rightPanels[0];

  return (
    <div className="relative w-full h-full overflow-hidden select-none font-sans bg-black">
      {/* Calm Next-Gen Top Header */}
      <header className="absolute top-0 left-0 right-0 h-11 z-40 bg-black/85 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-4 text-white">
        {/* Left Brand & Workspace Modes */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-xs tracking-wider text-white">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>GitVerse</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] border border-indigo-500/30">
              v1.0 GA
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* 4 Core Workspace Modes */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10">
            <button
              onClick={() => handleSelectMode('EXPLORE')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                currentMode === 'EXPLORE'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => handleSelectMode('ARCHITECTURE')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                currentMode === 'ARCHITECTURE'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>

            <button
              onClick={() => handleSelectMode('OPERATIONS')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                currentMode === 'OPERATIONS'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Operations</span>
            </button>

            <button
              onClick={() => handleSelectMode('EXTENSIONS')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                currentMode === 'EXTENSIONS'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Extensions</span>
            </button>
          </div>
        </div>

        {/* Center / Right Quick Tools & Search */}
        <div className="flex items-center gap-2">
          {/* Command Palette Button */}
          <button
            onClick={onOpenSearch || onToggleCommandCenter}
            className="flex items-center gap-2 px-3 py-1 text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-lg text-gray-300 hover:text-white transition-all w-60"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span className="flex-1 text-left text-gray-400">
              Search commands or entities...
            </span>
            <kbd className="px-1.5 py-0.5 text-[9px] bg-white/10 rounded font-mono text-gray-400 border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* AI Copilot Pill */}
          <button
            onClick={() => openPanel('ai')}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 rounded-lg transition-all"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>Spatial AI</span>
          </button>

          {/* Recruiter Keynote 60s Tour */}
          <button
            onClick={() => openPanel('demo')}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Keynote Tour</span>
          </button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Layout Reset */}
          <button
            onClick={restoreDefaultLayout}
            title="Reset Workspace Layout"
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main 3D Viewport Area */}
      <div className="absolute inset-0 pt-11 pb-6 pointer-events-auto">
        {children}
      </div>

      {/* Floating Windows Layer */}
      {floatingPanels.map((p) => (
        <PanelRenderer key={p.id} panel={p} />
      ))}

      {/* Left Dock Panel Bar */}
      {leftPanels.length > 0 && (
        <aside className="absolute top-11 bottom-6 left-0 w-80 z-30 bg-black/85 backdrop-blur-2xl border-r border-white/10 flex flex-col pointer-events-auto shadow-2xl">
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
        <aside className="absolute top-11 bottom-6 right-0 w-88 z-30 bg-black/85 backdrop-blur-2xl border-l border-white/10 flex flex-col pointer-events-auto shadow-2xl">
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
          <span className="text-emerald-400 font-bold">
            MODE: {currentMode}
          </span>
          <span>Panels: {panels.length} Active</span>
        </div>
        <div>
          <span>GitVerse v1.0 GA Platform</span>
        </div>
      </footer>

      {/* Contextual Overlays */}
      <ContextualInspectorDrawer />
      <SpotlightOverlay />
      <PresentationBar />
    </div>
  );
}
