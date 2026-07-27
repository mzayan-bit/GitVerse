import { Cpu, Play } from 'lucide-react';

export function SimulationPanel() {
  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 text-emerald-400">
          <Cpu className="w-4 h-4" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Chaos & Impact Sandbox
          </span>
        </div>
        <button className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-[10px] font-bold text-white flex items-center gap-1">
          <Play className="w-3 h-3" /> Run Simulation
        </button>
      </div>

      <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px]">
        <p className="text-gray-400">
          No active chaos experiments running in sandbox environment.
        </p>
      </div>
    </div>
  );
}
