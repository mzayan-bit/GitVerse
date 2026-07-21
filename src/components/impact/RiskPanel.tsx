import { useImpactManager } from '@/intelligence/impact/ImpactManager';
import { useEntityManager } from '@/entities/EntityManager';
import { ShieldAlert } from 'lucide-react';

export function RiskPanel() {
  const report = useImpactManager((s) => s.report);
  const entities = useEntityManager((s) => s.entities);

  if (!report) {
    return (
      <aside className="pointer-events-auto h-full w-[320px] bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 shadow-xl flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
        <p className="text-slate-400 text-sm">
          Run a simulation to view impact report.
        </p>
      </aside>
    );
  }

  const isRiskHigh = report.globalRiskDelta > 10;

  return (
    <aside className="pointer-events-auto h-full w-[320px] bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 shadow-xl flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="text-xl font-bold text-orange-400 mb-1">RiskPanel</div>
        <div className="text-sm text-slate-400">Impact Report</div>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        {/* Highlight Stat */}
        <div className="bg-black/30 border border-white/10 rounded-md p-4 relative overflow-hidden">
          <div
            className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-xl ${isRiskHigh ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}
          ></div>
          <div className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-2">
            Global Risk Delta
          </div>
          <div
            className={`text-4xl font-bold drop-shadow-md ${isRiskHigh ? 'text-red-400' : 'text-emerald-400'}`}
          >
            {report.globalRiskDelta > 0 ? '+' : ''}
            {report.globalRiskDelta.toFixed(1)}%
          </div>
        </div>

        {/* Affected List */}
        <div>
          <div className="text-xs font-semibold tracking-wider text-slate-400 mb-3 flex items-center justify-between uppercase">
            <span>Affected Repositories</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white">
              {report.affectedRepositories.length}
            </span>
          </div>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {report.affectedRepositories.length === 0 ? (
              <div className="text-sm text-slate-500 italic p-2">
                None affected.
              </div>
            ) : (
              report.affectedRepositories.map((id) => {
                const entity = entities[id];
                const repo = entity?.metadata?.repository as { name?: string };
                const name = repo?.name || id;
                return (
                  <div
                    key={id}
                    className="group flex items-center justify-between bg-black/20 p-3 rounded-md border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span
                        className="font-mono text-sm text-white truncate max-w-[150px]"
                        title={name}
                      >
                        {name}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
