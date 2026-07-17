import { create } from 'zustand';
import {
  CameraState,
  UniverseHierarchy,
  UniverseStatistics,
} from './UniverseState';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';

interface UniverseStore {
  isBuilt: boolean;
  hierarchy: UniverseHierarchy;
  statistics: UniverseStatistics;
  repositories: RepositoryDomainModel[];

  // Camera & Selection
  cameraState: CameraState;
  selectedEntityId: string | null;
  hoveredEntityId: string | null;

  // Actions
  setUniverseBuilt: (
    built: boolean,
    hierarchy: UniverseHierarchy,
    stats: UniverseStatistics,
    repos: RepositoryDomainModel[]
  ) => void;
  setCameraState: (state: Partial<CameraState>) => void;
  setSelectedEntity: (id: string | null) => void;
  setHoveredEntity: (id: string | null) => void;
  focusEntity: (id: string) => void;
}

export const useUniverseManager = create<UniverseStore>((set) => ({
  isBuilt: false,
  hierarchy: {
    galaxies: [],
    solarSystems: [],
    planets: [],
  },
  statistics: {
    totalOrganizations: 0,
    totalRepositories: 0,
    totalLanguages: 0,
    totalStars: 0,
    totalForks: 0,
  },
  repositories: [],

  cameraState: {
    mode: 'free',
    targetId: null,
    position: [0, 0, 500],
    targetPosition: [0, 0, 0],
  },
  selectedEntityId: null,
  hoveredEntityId: null,

  setUniverseBuilt: (isBuilt, hierarchy, statistics, repositories) =>
    set({ isBuilt, hierarchy, statistics, repositories }),

  setCameraState: (update) =>
    set((state) => ({
      cameraState: { ...state.cameraState, ...update },
    })),

  setSelectedEntity: (id) => set({ selectedEntityId: id }),
  setHoveredEntity: (id) => set({ hoveredEntityId: id }),

  focusEntity: (id) =>
    set((state) => ({
      selectedEntityId: id,
      cameraState: {
        ...state.cameraState,
        mode: 'focus',
        targetId: id,
      },
    })),
}));
