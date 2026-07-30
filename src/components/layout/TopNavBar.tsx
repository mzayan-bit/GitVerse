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
    <header className="fixed top-0 left-0 right-0 h-12 z-40 bg-[#0B0F17]/95 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-4 text-white font-sans select-none shadow-2xl">
      {/* Left: Brand Logo & Compact Search */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 font-bold text-sm text-white cursor-pointer">
          <div className="p-1 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="tracking-tight font-extrabold text-white text-base">
            GitVerse
          </span>
          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] border border-purple-500/30">
            v1.0 GA
          </span>
        </div>

        {/* Compact Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl text-gray-300 hover:text-white transition-all shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline text-gray-400 text-[11px]">
            Search (⌘K)...
          </span>
          <kbd className="px-1.5 py-0.5 text-[9px] bg-white/10 rounded font-mono text-gray-400 border border-white/10">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center: Prominent Experience Mode Switcher (Pills) */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/60 border border-white/10 text-xs shadow-inner">
        {(
          ['EXPLORE', 'ANALYZE', 'AI', 'PRESENTATION', 'DEV'] as WorkspaceMode[]
        ).map((mode) => (
          <button
            key={mode}
            onClick={() => handleSelectMode(mode)}
            className={`px-3 py-1 rounded-xl font-semibold transition-all ${
              currentMode === mode
                ? 'bg-purple-600 text-white shadow-[0_0_14px_rgba(139,92,246,0.6)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {mode === 'AI'
              ? 'AI Copilot'
              : mode.charAt(0) + mode.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Right: Quick Demo & User Avatar */}
      <div className="flex items-center gap-2 shrink-0">
        {onLaunchDemo && (
          <button
            onClick={onLaunchDemo}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-xl transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Keynote</span>
          </button>
        )}

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Notification Bell */}
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </button>

        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 cursor-pointer hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
