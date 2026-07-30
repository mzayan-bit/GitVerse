import React, { useState } from 'react';
import {
  Home,
  Compass,
  Network,
  Bot,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  EyeOff,
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
  const [isHidden, setIsHidden] = useState(false);
  const modeController = WorkspaceModeController.getInstance();
  const [activeMode, setActiveMode] = useState<WorkspaceMode>(
    modeController.getMode()
  );

  const navItems: Array<{
    id: WorkspaceMode;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    panel?: string;
  }> = [
    {
      id: 'EXPLORE',
      label: 'Home Universe',
      description: '3D Solar System View',
      icon: Home,
      panel: 'explorer',
    },
    {
      id: 'EXPLORE',
      label: 'Explore 3D',
      description: 'Interactive Camera Controls',
      icon: Compass,
      panel: 'cosmos',
    },
    {
      id: 'ANALYZE',
      label: 'Analyze Graph',
      description: 'Dependency Mesh & Impact Waves',
      icon: Network,
      panel: 'graph',
    },
    {
      id: 'AI',
      label: 'AI Copilot',
      description: 'Spatial AI Architecture Assistant',
      icon: Bot,
      panel: 'ai',
    },
    {
      id: 'PRESENTATION',
      label: 'Keynote Demo',
      description: 'Guided Tour & Storytelling',
      icon: Package,
      panel: 'demo',
    },
    {
      id: 'DEV',
      label: 'Dev & Settings',
      description: 'System Metrics & Preferences',
      icon: Settings,
      panel: 'settings',
    },
  ];

  const handleSelectNav = (item: (typeof navItems)[0]) => {
    modeController.setMode(item.id);
    setActiveMode(item.id);
    if (item.panel && onOpenPanel) {
      onOpenPanel(item.panel);
    }
  };

  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className="fixed top-14 left-3 z-40 p-2.5 rounded-xl bg-[#0B0F17]/90 backdrop-blur-xl border border-white/10 text-purple-400 hover:text-white transition-all shadow-xl font-mono text-xs flex items-center gap-1.5"
        title="Show Left Navigation Sidebar"
      >
        <ChevronRight className="w-4 h-4 text-purple-400" />
        <span className="text-[10px] uppercase font-bold">NAV</span>
      </button>
    );
  }

  return (
    <aside
      className={`fixed top-12 bottom-6 left-0 z-40 bg-[#0B0F17]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between py-3 transition-all duration-300 font-sans select-none shadow-2xl ${
        isCollapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Nav Section Header */}
      {!isCollapsed && (
        <div className="px-3 pb-2 mb-1 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
          <span>NAVIGATION</span>
          <span className="text-purple-400 font-bold">GITVERSE</span>
        </div>
      )}

      {/* Nav List */}
      <div className="space-y-1 px-2 flex-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;
          return (
            <button
              key={idx}
              onClick={() => handleSelectNav(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)] font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={
                isCollapsed
                  ? `${item.label} — ${item.description}`
                  : item.description
              }
            >
              <Icon className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
              {!isCollapsed && (
                <div className="flex flex-col items-start text-left truncate">
                  <span className="truncate text-white text-xs">
                    {item.label}
                  </span>
                  <span className="text-[9px] text-gray-500 truncate">
                    {item.description}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse & Hide Controls */}
      <div className="px-2 pt-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center justify-between w-full font-mono text-[10px] px-1">
              <span>Collapse Sidebar</span>
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </div>
          )}
        </button>

        <button
          onClick={() => setIsHidden(true)}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs"
          title="Hide Navigation Sidebar"
        >
          <div className="flex items-center justify-between w-full font-mono text-[10px] px-1">
            <span>Hide Nav</span>
            <EyeOff className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </button>
      </div>
    </aside>
  );
}
