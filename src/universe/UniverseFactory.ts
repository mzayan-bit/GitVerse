import { EntityFactory } from '@/entities/EntityFactory';
import { useEntityManager } from '@/entities/EntityManager';
import { UniverseHierarchy } from './UniverseState';
import { MappingEngine } from '@/mapping/MappingEngine';

export class UniverseFactory {
  /**
   * Registers all generated entities into the Entity System.
   * This bridges the high-level Universe hierarchy to the low-level rendering nodes.
   */
  public static registerUniverse(hierarchy: UniverseHierarchy): void {
    // 1. Clear existing universe
    useEntityManager.getState().clearEntities();

    // 2. Register Galaxies
    for (const galaxy of hierarchy.galaxies) {
      EntityFactory.createEntity(
        galaxy.id,
        'galaxy',
        galaxy.name,
        galaxy.id,
        { position: [0, 0, 0] }, // Coordinates managed by UniverseBuilder/Galaxy layout
        { type: galaxy.type }
      );
    }

    // 3. Register Solar Systems (Groups of Repos)
    for (const sys of hierarchy.solarSystems) {
      EntityFactory.createEntity(
        sys.id,
        'solar_system',
        sys.name,
        sys.id,
        { position: [0, 0, 0] }, // Will be updated
        { galaxyId: sys.galaxyId }
      );
    }

    // 4. Register Planets (Repositories)
    for (const planet of hierarchy.planets) {
      const visualProps = MappingEngine.mapRepositoryToVisuals(
        planet.repository
      );

      EntityFactory.createEntity(
        planet.id,
        'planet',
        planet.name,
        planet.id,
        { position: [0, 0, 0] }, // Will be updated by layout
        {
          solarSystemId: planet.solarSystemId,
          repository: planet.repository,
          visuals: visualProps,
        }
      );
    }
  }
}
