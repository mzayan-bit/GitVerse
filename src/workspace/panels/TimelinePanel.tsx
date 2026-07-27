import { History } from 'lucide-react';

export function TimelinePanel() {
  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-sky-400">
        <History className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Repository Evolutionary Timeline
        </span>
      </div>
      <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-400">
        <span>
          Timeline scrubber ready. Select a repository to visualize commit
          evolution.
        </span>
      </div>
    </div>
  );
}
