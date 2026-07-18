// ============================================================================
// Repository Scene State Types
// ============================================================================

export type RepositorySceneMode = 'idle' | 'entering' | 'exploring' | 'leaving';

export type ExploreCameraMode =
  'orbit' | 'first-person' | 'free' | 'directory-focus' | 'building-focus';

export interface ExplorationPath {
  segments: string[]; // e.g. ['src', 'components', 'ui']
  fullPath: string; // e.g. 'src/components/ui'
}

export interface SelectedBuilding {
  id: string;
  fileName: string;
  filePath: string;
  extension: string;
  sizeBytes: number;
}

export interface RepositorySceneConfig {
  /** Transition duration in seconds */
  transitionDuration: number;
  /** City ground radius */
  groundRadius: number;
  /** Maximum building height */
  maxBuildingHeight: number;
  /** Grid cell size for city blocks */
  cellSize: number;
}

export const DEFAULT_SCENE_CONFIG: RepositorySceneConfig = {
  transitionDuration: 2.5,
  groundRadius: 500,
  maxBuildingHeight: 60,
  cellSize: 4,
};
