import { create } from 'zustand';
import type { Camera, Scene, WebGLRenderer } from 'three';
import type { PerformanceTier, PerformanceData } from '@/types/rendering';

// ---------------------------------------------------------------------------
// Scene store — global rendering state
// ---------------------------------------------------------------------------

interface SceneStore {
  // Scene readiness
  isReady: boolean;
  isLoading: boolean;
  error: string | null;

  // Three.js object refs (set once canvas mounts)
  scene: Scene | null;
  camera: Camera | null;
  renderer: WebGLRenderer | null;

  // Performance
  performanceTier: PerformanceTier;
  performanceData: PerformanceData;
  currentPlanetSeed: string;

  // Debug
  debugMode: boolean;

  // Actions
  setReady: (ready: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setScene: (scene: Scene | null) => void;
  setCamera: (camera: Camera | null) => void;
  setRenderer: (renderer: WebGLRenderer | null) => void;
  setPerformanceTier: (tier: PerformanceTier) => void;
  setPerformanceData: (data: Partial<PerformanceData>) => void;
  setDebugMode: (debug: boolean) => void;
  setPlanetSeed: (seed: string) => void;
  reset: () => void;
}

const initialPerformanceData: PerformanceData = {
  fps: 0,
  delta: 0,
  dpr: 1,
  tier: 'medium',
  drawCalls: 0,
  triangles: 0,
  geometries: 0,
  textures: 0,
};

export const useSceneStore = create<SceneStore>((set) => ({
  isReady: false,
  isLoading: true,
  error: null,

  scene: null,
  camera: null,
  renderer: null,

  performanceTier: 'medium',
  performanceData: { ...initialPerformanceData },
  currentPlanetSeed: 'gitverse-genesis',

  debugMode: process.env.NODE_ENV === 'development',

  setReady: (ready) => set({ isReady: ready }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setScene: (scene) => set({ scene }),
  setCamera: (camera) => set({ camera }),
  setRenderer: (renderer) => set({ renderer }),
  setPerformanceTier: (tier) =>
    set((state) => ({
      performanceTier: tier,
      performanceData: { ...state.performanceData, tier },
    })),
  setPerformanceData: (data) =>
    set((state) => ({
      performanceData: { ...state.performanceData, ...data },
    })),
  setDebugMode: (debug) => set({ debugMode: debug }),
  setPlanetSeed: (seed) => set({ currentPlanetSeed: seed }),
  reset: () =>
    set({
      isReady: false,
      isLoading: true,
      error: null,
      scene: null,
      camera: null,
      renderer: null,
      performanceData: { ...initialPerformanceData },
    }),
}));
