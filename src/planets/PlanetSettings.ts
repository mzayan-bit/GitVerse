import {
  AtmosphereConfig,
  PlanetMaterialConfig,
  TerrainConfig,
} from './PlanetTypes';

export const DEFAULT_TERRAIN: TerrainConfig = {
  baseRadius: 10,
  displacementStrength: 1.0,
  noiseScale: 1.0,
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2.0,
  flattenPoles: true,
};

export const DEFAULT_ATMOSPHERE: AtmosphereConfig = {
  enabled: true,
  color: '#4db8ff',
  glowIntensity: 1.0,
  thickness: 1.2,
  scattering: 0.5,
  hasClouds: true,
  cloudSpeed: 0.001,
  cloudOpacity: 0.8,
};

export const DEFAULT_MATERIAL: PlanetMaterialConfig = {
  type: 'rocky',
  colorPalette: ['#3b2f2f', '#4f443b', '#6b5e50', '#85786a'],
  roughness: 0.8,
  metalness: 0.1,
  normalScale: 1.0,
};
