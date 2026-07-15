import { RepositoryDomainModel } from '../domain/RepositoryModels';
import { LanguageColors, MappingConfig } from './MappingRules';

export interface MappedVisualProperties {
  baseColor: string;
  size: number;
  moonCount: number;
  craterDensity: number; // 0.0 - 1.0
  populationDensity: number; // 0.0 - 1.0
  energyIntensity: number; // 0.0 - 1.0
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
    // 1. Language -> Color
    const baseColor =
      LanguageColors[repo.primaryLanguage] || LanguageColors.Unknown;

    // 2. Stars -> Size (Logarithmic scale looks better, but linear bounded for simplicity first)
    const starRatio = Math.min(
      repo.stars / MappingConfig.MAX_STARS_FOR_SCALE,
      1.0
    );
    // Use an easing curve (e.g. square root) so small repos still look okay
    const sizeCurve = Math.sqrt(starRatio);
    const size =
      MappingConfig.MIN_PLANET_SIZE +
      sizeCurve *
        (MappingConfig.MAX_PLANET_SIZE - MappingConfig.MIN_PLANET_SIZE);

    // 3. Forks -> Moons
    const moonCount = Math.min(
      Math.floor(repo.forks / MappingConfig.FORKS_PER_MOON),
      MappingConfig.MAX_MOONS
    );

    // 4. Issues -> Surface Damage (Craters)
    const craterDensity = Math.min(
      (repo.issues / MappingConfig.ISSUES_FOR_MAX_CRATERS) *
        MappingConfig.MAX_CRATER_DENSITY,
      MappingConfig.MAX_CRATER_DENSITY
    );

    // 5. Commits -> Population Density (Lights on the dark side)
    const populationDensity = Math.min(
      (repo.commits / MappingConfig.COMMITS_FOR_MAX_POPULATION) *
        MappingConfig.MAX_POPULATION_DENSITY,
      MappingConfig.MAX_POPULATION_DENSITY
    );

    // 6. Releases -> Energy / Atmosphere intensity
    const energyIntensity = Math.min(
      (repo.releases / MappingConfig.RELEASES_FOR_MAX_ENERGY) *
        MappingConfig.MAX_ENERGY_INTENSITY,
      MappingConfig.MAX_ENERGY_INTENSITY
    );

    // 7. Topics -> Biome deterministic seed
    // Join topics and hash them or just use the first topic as a seed
    const biomeSeed = repo.topics.length > 0 ? repo.topics.join('-') : repo.id;

    return {
      baseColor,
      size,
      moonCount,
      craterDensity,
      populationDensity,
      energyIntensity,
      biomeSeed,
    };
  }
}
