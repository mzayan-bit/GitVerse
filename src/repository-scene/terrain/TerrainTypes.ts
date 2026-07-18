// ============================================================================
// Terrain Types — City Layout Data Structures
// ============================================================================

export interface BuildingSlot {
  id: string;
  fileName: string;
  filePath: string;
  extension: string;
  sizeBytes: number;
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
}

export interface CityBlock {
  id: string;
  directoryName: string;
  directoryPath: string;
  position: [number, number, number];
  radius: number;
  buildings: BuildingSlot[];
  childBlocks: CityBlock[];
  depth: number;
}

export interface District {
  id: string;
  name: string;
  path: string;
  position: [number, number, number];
  radius: number;
  blocks: CityBlock[];
  color: string;
}

export interface CityLayout {
  repositoryId: string;
  repositoryName: string;
  districts: District[];
  allBuildings: BuildingSlot[];
  groundRadius: number;
  center: [number, number, number];
}
