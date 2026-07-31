import { useState, useEffect } from 'react';
import {
  Command as CommandIcon,
  Navigation,
  Bot,
  LayoutGrid,
  Palette,
  BarChart2,
  X,
  CornerDownLeft,
  Compass,
  Network,
  Activity,
  Package,
  Sparkles,
  Play,
  Rocket,
} from 'lucide-react';
import { usePanelStore } from '../PanelController';
import { useThemeManager } from '@/rendering/themes/ThemeManager';
import { useCameraRig } from '@/navigation/camera/CameraRig';
import {
  WorkspaceModeController,
  WorkspaceMode,
} from '../WorkspaceModeController';
import { PresentationModeController } from '@/demo/onboarding/PresentationModeController';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openPanel = usePanelStore((s) => s.openPanel);
  const setTheme = useThemeManager.getState().setTheme;
  const setMode = useCameraRig.getState().setMode;
  const modeController = WorkspaceModeController.getInstance();

  const handleSwitchMode = (mode: WorkspaceMode) => {
    modeController.setMode(mode);
  };

  const defaultCommands = [
    {
      id: 'cmd-mode-explore',
      category: 'Workspace Modes',
      title: 'Switch Mode: Explore 3D Universe',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      action: () => handleSwitchMode('EXPLORE'),
    },
    {
      id: 'cmd-mode-architecture',
      category: 'Workspace Modes',
      title: 'Switch Mode: Analyze Architecture & Graph',
      icon: <Network className="w-4 h-4 text-purple-400" />,
      action: () => handleSwitchMode('ANALYZE'),
    },
    {
      id: 'cmd-mode-operations',
      category: 'Workspace Modes',
      title: 'Switch Mode: Dev & Operations Telemetry',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      action: () => handleSwitchMode('DEV'),
    },
    {
      id: 'cmd-mode-extensions',
      category: 'Workspace Modes',
      title: 'Switch Mode: Spatial AI Copilot',
      icon: <Package className="w-4 h-4 text-indigo-400" />,
      action: () => handleSwitchMode('AI'),
    },
    {
      id: 'cmd-demo-keynote',
      category: 'Keynote Showcase',
      title: 'Launch WWDC-Style Automatic Keynote Showcase Tour',
      icon: <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />,
      action: () => {
        PresentationModeController.getInstance().startPresentation();
      },
    },
    {
      id: 'cmd-release-center',
      category: 'Release Center',
      title: 'Open GitVerse v1.0 GA Release Center',
      icon: <Rocket className="w-4 h-4 text-amber-400" />,
      action: () => openPanel('release'),
    },
    {
      id: 'cmd-ai',
      category: 'Spatial AI',
      title: 'Ask Spatial AI Copilot Assistant',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      action: () => openPanel('ai'),
    },
    {
      id: 'cmd-cosmos',
      category: 'Graphics & Cosmos',
      title: 'Open Cosmos Control Center',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => openPanel('cosmos'),
    },
    {
      id: 'cmd-explore',
      category: 'Workspace Panels',
      title: 'Open Repository Explorer',
      icon: <LayoutGrid className="w-4 h-4 text-indigo-400" />,
      action: () => openPanel('explorer'),
    },
    {
      id: 'cmd-metrics',
      category: 'Dashboards',
      title: 'Open Telemetry & Observability',
      icon: <BarChart2 className="w-4 h-4 text-sky-400" />,
      action: () => openPanel('metrics'),
    },
    {
      id: 'cmd-fly-mode',
      category: 'Camera & Navigation',
      title: 'Switch Camera to 6DoF Flight Mode',
      icon: <Navigation className="w-4 h-4 text-amber-400" />,
      action: () => setMode('fly'),
    },
    {
      id: 'cmd-orbit-mode',
      category: 'Camera & Navigation',
      title: 'Switch Camera to Orbit Mode',
      icon: <Navigation className="w-4 h-4 text-indigo-400" />,
      action: () => setMode('orbit'),
    },
    {
      id: 'cmd-theme-space',
      category: 'Themes',
      title: 'Switch Theme to Deep Space',
      icon: <Palette className="w-4 h-4 text-blue-400" />,
      action: () => setTheme('deep_space'),
    },
    {
      id: 'cmd-theme-cyber',
      category: 'Themes',
      title: 'Switch Theme to Cyberpunk Neon',
      icon: <Palette className="w-4 h-4 text-pink-400" />,
      action: () => setTheme('cyberpunk_neon'),
    },
  ];

  const filtered = defaultCommands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length)
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Universal Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-md pointer-events-auto select-none font-sans"
    >
      <div className="w-full max-w-2xl bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/5 gap-3">
          <CommandIcon className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search commands, modes, actions, or jump to 3D entities (⌘K)..."
            aria-label="Search Command Palette"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] bg-white/10 rounded font-mono text-gray-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            aria-label="Close Command Palette"
            className="p-1 text-gray-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              <span>No commands found matching &quot;{query}&quot;</span>
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onPointerOver={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white/10">
                      {cmd.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium">{cmd.title}</p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {cmd.category}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-200">
                      <span>Execute</span>
                      <CornerDownLeft className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
