import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { UniverseHierarchy, UniverseStatistics } from './UniverseState';
import { UniverseFactory } from './UniverseFactory';
import { useUniverseManager } from './UniverseManager';
import { UniverseConfig } from './UniverseConfig';
import { useEntityManager } from '@/entities/EntityManager';
import { DigitalTwinBuilder } from './DigitalTwin/DigitalTwinBuilder';

export class UniverseBuilder {
  /**
   * Generates the entire universe from raw repository data.
   */
  public static build(repositories: RepositoryDomainModel[]): void {
    if (!repositories || repositories.length === 0) return;

    // We assume all incoming repos belong to the authenticated user/org.
    // For now, we group all into one "Galaxy".
    const ownerName = repositories[0].owner;

    const hierarchy: UniverseHierarchy = {
      galaxies: [
        {
          id: `galaxy-${ownerName}`,
          name: ownerName,
          type: 'organization',
          systemIds: [],
        },
      ],
      solarSystems: [],
      planets: [],
    };

    // Group by language
    const languageGroups: Record<string, RepositoryDomainModel[]> = {};
    for (const repo of repositories) {
      const lang = repo.primaryLanguage || 'Unknown';
      if (!languageGroups[lang]) languageGroups[lang] = [];
      languageGroups[lang].push(repo);
    }

    // Create Solar Systems and Planets
    const galaxyId = hierarchy.galaxies[0].id;
    let totalStars = 0;
    let totalForks = 0;

    for (const [lang, repos] of Object.entries(languageGroups)) {
      const systemId = `sys-${ownerName}-${lang}`;
      hierarchy.galaxies[0].systemIds.push(systemId);

      const planetIds = repos.map((r) => r.id);

      hierarchy.solarSystems.push({
        id: systemId,
        name: `${lang} Ecosystem`,
        galaxyId,
        planetIds,
      });

      for (const repo of repos) {
        totalStars += repo.stars;
        totalForks += repo.forks;

        hierarchy.planets.push({
          id: repo.id,
          name: repo.name,
          solarSystemId: systemId,
          repository: repo,
        });
      }
    }

    const statistics: UniverseStatistics = {
      totalOrganizations: 1,
      totalRepositories: repositories.length,
      totalLanguages: Object.keys(languageGroups).length,
      totalStars,
      totalForks,
    };

    // 0. Augment with Infrastructure Digital Twin
    DigitalTwinBuilder.augmentHierarchy(hierarchy);

    // 1. Register with Factory
    UniverseFactory.registerUniverse(hierarchy);

    // 2. Perform Layout (Update positions in EntityManager)
    this.computeLayout(hierarchy);
    DigitalTwinBuilder.computeDigitalTwinLayout(hierarchy);

    // 3. Commit state
    useUniverseManager
      .getState()
      .setUniverseBuilt(true, hierarchy, statistics, repositories);
  }

  /**
   * Extremely simple procedural layout for now.
   * Galaxy at center.
   * Solar Systems orbit Galaxy.
   * Planets orbit Solar System.
   */
  private static computeLayout(hierarchy: UniverseHierarchy): void {
    const entityManager = useEntityManager.getState();

    // Single galaxy at origin
    for (const galaxy of hierarchy.galaxies) {
      entityManager.updateEntity(galaxy.id, { position: [0, 0, 0] });

      const numSystems = galaxy.systemIds.length;
      let sysIdx = 0;

      for (const sysId of galaxy.systemIds) {
        // Arrange solar systems in a ring or spiral around the galaxy
        const sysAngle = (sysIdx / numSystems) * Math.PI * 2;
        const sysRadius =
          UniverseConfig.SOLAR_SYSTEM_SPACING * (1 + (sysIdx % 3) * 0.2); // slight stagger
        const sysX = Math.cos(sysAngle) * sysRadius;
        const sysZ = Math.sin(sysAngle) * sysRadius;
        const sysY = (Math.random() - 0.5) * 50;

        entityManager.updateEntity(sysId, { position: [sysX, sysY, sysZ] });

        // Find the system object
        const systemNode = hierarchy.solarSystems.find((s) => s.id === sysId);
        if (systemNode) {
          const numPlanets = systemNode.planetIds.length;
          let planetIdx = 0;

          for (const planetId of systemNode.planetIds) {
            // Arrange planets around the solar system
            const pAngle = (planetIdx / numPlanets) * Math.PI * 2;
            const pDist =
              UniverseConfig.PLANET_ORBIT_MIN +
              (planetIdx *
                (UniverseConfig.PLANET_ORBIT_MAX -
                  UniverseConfig.PLANET_ORBIT_MIN)) /
                numPlanets;
            const pX = sysX + Math.cos(pAngle) * pDist;
            const pZ = sysZ + Math.sin(pAngle) * pDist;
            const pY = sysY + (Math.random() - 0.5) * 10;

            entityManager.updateEntity(planetId, { position: [pX, pY, pZ] });
            planetIdx++;
          }
        }
        sysIdx++;
      }
    }
  }
}
