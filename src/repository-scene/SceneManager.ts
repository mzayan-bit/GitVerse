import { create } from 'zustand';
import {
  RepositorySceneMode,
  ExploreCameraMode,
  ExplorationPath,
  SelectedBuilding,
  RepositorySceneConfig,
  DEFAULT_SCENE_CONFIG,
} from './SceneState';
import { CityLayout } from './terrain/TerrainTypes';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';

// ============================================================================
// Repository Scene Manager — Zustand Store
// ============================================================================

interface RepositorySceneStore {
  // --- State ---
  mode: RepositorySceneMode;
  cameraMode: ExploreCameraMode;
  activeRepository: RepositoryDomainModel | null;
  activeRepositoryEntityId: string | null;
  currentPath: ExplorationPath;
  selectedBuilding: SelectedBuilding | null;
  hoveredBuildingId: string | null;
  layout: CityLayout | null;
  navigationHistory: string[];
  config: RepositorySceneConfig;

  // Transition progress (0 → 1)
  transitionProgress: number;

  // --- Actions ---
  enterRepository: (repo: RepositoryDomainModel, entityId: string) => void;
  leaveRepository: () => void;
  setMode: (mode: RepositorySceneMode) => void;
  setCameraMode: (mode: ExploreCameraMode) => void;
  navigateTo: (path: string) => void;
  navigateUp: () => void;
  selectBuilding: (building: SelectedBuilding | null) => void;
  setHoveredBuilding: (id: string | null) => void;
  setLayout: (layout: CityLayout | null) => void;
  setTransitionProgress: (progress: number) => void;
}

export const useRepositoryScene = create<RepositorySceneStore>((set, get) => ({
  mode: 'idle',
  cameraMode: 'orbit',
  activeRepository: null,
  activeRepositoryEntityId: null,
  currentPath: { segments: [], fullPath: '' },
  selectedBuilding: null,
  hoveredBuildingId: null,
  layout: null,
  navigationHistory: [],
  config: DEFAULT_SCENE_CONFIG,
  transitionProgress: 0,

  enterRepository: (repo, entityId) =>
    set({
      mode: 'entering',
      activeRepository: repo,
      activeRepositoryEntityId: entityId,
      currentPath: { segments: [], fullPath: '' },
      selectedBuilding: null,
      hoveredBuildingId: null,
      layout: null,
      navigationHistory: [],
      transitionProgress: 0,
      cameraMode: 'orbit',
    }),

  leaveRepository: () =>
    set({
      mode: 'leaving',
      transitionProgress: 0,
    }),

  setMode: (mode) => set({ mode }),
  setCameraMode: (cameraMode) => set({ cameraMode }),

  navigateTo: (path) => {
    const segments = path ? path.split('/').filter(Boolean) : [];
    const state = get();
    set({
      currentPath: { segments, fullPath: path },
      navigationHistory: [
        ...state.navigationHistory,
        state.currentPath.fullPath,
      ],
      selectedBuilding: null,
      hoveredBuildingId: null,
      cameraMode: 'directory-focus',
    });
  },

  navigateUp: () => {
    const state = get();
    const segments = [...state.currentPath.segments];
    segments.pop();
    const fullPath = segments.join('/');
    set({
      currentPath: { segments, fullPath },
      selectedBuilding: null,
      hoveredBuildingId: null,
      cameraMode: segments.length > 0 ? 'directory-focus' : 'orbit',
    });
  },

  selectBuilding: (building) =>
    set({
      selectedBuilding: building,
      cameraMode: building ? 'building-focus' : 'orbit',
    }),

  setHoveredBuilding: (id) => set({ hoveredBuildingId: id }),
  setLayout: (layout) => set({ layout }),
  setTransitionProgress: (progress) => set({ transitionProgress: progress }),
}));
