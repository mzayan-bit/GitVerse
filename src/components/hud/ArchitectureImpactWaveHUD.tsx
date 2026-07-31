import { Activity, GitCommit, ArrowUpRight } from 'lucide-react';

interface ArchitectureImpactWaveHUDProps {
  serviceName?: string;
  directDeps?: number;
  indirectDeps?: number;
  affectedServices?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'CRITICAL';
}

export function ArchitectureImpactWaveHUD({
  serviceName = 'Core Payment Ledger API',
  directDeps = 6,
  indirectDeps = 14,
  affectedServices = 22,
  riskLevel = 'MEDIUM',
}: ArchitectureImpactWaveHUDProps) {
  return (
    <div className="fixed bottom-12 right-6 z-40 w-80 p-4 rounded-2xl bg-black/85 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] text-white text-xs font-sans select-none animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-sm text-white block">
              {serviceName}
            </span>
            <span className="text-[10px] text-cyan-300/80 font-mono">
              Architecture Impact Wave
            </span>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
            riskLevel === 'CRITICAL'
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : riskLevel === 'MEDIUM'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {riskLevel} RISK
        </span>
      </div>

      {/* Ripple Wave Graphic Placeholder */}
      <div className="relative h-28 rounded-xl bg-gradient-to-b from-cyan-950/30 to-black/60 border border-cyan-500/20 flex items-center justify-center overflow-hidden mb-3">
        {/* Pulsing Ripple Rings */}
        <div className="absolute w-20 h-20 rounded-full border border-cyan-400/40 animate-ping pointer-events-none" />
        <div className="absolute w-12 h-12 rounded-full border border-indigo-500/50 animate-pulse pointer-events-none" />

        <div className="z-10 text-center space-y-1">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <GitCommit className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-gray-300 block font-mono">
            Change Propagation Active
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <span className="text-[9px] text-gray-400 block">Direct</span>
          <span className="font-mono font-bold text-cyan-300">
            {directDeps} Services
          </span>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <span className="text-[9px] text-gray-400 block">Indirect</span>
          <span className="font-mono font-bold text-indigo-300">
            {indirectDeps} Services
          </span>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <span className="text-[9px] text-gray-400 block">Total Impact</span>
          <span className="font-mono font-bold text-purple-300">
            {affectedServices} Nodes
          </span>
        </div>
      </div>

      {/* Footer Link */}
      <button className="w-full mt-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all">
        <span>Open Graph Analysis</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
