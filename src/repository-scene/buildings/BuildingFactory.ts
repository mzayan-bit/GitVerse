// ============================================================================
// Building Factory — Maps file extensions to building archetypes and styles
// ============================================================================

import { BuildingSlot } from '../terrain/TerrainTypes';
import {
  BuildingConfig,
  BuildingStyle,
  BuildingArchetype,
} from './BuildingTypes';

// Extension → Archetype mapping
const EXTENSION_ARCHETYPE: Record<string, BuildingArchetype> = {
  // Tower (TypeScript / JavaScript family)
  ts: 'tower',
  tsx: 'tower',
  js: 'tower',
  jsx: 'tower',
  mjs: 'tower',
  cjs: 'tower',
  // Modern (Python family)
  py: 'modern',
  pyx: 'modern',
  ipynb: 'modern',
  // Brutalist (Systems languages)
  rs: 'brutalist',
  go: 'brutalist',
  c: 'brutalist',
  cpp: 'brutalist',
  h: 'brutalist',
  java: 'brutalist',
  kt: 'brutalist',
  swift: 'brutalist',
  // Pavilion (Documentation)
  md: 'pavilion',
  txt: 'pavilion',
  rst: 'pavilion',
  adoc: 'pavilion',
  pdf: 'pavilion',
  // Data Cube
  json: 'datacube',
  yaml: 'datacube',
  yml: 'datacube',
  toml: 'datacube',
  xml: 'datacube',
  csv: 'datacube',
  env: 'datacube',
  // Gradient (Styling)
  css: 'gradient',
  scss: 'gradient',
  less: 'gradient',
  sass: 'gradient',
  // Industrial (DevOps)
  sh: 'industrial',
  bash: 'industrial',
  dockerfile: 'industrial',
  // Billboard (Media)
  png: 'billboard',
  jpg: 'billboard',
  jpeg: 'billboard',
  svg: 'billboard',
  gif: 'billboard',
  webp: 'billboard',
  ico: 'billboard',
};

// Archetype → Visual style
const ARCHETYPE_STYLES: Record<
  BuildingArchetype,
  Omit<BuildingStyle, 'archetype'>
> = {
  tower: {
    baseColor: '#1e3a5f',
    accentColor: '#3b82f6',
    emissiveColor: '#60a5fa',
    emissiveIntensity: 0.15,
    windowRows: 8,
    windowCols: 4,
    hasRoofDetail: true,
    hasAntenna: true,
    metalness: 0.7,
    roughness: 0.2,
  },
  modern: {
    baseColor: '#1a3a2a',
    accentColor: '#10b981',
    emissiveColor: '#34d399',
    emissiveIntensity: 0.12,
    windowRows: 6,
    windowCols: 3,
    hasRoofDetail: true,
    hasAntenna: false,
    metalness: 0.5,
    roughness: 0.3,
  },
  brutalist: {
    baseColor: '#3d2c1a',
    accentColor: '#f97316',
    emissiveColor: '#fb923c',
    emissiveIntensity: 0.08,
    windowRows: 5,
    windowCols: 5,
    hasRoofDetail: false,
    hasAntenna: false,
    metalness: 0.3,
    roughness: 0.8,
  },
  pavilion: {
    baseColor: '#2a2a3a',
    accentColor: '#a78bfa',
    emissiveColor: '#c4b5fd',
    emissiveIntensity: 0.2,
    windowRows: 2,
    windowCols: 6,
    hasRoofDetail: false,
    hasAntenna: false,
    metalness: 0.2,
    roughness: 0.5,
  },
  datacube: {
    baseColor: '#1a2a3a',
    accentColor: '#06b6d4',
    emissiveColor: '#22d3ee',
    emissiveIntensity: 0.25,
    windowRows: 4,
    windowCols: 4,
    hasRoofDetail: false,
    hasAntenna: false,
    metalness: 0.8,
    roughness: 0.1,
  },
  gradient: {
    baseColor: '#3a1a3a',
    accentColor: '#ec4899',
    emissiveColor: '#f472b6',
    emissiveIntensity: 0.18,
    windowRows: 6,
    windowCols: 3,
    hasRoofDetail: true,
    hasAntenna: false,
    metalness: 0.4,
    roughness: 0.3,
  },
  industrial: {
    baseColor: '#2a2a2a',
    accentColor: '#64748b',
    emissiveColor: '#94a3b8',
    emissiveIntensity: 0.06,
    windowRows: 3,
    windowCols: 4,
    hasRoofDetail: false,
    hasAntenna: true,
    metalness: 0.6,
    roughness: 0.7,
  },
  billboard: {
    baseColor: '#2a2a1a',
    accentColor: '#fbbf24',
    emissiveColor: '#fde68a',
    emissiveIntensity: 0.3,
    windowRows: 1,
    windowCols: 1,
    hasRoofDetail: false,
    hasAntenna: false,
    metalness: 0.2,
    roughness: 0.4,
  },
  generic: {
    baseColor: '#252530',
    accentColor: '#64748b',
    emissiveColor: '#94a3b8',
    emissiveIntensity: 0.05,
    windowRows: 4,
    windowCols: 3,
    hasRoofDetail: false,
    hasAntenna: false,
    metalness: 0.4,
    roughness: 0.5,
  },
};

export class BuildingFactory {
  /**
   * Creates a fully-styled BuildingConfig from a raw BuildingSlot.
   */
  public static createConfig(slot: BuildingSlot): BuildingConfig {
    const ext = slot.extension.toLowerCase().replace('.', '');
    const archetype = EXTENSION_ARCHETYPE[ext] || 'generic';
    const styleTemplate = ARCHETYPE_STYLES[archetype];

    const style: BuildingStyle = {
      archetype,
      ...styleTemplate,
    };

    return {
      id: slot.id,
      fileName: slot.fileName,
      filePath: slot.filePath,
      extension: slot.extension,
      sizeBytes: slot.sizeBytes,
      position: slot.position,
      width: slot.width,
      depth: slot.depth,
      height: slot.height,
      style,
    };
  }
}
