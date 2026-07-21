// ============================================================================
// Evolution Interpolator — Smooth transitions between snapshots
// ============================================================================

import type { TimelineEntry } from '../engine/EvolutionTypes';

/** Visual state of a building (file) for interpolation */
export interface BuildingVisualState {
  path: string;
  x: number;
  z: number;
  height: number;
  opacity: number;
  scale: number;
  color: string;
  isNew: boolean;
  isRemoved: boolean;
}

/** Interpolated state between two timeline entries */
export interface InterpolatedState {
  /** Normalized progress 0..1 between two entries */
  t: number;
  /** Interpolated planet radius */
  planetRadius: number;
  /** Interpolated file count */
  fileCount: number;
  /** Interpolated total size */
  totalSize: number;
  /** Files that are being added (fade-in) */
  addingFiles: string[];
  /** Files that are being removed (fade-out) */
  removingFiles: string[];
  /** Atmosphere intensity based on activity */
  atmosphereIntensity: number;
}

export class EvolutionInterpolator {
  /**
   * Interpolate visual state between two timeline entries.
   * t ranges from 0 (entryA) to 1 (entryB).
   */
  public static interpolate(
    entryA: TimelineEntry,
    entryB: TimelineEntry,
    t: number
  ): InterpolatedState {
    const clampedT = Math.max(0, Math.min(1, t));

    // Lerp numeric values
    const planetRadius = EvolutionInterpolator.lerp(
      EvolutionInterpolator.filesToRadius(entryA.cumulativeFiles),
      EvolutionInterpolator.filesToRadius(entryB.cumulativeFiles),
      clampedT
    );

    const fileCount = Math.round(
      EvolutionInterpolator.lerp(
        entryA.cumulativeFiles,
        entryB.cumulativeFiles,
        clampedT
      )
    );

    const totalSize = Math.round(
      EvolutionInterpolator.lerp(
        entryA.cumulativeSize,
        entryB.cumulativeSize,
        clampedT
      )
    );

    // Files being added should fade in during the transition
    const addingFiles = clampedT < 1 ? entryB.filesAdded : [];
    const removingFiles = clampedT < 1 ? entryB.filesRemoved : [];

    // Atmosphere intensity based on activity (more changes = brighter)
    const changeCount =
      entryB.filesAdded.length +
      entryB.filesRemoved.length +
      entryB.filesModified.length;
    const atmosphereIntensity = Math.min(1, changeCount / 20) * clampedT;

    return {
      t: clampedT,
      planetRadius,
      fileCount,
      totalSize,
      addingFiles,
      removingFiles,
      atmosphereIntensity,
    };
  }

  /**
   * Compute building visual state with smooth transitions.
   */
  public static interpolateBuilding(
    exists: boolean,
    wasRemoved: boolean,
    isNew: boolean,
    t: number,
    baseHeight: number
  ): { height: number; opacity: number; scale: number } {
    if (isNew) {
      // Fade in: scale from 0 to 1
      const eased = EvolutionInterpolator.easeOutCubic(t);
      return {
        height: baseHeight * eased,
        opacity: eased,
        scale: eased,
      };
    }

    if (wasRemoved) {
      // Fade out: scale from 1 to 0
      const eased = 1 - EvolutionInterpolator.easeInCubic(t);
      return {
        height: baseHeight * eased,
        opacity: eased,
        scale: eased,
      };
    }

    if (exists) {
      return {
        height: baseHeight,
        opacity: 1,
        scale: 1,
      };
    }

    return { height: 0, opacity: 0, scale: 0 };
  }

  // ─── Utilities ──────────────────────────────────────────────────────

  public static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  public static easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  public static easeInCubic(t: number): number {
    return t * t * t;
  }

  public static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /** Convert file count to a visually appropriate planet radius */
  public static filesToRadius(fileCount: number): number {
    return 1.5 + Math.sqrt(fileCount) * 0.3;
  }
}
