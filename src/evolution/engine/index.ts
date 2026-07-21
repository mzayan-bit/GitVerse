export type {
  RepositorySnapshot,
  EvolutionTimeline,
  TimelineEntry,
  VirtualFile,
  VirtualDirectory,
  LanguageSnapshot,
  ContributorSnapshot,
} from './EvolutionTypes';

export { EvolutionEngine } from './EvolutionEngine';
export { SnapshotBuilder } from './SnapshotBuilder';
export { useEvolutionManager } from './EvolutionManager';
export type { PlaybackSpeed } from './EvolutionManager';
