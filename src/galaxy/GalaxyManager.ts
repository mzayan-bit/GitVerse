import { create } from 'zustand';
import { GalaxyConfig, GalaxyShape } from './GalaxyTypes';
import { GalaxyGenerator } from './GalaxyGenerator';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';

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

  generateGalaxy: (seed, systemCount = 2000, shape, repositories) => {
    const config = GalaxyGenerator.generate(
      seed,
      systemCount,
      shape,
      repositories
    );
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
