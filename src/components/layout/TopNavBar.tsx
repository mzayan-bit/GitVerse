import { Search, Sparkles, User } from 'lucide-react';
import { WorkspaceModeController } from '@/workspace/WorkspaceModeController';

interface TopNavBarProps {
  onOpenSearch?: () => void;
}

export function TopNavBar({ onOpenSearch }: TopNavBarProps) {
  const modeController = WorkspaceModeController.getInstance();
  const activeModeInfo = modeController.getActiveModeInfo();

  return (
    <header
      aria-label="Top Header Navigation"
      className="absolute top-0 left-0 right-0 h-12 z-40 bg-[#0B0F17]/90 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-4 text-white font-sans select-none"
    >
      {/* Left: Brand Logo & Current Workspace Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <span className="tracking-tight">GitVerse</span>
        </div>

        <div className="h-3.5 w-px bg-white/15" />

        {/* Current Active Mode Indicator */}
        <span className="text-[11px] font-mono text-gray-400 tracking-wide uppercase">
          {activeModeInfo?.name || 'EXPLORE UNIVERSE'}
        </span>
      </div>

      {/* Center: Universal Command & Search Bar Trigger (⌘K) */}
      <button
        onClick={onOpenSearch}
        aria-label="Open Command Palette (⌘K)"
        className="flex items-center gap-2.5 px-3.5 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl text-gray-300 hover:text-white transition-all w-full max-w-sm shadow-inner"
      >
        <Search className="w-3.5 h-3.5 text-purple-400" />
        <span className="flex-1 text-left text-gray-400 text-[11px]">
          Search or jump to command (⌘K)...
        </span>
        <kbd className="px-1.5 py-0.5 text-[9px] bg-white/10 rounded font-mono text-gray-400 border border-white/10">
          ⌘K
        </kbd>
      </button>

      {/* Right: User Avatar */}
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 cursor-pointer hover:scale-105 transition-transform"
          title="User Profile"
        >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
