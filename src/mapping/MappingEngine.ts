import { RepositoryDomainModel } from '../domain/RepositoryModels';
import { LanguageColors, MappingConfig } from './MappingRules';

export interface MappedVisualProperties {
  baseColor: string;
  size: number;
  mass: number;
  moonCount: number;
  satelliteCount: number;
  craterDensity: number; // 0.0 - 1.0 (cracks/damage)
  energyIntensity: number; // 0.0 - 1.0 (pulses)
  rotationSpeed: number;
  isFrozen: boolean;
  biomeSeed: string;
}

export class MappingEngine {
  /**
   * Maps a GitHub Repository domain model into purely visual parameters
   * that the rendering engine can understand.
   */
  public static mapRepositoryToVisuals(
    repo: RepositoryDomainModel
  ): MappedVisualProperties {
    // 1. Language -> Color & Biome
    const baseColor =
      LanguageColors[repo.primaryLanguage] || LanguageColors.Unknown;
    const biomeSeed = repo.topics.length > 0 ? repo.topics.join('-') : repo.id;

    // 2. Size (Repository Size in KB) -> Planet Radius
    const sizeRatio = Math.min(
      repo.size / MappingConfig.MAX_REPO_SIZE_KB_FOR_SCALE,
      1.0
    );
    const sizeCurve = Math.sqrt(sizeRatio);
    const size =
      MappingConfig.MIN_PLANET_SIZE +
      sizeCurve *
        (MappingConfig.MAX_PLANET_SIZE - MappingConfig.MIN_PLANET_SIZE);

    // 3. Stars -> Planet Mass
    const massRatio = Math.min(
      repo.stars / MappingConfig.MAX_STARS_FOR_SCALE,
      1.0
    );
    const mass =
      MappingConfig.MIN_PLANET_MASS +
      massRatio *
        (MappingConfig.MAX_PLANET_MASS - MappingConfig.MIN_PLANET_MASS);

    // 4. Forks -> Moons
    const moonCount = Math.min(
      Math.floor(repo.forks / MappingConfig.FORKS_PER_MOON),
      MappingConfig.MAX_MOONS
    );

    // 5. Contributors -> Satellites
    const contributorCount = repo.contributors?.length || 0;
    const satelliteCount = Math.min(
      Math.floor(contributorCount / MappingConfig.CONTRIBUTORS_PER_SATELLITE),
      MappingConfig.MAX_SATELLITES
    );

    // 6. Issues -> Surface Cracks (Damage)
    const craterDensity = Math.min(
      (repo.issues / MappingConfig.ISSUES_FOR_MAX_CRATERS) *
        MappingConfig.MAX_CRATER_DENSITY,
      MappingConfig.MAX_CRATER_DENSITY
    );

    // 7. Archived -> Frozen Planet
    const isFrozen = repo.isArchived;

    // 8. Releases -> Energy Pulses
    const energyIntensity = Math.min(
      (repo.releases / MappingConfig.RELEASES_FOR_MAX_ENERGY) *
        MappingConfig.MAX_ENERGY_INTENSITY,
      MappingConfig.MAX_ENERGY_INTENSITY
    );

    // 9. Activity (Recent commits/updates) -> Rotation Speed
    const now = Date.now();
    const updatedMs = new Date(repo.updatedAt).getTime();
    const daysSinceUpdate = Math.max(
      0,
      (now - updatedMs) / (1000 * 60 * 60 * 24)
    );
    // More recently updated = faster rotation
    const activityScore = Math.max(
      0,
      MappingConfig.MAX_ACTIVITY_SCORE - daysSinceUpdate
    );
    const rotationRatio = activityScore / MappingConfig.MAX_ACTIVITY_SCORE;
    const rotationSpeed =
      MappingConfig.MIN_ROTATION_SPEED +
      rotationRatio *
        (MappingConfig.MAX_ROTATION_SPEED - MappingConfig.MIN_ROTATION_SPEED);

    return {
      baseColor,
      size,
      mass,
      moonCount,
      satelliteCount,
      craterDensity,
      energyIntensity,
      rotationSpeed,
      isFrozen,
      biomeSeed,
    };
  }
}
