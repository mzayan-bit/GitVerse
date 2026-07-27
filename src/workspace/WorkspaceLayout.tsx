import { usePanelStore } from './PanelController';
import { PANEL_REGISTRY, PanelType } from './PanelRegistry';
import { LayoutGrid, RotateCcw } from 'lucide-react';

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const panels = usePanelStore((s) => s.panels);
  const activeDockTab = usePanelStore((s) => s.activeDockTab);
  const openPanel = usePanelStore((s) => s.openPanel);
  const setActiveDockTab = usePanelStore((s) => s.setActiveDockTab);
  const restoreDefaultLayout = usePanelStore((s) => s.restoreDefaultLayout);

  const leftPanels = panels.filter((p) => p.dockPosition === 'left');
  const rightPanels = panels.filter((p) => p.dockPosition === 'right');

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Top Workspace Toolbar */}
      <header className="absolute top-0 left-0 right-0 h-10 z-40 bg-black/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase text-indigo-400">
            <LayoutGrid className="w-4 h-4" />
            <span>Workspace</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Quick Panel Openers */}
          <div className="flex items-center gap-1">
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
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={restoreDefaultLayout}
            title="Reset Layout"
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
                  activeDockTab.left === p.id
                    ? 'border-indigo-500 text-indigo-300 bg-white/5'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{PANEL_REGISTRY[p.type].title}</span>
              </button>
            ))}
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
                  activeDockTab.right === p.id
                    ? 'border-indigo-500 text-indigo-300 bg-white/5'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{PANEL_REGISTRY[p.type].title}</span>
              </button>
            ))}
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
    </div>
  );
}
