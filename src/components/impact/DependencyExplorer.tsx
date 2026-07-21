import { useImpactManager } from '@/intelligence/impact/ImpactManager';
import { useEntityManager } from '@/entities/EntityManager';

export function DependencyExplorer() {
  const report = useImpactManager((s) => s.report);
  const entities = useEntityManager((s) => s.entities);

  if (!report || report.criticalPaths.length === 0) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[260px] z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex flex-col p-6 pointer-events-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-2">
        <div className="text-lg font-bold text-slate-300">
          DependencyExplorer{' '}
          <span className="text-xs font-mono text-slate-500 font-normal">
            v2.4.0
          </span>
        </div>
      </div>

      {/* Node Graph Visualization */}
      <div className="flex-grow flex flex-col gap-4 overflow-y-auto custom-scrollbar px-4">
        {report.criticalPaths.slice(0, 5).map((path, index) => (
          <div key={index} className="flex items-center gap-0 min-w-max">
            {path.nodes.map((nodeId, i) => {
              const entity = entities[nodeId];
              const repo = entity?.metadata?.repository as { name?: string };
              const name = repo?.name || nodeId;
              const isTarget = i === path.nodes.length - 1;

              return (
                <div key={nodeId} className="flex items-center">
                  {/* Node */}
                  <div className={`relative group ${isTarget ? 'z-10' : ''}`}>
                    {isTarget && (
                      <div className="absolute -inset-2 bg-red-500/20 blur-lg rounded-md group-hover:bg-red-500/30 transition-all animate-pulse"></div>
                    )}
                    <div
                      className={`relative w-40 p-4 border rounded-md backdrop-blur-md ${isTarget ? 'border-red-500/50 bg-red-900/20 scale-105 shadow-[0_0_20px_rgba(255,180,171,0.15)]' : 'border-white/10 bg-slate-800/80'}`}
                    >
                      <div
                        className="font-mono text-sm text-white mb-1 truncate"
                        title={name}
                      >
                        {name}
                      </div>
                      {isTarget && (
                        <div className="text-[10px] font-bold tracking-wider uppercase text-red-200 bg-red-500/20 px-2 py-1 rounded inline-block mt-1">
                          Cumulative Risk:{' '}
                          {(path.cumulativeRisk * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connection Line (except for last node) */}
                  {i < path.nodes.length - 1 && (
                    <div className="w-16 h-px bg-gradient-to-r from-slate-500/50 to-red-500/50 relative">
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-red-500 top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 shadow-[0_0_10px_#ef4444]"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {report.criticalPaths.length > 5 && (
          <div className="text-slate-500 text-xs italic">
            + {report.criticalPaths.length - 5} more paths hidden.
          </div>
        )}
      </div>
    </footer>
  );
}
