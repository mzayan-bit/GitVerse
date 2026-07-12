export type PlanetType =
  'rocky' | 'ice' | 'lava' | 'gas' | 'desert' | 'ocean' | 'forest' | 'barren';

export interface PlanetSeed {
  value: string;
}

export interface TerrainConfig {
  baseRadius: number;
  displacementStrength: number;
  noiseScale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  flattenPoles?: boolean;
}

export interface AtmosphereConfig {
  enabled: boolean;
  color: string;
  glowIntensity: number;
  thickness: number;
  scattering: number;
  hasClouds?: boolean;
  cloudSpeed?: number;
  cloudOpacity?: number;
}

export interface PlanetMaterialConfig {
  type: PlanetType;
  colorPalette: string[];
  roughness: number;
  metalness: number;
  emissionColor?: string;
  emissionIntensity?: number;
  normalScale: number;
}

export interface PlanetConfig {
  seed: PlanetSeed;
  type: PlanetType;
  terrain: TerrainConfig;
  material: PlanetMaterialConfig;
  atmosphere: AtmosphereConfig;
}
