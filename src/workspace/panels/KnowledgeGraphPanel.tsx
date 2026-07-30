import { useState } from 'react';
import {
  Network,
  GitFork,
  ShieldAlert,
  Cpu,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { DemoManager } from '@/demo/DemoManager';

export function KnowledgeGraphPanel() {
  const demoMgr = DemoManager.getInstance();
  const graph = demoMgr.getActiveOrgGraph();
  const [selectedFilter, setSelectedFilter] = useState<
    'ALL' | 'SERVICES' | 'DATABASES'
  >('ALL');

  const filteredNodes = graph.nodes.filter((node) => {
    if (selectedFilter === 'SERVICES') return node.type === 'service';
    if (selectedFilter === 'DATABASES') return node.type === 'database';
    return true;
  });

  return (
    <div className="space-y-3.5 text-xs text-gray-200 font-sans select-none">
      {/* Header Banner */}
      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400" />
          <div>
            <span className="font-bold text-sm text-white block">
              Dependency Mesh Analysis
            </span>
            <span className="text-[10px] text-purple-300 font-mono">
              Analyze & Graph Mode
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
          NODES: {graph.nodes.length}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10 text-[11px]">
        {(['ALL', 'SERVICES', 'DATABASES'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`flex-1 py-1 rounded-lg font-medium transition-all ${
              selectedFilter === filter
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)] font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <Layers className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
          <span className="text-white font-bold block">
            {graph.nodes.length}
          </span>
          <span className="text-gray-400 text-[9px]">NODES</span>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <GitFork className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
          <span className="text-white font-bold block">
            {graph.edges.length}
          </span>
          <span className="text-gray-400 text-[9px]">EDGES</span>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <Cpu className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
          <span className="text-emerald-400 font-bold block">0</span>
          <span className="text-gray-400 text-[9px]">CIRCULAR LOOPS</span>
        </div>
      </div>

      {/* Active Node Mesh List */}
      <div className="space-y-1.5 border-t border-white/10 pt-3">
        <span className="text-[10px] text-gray-400 font-medium block">
          Active Topology Nodes:
        </span>
        <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-[11px] transition-all"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    node.type === 'database' ? 'bg-cyan-400' : 'bg-purple-400'
                  }`}
                />
                <span className="font-semibold text-white">{node.name}</span>
              </div>
              <span className="font-mono text-[9px] text-gray-400 uppercase">
                {node.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dependency Edge Connections */}
      <div className="space-y-1.5 border-t border-white/10 pt-3">
        <span className="text-[10px] text-gray-400 font-medium block">
          Dependency Connections:
        </span>
        <div className="space-y-1">
          {graph.edges.map((edge, i) => (
            <div
              key={i}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-[10px] flex items-center justify-between font-mono"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-300">{edge.source}</span>
                <span className="text-gray-500">➔</span>
                <span className="text-purple-300">{edge.target}</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {edge.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Wave Trigger */}
      <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-cyan-300 text-[11px]">
            Impact Wave Simulation Active
          </span>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 cursor-pointer" />
      </div>
    </div>
  );
}
