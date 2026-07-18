// ============================================================================
// Building Types — Visual Config for Procedural Buildings
// ============================================================================

export type BuildingArchetype =
  | 'tower' // .ts, .tsx, .js, .jsx
  | 'modern' // .py
  | 'brutalist' // .rs, .go, .c, .cpp
  | 'pavilion' // .md, .txt, .rst
  | 'datacube' // .json, .yaml, .yml, .toml, .xml
  | 'gradient' // .css, .scss, .less
  | 'industrial' // Dockerfile, .docker, .sh
  | 'billboard' // .png, .jpg, .svg, .gif
  | 'generic'; // fallback

export interface BuildingStyle {
  archetype: BuildingArchetype;
  baseColor: string;
  accentColor: string;
  emissiveColor: string;
  emissiveIntensity: number;
  windowRows: number;
  windowCols: number;
  hasRoofDetail: boolean;
  hasAntenna: boolean;
  metalness: number;
  roughness: number;
}

export interface BuildingConfig {
  id: string;
  fileName: string;
  filePath: string;
  extension: string;
  sizeBytes: number;
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  style: BuildingStyle;
}
