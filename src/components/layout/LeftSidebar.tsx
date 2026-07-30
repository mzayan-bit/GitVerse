import { useState } from 'react';
import {
  Home,
  Compass,
  Network,
  Bot,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  WorkspaceModeController,
  WorkspaceMode,
} from '@/workspace/WorkspaceModeController';

interface LeftSidebarProps {
  onOpenPanel?: (panelType: string) => void;
}

export function LeftSidebar({ onOpenPanel }: LeftSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const modeController = WorkspaceModeController.getInstance();
  const [activeMode, setActiveMode] = useState<WorkspaceMode>(
    modeController.getMode()
  );

  const navItems: Array<{
    id: WorkspaceMode | 'HOME' | 'SETTINGS';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    panel?: string;
  }> = [
    { id: 'EXPLORE', label: 'Home Universe', icon: Home, panel: 'explorer' },
    { id: 'EXPLORE', label: 'Explore 3D', icon: Compass, panel: 'cosmos' },
    { id: 'ANALYZE', label: 'Analyze Graph', icon: Network, panel: 'graph' },
    { id: 'AI', label: 'AI Copilot', icon: Bot, panel: 'ai' },
    { id: 'PRESENTATION', label: 'Keynote Demo', icon: Package, panel: 'demo' },
    { id: 'DEV', label: 'Dev & Settings', icon: Settings, panel: 'release' },
  ];

  const handleSelectNav = (item: (typeof navItems)[0]) => {
    if (item.id !== 'HOME' && item.id !== 'SETTINGS') {
      modeController.setMode(item.id as WorkspaceMode);
      setActiveMode(item.id as WorkspaceMode);
    }
    if (item.panel && onOpenPanel) {
      onOpenPanel(item.panel);
    }
  };

  return (
    <aside
      className={`absolute top-12 bottom-6 left-0 z-40 bg-[#0B0F17]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between py-3 transition-all duration-300 font-sans select-none ${
        isCollapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Nav List */}
      <div className="space-y-1 px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;
          return (
            <button
              key={idx}
              onClick={() => handleSelectNav(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)] font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 text-purple-400 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Button */}
      <div className="px-2 pt-3 border-t border-white/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center justify-between w-full text-xs font-mono px-1">
              <span>Collapse</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
