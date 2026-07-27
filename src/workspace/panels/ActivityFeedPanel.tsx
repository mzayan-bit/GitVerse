import { Activity } from 'lucide-react';

export function ActivityFeedPanel() {
  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-emerald-400">
        <Activity className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Real-Time Event Stream
        </span>
      </div>
      <div className="space-y-1.5 font-mono text-[10px]">
        <div className="p-2 rounded bg-white/5 border border-white/5 flex justify-between">
          <span className="text-indigo-300">push -&gt; main</span>
          <span className="text-gray-500">2m ago</span>
        </div>
        <div className="p-2 rounded bg-white/5 border border-white/5 flex justify-between">
          <span className="text-emerald-300">deploy -&gt; prod</span>
          <span className="text-gray-500">5m ago</span>
        </div>
      </div>
    </div>
  );
}
