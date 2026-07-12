import { PlanetMaterialConfig } from '../PlanetTypes';

export const RockyMaterial: PlanetMaterialConfig = {
  type: 'rocky',
  colorPalette: ['#3b2f2f', '#4f443b', '#6b5e50', '#85786a'],
  roughness: 0.9,
  metalness: 0.1,
  normalScale: 1.0,
};

export const IceMaterial: PlanetMaterialConfig = {
  type: 'ice',
  colorPalette: ['#8ba3c7', '#a5bad9', '#d1e0f0', '#ffffff'],
  roughness: 0.2,
  metalness: 0.4,
  normalScale: 0.5,
};

export const LavaMaterial: PlanetMaterialConfig = {
  type: 'lava',
  colorPalette: ['#2a0a0a', '#4a1515', '#b33900', '#ff5a00'],
  roughness: 0.8,
  metalness: 0.2,
  emissionColor: '#ff2a00',
  emissionIntensity: 2.0,
  normalScale: 1.5,
};

export const GasMaterial: PlanetMaterialConfig = {
  type: 'gas',
  colorPalette: ['#8c6d46', '#c49a6c', '#e6cda6', '#f2e8d8'],
  roughness: 1.0,
  metalness: 0.0,
  normalScale: 0.1,
};

export const DesertMaterial: PlanetMaterialConfig = {
  type: 'desert',
  colorPalette: ['#7a5a3a', '#ad8457', '#d9b682', '#f2dbab'],
  roughness: 0.95,
  metalness: 0.05,
  normalScale: 0.8,
};

export const OceanMaterial: PlanetMaterialConfig = {
  type: 'ocean',
  colorPalette: ['#001133', '#002966', '#004c99', '#0073e6'],
  roughness: 0.1,
  metalness: 0.8,
  normalScale: 0.2,
};

export const ForestMaterial: PlanetMaterialConfig = {
  type: 'forest',
  colorPalette: ['#1a331a', '#2d592d', '#408040', '#66b366'],
  roughness: 0.7,
  metalness: 0.1,
  normalScale: 1.0,
};

export const BarrenMaterial: PlanetMaterialConfig = {
  type: 'barren',
  colorPalette: ['#595959', '#737373', '#8c8c8c', '#a6a6a6'],
  roughness: 1.0,
  metalness: 0.1,
  normalScale: 0.9,
};
