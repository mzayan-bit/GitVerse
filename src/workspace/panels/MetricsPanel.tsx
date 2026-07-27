import { BarChart2 } from 'lucide-react';

export function MetricsPanel() {
  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-amber-400">
        <BarChart2 className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          OpenTelemetry Telemetry
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono">
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
          <span className="text-gray-500 text-[10px]">Avg Latency</span>
          <p className="text-emerald-400 font-bold text-sm">24ms</p>
        </div>
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
          <span className="text-gray-500 text-[10px]">Success Rate</span>
          <p className="text-sky-400 font-bold text-sm">99.98%</p>
        </div>
      </div>
    </div>
  );
}
