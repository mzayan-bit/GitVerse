import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SolarSystemConfig } from './SolarSystemTypes';
import { SolarSystemGenerator } from './SolarSystemGenerator';

export interface SolarSystemState {
  systemConfig: SolarSystemConfig | null;
  simulationSpeed: number;
  showOrbits: boolean;
  focusedPlanetId: string | null;

  // Actions
  generateSystem: (seed: string, planetCount?: number) => void;
  setSimulationSpeed: (speed: number) => void;
  setShowOrbits: (show: boolean) => void;
  setFocusedPlanetId: (id: string | null) => void;
}

export const useSolarSystemManager = create<SolarSystemState>()(
  devtools((set) => ({
    systemConfig: null,
    simulationSpeed: 1.0,
    showOrbits: true,
    focusedPlanetId: null,

    generateSystem: (seed, planetCount) => {
      const config = SolarSystemGenerator.generate(seed, planetCount);
      set({ systemConfig: config, focusedPlanetId: null });
    },

    setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
    setShowOrbits: (show) => set({ showOrbits: show }),
    setFocusedPlanetId: (id) => set({ focusedPlanetId: id }),
  }))
);
