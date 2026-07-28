import { GalaxyData } from './GalaxyGenerator';

export interface UniverseSaveState {
  version: string;
  timestamp: number;
  seed: string | number;
  galaxies: GalaxyData[];
  userPreferences: {
    stellarDensity: number;
    armCount: number;
    graphLayoutEnabled: boolean;
    bloomIntensity: number;
    particleDensity: number;
  };
}

export class UniverseSerializer {
  private static STORAGE_KEY = 'gitverse_procedural_universe_v1';

  public static saveUniverse(saveState: UniverseSaveState): boolean {
    try {
      const json = JSON.stringify(saveState);
      localStorage.setItem(UniverseSerializer.STORAGE_KEY, json);
      return true;
    } catch (e) {
      console.warn('Failed to persist Universe state to LocalStorage', e);
      return false;
    }
  }

  public static loadUniverse(): UniverseSaveState | null {
    try {
      const item = localStorage.getItem(UniverseSerializer.STORAGE_KEY);
      if (!item) return null;
      return JSON.parse(item) as UniverseSaveState;
    } catch (e) {
      console.warn('Failed to parse Universe state from LocalStorage', e);
      return null;
    }
  }

  public static clearSavedUniverse(): void {
    try {
      localStorage.removeItem(UniverseSerializer.STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear Universe save', e);
    }
  }
}
