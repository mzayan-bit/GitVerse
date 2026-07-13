import { SolarSystemConfig } from '@/systems/SolarSystem/SolarSystemTypes';

export type GalaxyShape =
  'spiral' | 'barred_spiral' | 'elliptical' | 'ring' | 'irregular' | 'dwarf';

export interface GalaxySeed {
  value: string;
}

export interface GalaxyBounds {
  radiusX: number;
  radiusZ: number;
  thicknessY: number;
}

// A node inside the galaxy representing a single solar system
export interface GalaxySystemNode {
  id: string; // The system id (e.g. repo name)
  position: [number, number, number];
  size: number;
  color: string;
  solarSystem?: SolarSystemConfig; // Lazy loaded when zoomed in
}

export interface GalaxyConfig {
  seed: GalaxySeed;
  shape: GalaxyShape;
  bounds: GalaxyBounds;
  systems: GalaxySystemNode[];
  coreColor: string;
  outerColor: string;
}
