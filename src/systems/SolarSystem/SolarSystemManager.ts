import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SolarSystemConfig } from './SolarSystemTypes';
import { SolarSystemGenerator } from './SolarSystemGenerator';

export type CameraMode = 'free' | 'orbit' | 'follow';

export interface SolarSystemState {
  systemConfig: SolarSystemConfig | null;
  simulationSpeed: number;
  showOrbits: boolean;
  focusedPlanetId: string | null;
  cameraMode: CameraMode;

  // Actions
  generateSystem: (seed: string, planetCount?: number) => void;
  setSimulationSpeed: (speed: number) => void;
  setShowOrbits: (show: boolean) => void;
  setFocusedPlanetId: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
}

export const useSolarSystemManager = create<SolarSystemState>()(
  devtools((set) => ({
    systemConfig: null,
    simulationSpeed: 1.0,
    showOrbits: true,
    focusedPlanetId: null,
    cameraMode: 'free',

    generateSystem: (seed, planetCount) => {
      const config = SolarSystemGenerator.generate(seed, planetCount);
      set({ systemConfig: config, focusedPlanetId: null });
    },

    setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
    setShowOrbits: (show) => set({ showOrbits: show }),
    setFocusedPlanetId: (id) =>
      set({ focusedPlanetId: id, cameraMode: id ? 'follow' : 'free' }),
    setCameraMode: (mode) => set({ cameraMode: mode }),
  }))
);
