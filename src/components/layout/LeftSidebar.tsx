import { Compass, Network, Bot, Package, Settings } from 'lucide-react';
import {
  WorkspaceModeController,
  WorkspaceMode,
} from '@/workspace/WorkspaceModeController';
import { usePanelStore } from '@/workspace/PanelController';
import { PanelType } from '@/workspace/PanelRegistry';

interface LeftSidebarProps {
  onOpenPanel?: (panelType: string) => void;
}

export function LeftSidebar({ onOpenPanel }: LeftSidebarProps) {
  const modeController = WorkspaceModeController.getInstance();
  const currentMode = modeController.getMode();
  const openPanel = usePanelStore((s) => s.openPanel);

  const navItems: Array<{
    mode: WorkspaceMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    panel: string;
  }> = [
    {
      mode: 'EXPLORE',
      label: 'Explore 3D Universe',
      icon: Compass,
      panel: 'explorer',
    },
    {
      mode: 'ANALYZE',
      label: 'Architecture & Graph',
      icon: Network,
      panel: 'graph',
    },
    { mode: 'AI', label: 'Spatial AI Copilot', icon: Bot, panel: 'ai' },
    {
      mode: 'PRESENTATION',
      label: 'Keynote Demo Tour',
      icon: Package,
      panel: 'demo',
    },
    {
      mode: 'DEV',
      label: 'Dev & Operations Settings',
      icon: Settings,
      panel: 'release',
    },
  ];

  const handleSelectNav = (item: (typeof navItems)[0]) => {
    modeController.setMode(item.mode);
    if (onOpenPanel) {
      onOpenPanel(item.panel);
    } else {
      openPanel(item.panel as PanelType);
    }
  };

  return (
    <aside
      aria-label="Workspace Navigation Rail"
      className="absolute top-12 bottom-0 left-0 z-30 w-14 bg-[#0B0F17]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col items-center py-4 font-sans select-none"
    >
      {/* Primary Rail Navigation Buttons */}
      <div className="space-y-3 w-full px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentMode === item.mode;
          return (
            <button
              key={idx}
              onClick={() => handleSelectNav(item)}
              className={`group relative w-full h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5 text-purple-400 shrink-0" />

              {/* Clean Floating Hover Tooltip */}
              <div className="absolute left-16 px-2.5 py-1 rounded-lg bg-black/90 border border-white/10 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
