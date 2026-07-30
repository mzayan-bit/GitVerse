import { useState } from 'react';
import { Search, Bell, Sparkles, User, Play } from 'lucide-react';
import {
  WorkspaceModeController,
  WorkspaceMode,
} from '@/workspace/WorkspaceModeController';

interface TopNavBarProps {
  onOpenSearch?: () => void;
  onLaunchDemo?: () => void;
}

export function TopNavBar({ onOpenSearch, onLaunchDemo }: TopNavBarProps) {
  const modeController = WorkspaceModeController.getInstance();
  const [currentMode, setCurrentMode] = useState<WorkspaceMode>(
    modeController.getMode()
  );

  const handleSelectMode = (mode: WorkspaceMode) => {
    modeController.setMode(mode);
    setCurrentMode(mode);
  };

  return (
    <header className="absolute top-0 left-0 right-0 h-12 z-40 bg-[#0B0F17]/90 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-4 text-white font-sans select-none">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <div className="p-1 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="tracking-tight">GitVerse</span>
          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] border border-purple-500/30">
            v1.0 GA
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar (⌘K) */}
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-2.5 px-3.5 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl text-gray-300 hover:text-white transition-all w-full max-w-md shadow-inner"
      >
        <Search className="w-3.5 h-3.5 text-purple-400" />
        <span className="flex-1 text-left text-gray-400 text-[11px]">
          Search repositories, services, dependencies (⌘K)...
        </span>
        <kbd className="px-1.5 py-0.5 text-[9px] bg-white/10 rounded font-mono text-gray-400 border border-white/10">
          ⌘K
        </kbd>
      </button>

      {/* Right: Mode Switcher, Quick Tour & Avatar */}
      <div className="flex items-center gap-3">
        {/* Mode Quick Selector Dropdown */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10 text-[11px]">
          {(
            [
              'EXPLORE',
              'ANALYZE',
              'AI',
              'PRESENTATION',
              'DEV',
            ] as WorkspaceMode[]
          ).map((mode) => (
            <button
              key={mode}
              onClick={() => handleSelectMode(mode)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentMode === mode
                  ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)] font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode.charAt(0) + mode.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* 60s Keynote Launcher Button */}
        {onLaunchDemo && (
          <button
            onClick={onLaunchDemo}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-xl transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>60s Tour</span>
          </button>
        )}

        <div className="h-4 w-px bg-white/10" />

        {/* Notification Bell */}
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </button>

        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 cursor-pointer">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
