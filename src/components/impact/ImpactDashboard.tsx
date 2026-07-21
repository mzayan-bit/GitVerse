import { useImpactManager } from '@/intelligence/impact/ImpactManager';
import { SimulationWorkspace } from './SimulationWorkspace';
import { RiskPanel } from './RiskPanel';
import { DependencyExplorer } from './DependencyExplorer';
import { X } from 'lucide-react';

export function ImpactDashboard() {
  const { isActive, closeImpactMode } = useImpactManager();

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] font-sans overflow-hidden antialiased">
      {/* 3D Scene underlay handles the background visualization */}

      {/* TopNavBar */}
      <nav className="absolute top-0 w-full z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 shadow-sm flex justify-between items-center h-16 px-6">
        <div className="text-lg font-bold tracking-tight text-white">
          Impact Analysis Mode
        </div>
        <button
          onClick={closeImpactMode}
          className="text-slate-300 hover:text-white hover:bg-white/5 transition-colors p-2 rounded-full flex items-center justify-center"
        >
          <X size={20} />
        </button>
      </nav>

      {/* Main Workspace Area */}
      <div className="absolute inset-0 top-16 bottom-[260px] flex justify-between z-40 pointer-events-none">
        <SimulationWorkspace />
        <RiskPanel />
      </div>

      {/* Bottom Footer */}
      <DependencyExplorer />
    </div>
  );
}
