import { create } from 'zustand';
import { GalaxyConfig, GalaxyShape } from './GalaxyTypes';
import { GalaxyGenerator } from './GalaxyGenerator';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { useEntityManager } from '@/entities/EntityManager';
import { useGraphManager } from '@/intelligence/KnowledgeGraph/GraphManager';
import { GraphBuilder } from '@/intelligence/KnowledgeGraph/GraphBuilder';
import { RelationshipEngine } from '@/intelligence/RelationshipEngine';

export type GalaxyCameraMode =
  | 'galaxy-free'
  | 'galaxy-follow'
  | 'solar-system-free'
  | 'solar-system-follow'
  | 'planet-follow';

interface GalaxyState {
  galaxyConfig: GalaxyConfig | null;
  focusedSystemId: string | null;
  cameraMode: GalaxyCameraMode;
  showGalaxyUI: boolean;

  // Actions
  generateGalaxy: (
    seed: string,
    systemCount?: number,
    shape?: GalaxyShape,
    repositories?: RepositoryDomainModel[]
  ) => void;
  setFocusedSystemId: (id: string | null) => void;
  setCameraMode: (mode: GalaxyCameraMode) => void;
  setShowGalaxyUI: (show: boolean) => void;
}

export const useGalaxyManager = create<GalaxyState>((set) => ({
  galaxyConfig: null,
  focusedSystemId: null,
  cameraMode: 'galaxy-free',
  showGalaxyUI: true,

  generateGalaxy: (seed, count = 2000, shape, repositories) => {
    // 2. Clear old state
    set({
      galaxyConfig: null,
      focusedSystemId: null,
      cameraMode: 'galaxy-free',
    });
    useEntityManager.getState().clearEntities();
    useGraphManager.getState().clearGraph();

    // 3. Generate new universe (synchronously creates basic shapes)
    const config = GalaxyGenerator.generate(seed, count, shape, repositories);

    // 4. Build Knowledge Graph if repositories exist
    if (repositories && repositories.length > 0) {
      const graph = GraphBuilder.buildGraph(repositories);
      RelationshipEngine.computeRelationships(graph, repositories);
      useGraphManager.getState().setGraph(graph);
    }

    // 5. Update state
    set({
      galaxyConfig: config,
      focusedSystemId: null,
      cameraMode: 'galaxy-free',
    });
  },

  setFocusedSystemId: (id) => set({ focusedSystemId: id }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setShowGalaxyUI: (show) => set({ showGalaxyUI: show }),
}));
