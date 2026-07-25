import React from 'react';
import { ChaosScenario, ChaosFailureDefinition } from '@/simulation/types';
import { Plus, Trash2, Target } from 'lucide-react';

interface Props {
  scenario: ChaosScenario;
  setScenario: (s: ChaosScenario) => void;
}

export function ScenarioBuilder({ scenario, setScenario }: Props) {
  const addFailure = () => {
    const newFailure: ChaosFailureDefinition = {
      type: 'database_outage',
      targetId: 'db-primary-cluster',
      config: {},
      startTimeOffsetMs: 0,
    };
    setScenario({ ...scenario, failures: [...scenario.failures, newFailure] });
  };

  const removeFailure = (index: number) => {
    const newFailures = [...scenario.failures];
    newFailures.splice(index, 1);
    setScenario({ ...scenario, failures: newFailures });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase text-gray-400 font-bold tracking-wider mb-2">
            Scenario Name
          </label>
          <input
            type="text"
            value={scenario.name}
            onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div>
          <label className="block text-xs uppercase text-gray-400 font-bold tracking-wider mb-2">
            Description
          </label>
          <textarea
            value={scenario.description}
            onChange={(e) =>
              setScenario({ ...scenario, description: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 h-24"
            placeholder="Describe the blast radius hypothesis..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-sm uppercase text-gray-300 font-bold tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            Injected Failures
          </h3>
          <button
            onClick={addFailure}
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20"
          >
            <Plus className="w-3 h-3" /> Add Failure Event
          </button>
        </div>

        {scenario.failures.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-4 group hover:border-white/20 transition-colors"
          >
            <div className="w-48">
              <label className="block text-[10px] uppercase text-gray-500 mb-1">
                Failure Type
              </label>
              <select
                value={f.type}
                onChange={(e) => {
                  const newFailures = [...scenario.failures];
                  newFailures[i].type = e.target
                    .value as ChaosFailureDefinition['type'];
                  setScenario({ ...scenario, failures: newFailures });
                }}
                className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-gray-300"
              >
                <option value="database_outage">Database Outage</option>
                <option value="region_loss">Cloud Region Loss</option>
                <option value="latency_spike">Network Latency Spike</option>
                <option value="node_failure">K8s Node Failure</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[10px] uppercase text-gray-500 mb-1">
                Target Graph ID
              </label>
              <input
                type="text"
                value={f.targetId}
                onChange={(e) => {
                  const newFailures = [...scenario.failures];
                  newFailures[i].targetId = e.target.value;
                  setScenario({ ...scenario, failures: newFailures });
                }}
                className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-gray-300"
                placeholder="e.g. auth-service-db"
              />
            </div>

            <div className="w-32">
              <label className="block text-[10px] uppercase text-gray-500 mb-1">
                Offset (ms)
              </label>
              <input
                type="number"
                value={f.startTimeOffsetMs}
                onChange={(e) => {
                  const newFailures = [...scenario.failures];
                  newFailures[i].startTimeOffsetMs = Number(e.target.value);
                  setScenario({ ...scenario, failures: newFailures });
                }}
                className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-gray-300"
              />
            </div>

            <button
              onClick={() => removeFailure(i)}
              className="p-2 text-gray-500 hover:text-red-400 mt-4 rounded-lg hover:bg-white/5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {scenario.failures.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-xs border border-dashed border-white/10 rounded-lg">
            No failures injected. The simulation will run cleanly.
          </div>
        )}
      </div>
    </div>
  );
}
