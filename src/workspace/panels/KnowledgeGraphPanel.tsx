import { Network } from 'lucide-react';

export function KnowledgeGraphPanel() {
  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-purple-400">
        <Network className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Graph Topology
        </span>
      </div>

      <div className="space-y-2">
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center">
          <span>Total Nodes</span>
          <span className="font-mono text-purple-300 font-bold">142</span>
        </div>
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center">
          <span>Cross Dependencies</span>
          <span className="font-mono text-emerald-400 font-bold">
            389 Edges
          </span>
        </div>
      </div>
    </div>
  );
}
