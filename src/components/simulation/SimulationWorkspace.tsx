import React, { useState } from 'react';
import {
  Activity,
  Beaker,
  Play,
  RotateCcw,
  AlertTriangle,
  FileWarning,
  Eye,
  ShieldAlert,
  X,
} from 'lucide-react';
import { SimulationEngine } from '@/simulation/core/SimulationEngine';
import {
  ChaosScenario,
  PredictionReport as IPredictionReport,
} from '@/simulation/types';
import { ScenarioBuilder } from './ScenarioBuilder';
import { PredictionReport } from './PredictionReport';
import { RecoveryTimeline } from './RecoveryTimeline';

export function SimulationWorkspace() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'builder' | 'timeline' | 'report' | 'recovery'
  >('builder');
  const [scenario, setScenario] = useState<ChaosScenario>({
    id: crypto.randomUUID(),
    name: 'New Scenario',
    description: '',
    failures: [],
  });
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<IPredictionReport | null>(null);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    try {
      const engine = SimulationEngine.getInstance();
      engine.createSimulation('Test Run');
      const result = await engine.runScenario(scenario);
      setReport(result);
      setActiveTab('report');
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRollback = () => {
    SimulationEngine.getInstance().rollback();
    setReport(null);
    setActiveTab('builder');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 p-4 rounded-full bg-purple-900/60 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/80 shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all group"
      >
        <Beaker className="w-6 h-6 text-purple-300 group-hover:text-purple-200" />
      </button>
    );
  }

  return (
    <div className="fixed inset-4 md:inset-10 z-50 flex flex-col bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-transparent">
        <div className="flex items-center gap-3">
          <Beaker className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white tracking-widest uppercase">
            Simulation Sandbox
          </h2>
          <div className="flex items-center gap-2 ml-6 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <ShieldAlert className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-sans tracking-wide">
              ISOLATED ENVIRONMENT
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/50">
        <div className="flex gap-2">
          {(['builder', 'timeline', 'report', 'recovery'] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab === 'builder' && <AlertTriangle className="w-4 h-4" />}
                {tab === 'timeline' && <Activity className="w-4 h-4" />}
                {tab === 'report' && <FileWarning className="w-4 h-4" />}
                {tab === 'recovery' && <RotateCcw className="w-4 h-4" />}
                {tab}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleRollback}
            disabled={!report}
            className="px-4 py-2 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Rollback
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isRunning || scenario.failures.length === 0}
            className="px-6 py-2 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all font-bold tracking-wide disabled:opacity-50 disabled:shadow-none"
          >
            {isRunning ? (
              <Activity className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            RUN SIMULATION
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
          {activeTab === 'builder' && (
            <ScenarioBuilder scenario={scenario} setScenario={setScenario} />
          )}
          {activeTab === 'report' && report && (
            <PredictionReport report={report} />
          )}
          {activeTab === 'report' && !report && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Eye className="w-12 h-12 mb-4 opacity-20" />
              <p>Run a simulation to view the predictive report.</p>
            </div>
          )}
          {activeTab === 'recovery' && report && (
            <RecoveryTimeline report={report} />
          )}
        </div>
      </div>
    </div>
  );
}
