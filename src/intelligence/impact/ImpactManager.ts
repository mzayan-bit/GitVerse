import { create } from 'zustand';
import { ImpactReport, SimulationContext } from './ImpactTypes';
import { SimulationEngine } from './simulation';
import { useGraphManager } from '../KnowledgeGraph/GraphManager';
import { ImpactEngine } from './ImpactEngine';

interface ImpactState {
  isActive: boolean;
  isSimulating: boolean;
  context: SimulationContext | null;
  report: ImpactReport | null;

  // UI Actions
  openImpactMode: () => void;
  closeImpactMode: () => void;
  runSimulation: (context: SimulationContext) => void;
  clearSimulation: () => void;
}

export const useImpactManager = create<ImpactState>((set) => ({
  isActive: false,
  isSimulating: false,
  context: null,
  report: null,

  openImpactMode: () => set({ isActive: true }),

  closeImpactMode: () => set({ isActive: false, context: null, report: null }),

  runSimulation: (context) => {
    set({ isSimulating: true, context });

    // Defer simulation to avoid blocking UI immediately
    setTimeout(() => {
      try {
        const baseGraph = useGraphManager.getState().graph;
        if (!baseGraph) {
          throw new Error('Knowledge Graph is not initialized.');
        }

        const engine = new SimulationEngine();
        const impactEngine = new ImpactEngine();
        const initializedGraph = impactEngine.initializeImpactGraph(baseGraph);

        const report = engine.runSimulation(initializedGraph, context);

        set({ report, isSimulating: false });
      } catch (err) {
        console.error('Simulation failed:', err);
        set({ isSimulating: false });
      }
    }, 50);
  },

  clearSimulation: () => set({ context: null, report: null }),
}));
