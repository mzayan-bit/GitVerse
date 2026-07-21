import { useState } from 'react';
import { useEntityManager } from '@/entities/EntityManager';
import { useImpactManager } from '@/intelligence/impact/ImpactManager';
import { SimulationScenarioType } from '@/intelligence/impact';
import { v4 as uuidv4 } from 'uuid';
import { Activity, Play, Settings2 } from 'lucide-react';

export function SimulationWorkspace() {
  const { entities } = useEntityManager();
  const { runSimulation, isSimulating } = useImpactManager();

  const [type, setType] =
    useState<SimulationScenarioType>('REPOSITORY_DELETED');
  const [targetId, setTargetId] = useState<string>('');

  const repositories = Object.values(entities).filter(
    (e) => e.type === 'REPOSITORY'
  );

  const handleRun = () => {
    if (!targetId) return;

    runSimulation({
      id: uuidv4(),
      name: `Manual Simulation: ${type}`,
      createdAt: Date.now(),
      scenarios: [
        {
          id: uuidv4(),
          type,
          targetId,
        },
      ],
    });
  };

  return (
    <aside className="pointer-events-auto h-full w-[320px] bg-slate-900/50 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="text-xl font-bold text-indigo-400 mb-1">
          Simulation Workspace
        </div>
        <div className="text-sm text-slate-400">Scenario Configuration</div>
      </div>

      {/* Form Details */}
      <div className="flex flex-col gap-4 flex-grow">
        <div className="bg-black/20 p-4 border border-white/5 rounded-lg flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-300 block mb-2 uppercase">
              Scenario Type
            </label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as SimulationScenarioType)
              }
              className="w-full bg-slate-800/50 border border-white/10 rounded-md p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="REPOSITORY_DELETED">Delete Repository</option>
              <option value="VERSION_UPGRADE">Upgrade Dependency</option>
              <option value="API_MODIFICATION">Modify API</option>
              <option value="CONTRIBUTOR_LOSS">
                Contributor Loss (Bus Factor)
              </option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-300 block mb-2 uppercase">
              Target Node
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-md p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="" disabled>
                Select target...
              </option>
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.id}>
                  {repo.metadata?.repository?.name || repo.id}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={handleRun}
        disabled={!targetId || isSimulating}
        className="mt-auto w-full bg-indigo-500 text-white py-3 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all flex items-center justify-center gap-2"
      >
        {isSimulating ? (
          <Activity className="animate-spin w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        {isSimulating ? 'Simulating...' : 'Run Simulation'}
      </button>
    </aside>
  );
}
