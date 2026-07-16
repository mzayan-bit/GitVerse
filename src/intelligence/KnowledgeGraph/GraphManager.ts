import { create } from 'zustand';
import { RepositoryGraph } from './RepositoryGraph';

interface GraphManagerState {
  graph: RepositoryGraph | null;
  setGraph: (graph: RepositoryGraph) => void;
  clearGraph: () => void;
}

export const useGraphManager = create<GraphManagerState>((set) => ({
  graph: null,
  setGraph: (graph) => set({ graph }),
  clearGraph: () => set({ graph: null }),
}));
