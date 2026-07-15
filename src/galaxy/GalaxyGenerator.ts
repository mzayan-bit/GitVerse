import { GalaxyConfig, GalaxyShape, GalaxySystemNode } from './GalaxyTypes';
import { GALAXY_DEFAULTS } from './GalaxyConfig';
import { GalaxyEngine } from './GalaxyEngine';
import { EntityFactory } from '@/entities/EntityFactory';
import { MappingEngine } from '@/mapping/MappingEngine';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';

export class GalaxyGenerator {
  public static generate(
    seedStr: string,
    systemCount: number = 2000,
    forcedShape?: GalaxyShape,
    repositories?: RepositoryDomainModel[]
  ): GalaxyConfig {
    const engine = new GalaxyEngine(seedStr);

    // If we have repositories, the system count is the number of repositories
    const actualSystemCount = repositories ? repositories.length : systemCount;

    const shape = forcedShape || engine.randomElement(GALAXY_DEFAULTS.SHAPES);
    const coreColor = engine.randomElement(GALAXY_DEFAULTS.CORE_COLORS);
    const outerColor = engine.randomElement(GALAXY_DEFAULTS.OUTER_COLORS);

    // Register Galaxy Entity
    EntityFactory.createEntity(
      `galaxy-${seedStr}`,
      'galaxy',
      `Galaxy ${seedStr}`,
      seedStr,
      undefined,
      { shape, systemCount }
    );

    const systems: GalaxySystemNode[] = [];

    // Procedural distribution based on shape
    for (let i = 0; i < actualSystemCount; i++) {
      let x = 0,
        y = 0,
        z = 0;

      const r_x = GALAXY_DEFAULTS.RADIUS_X;
      const r_z = GALAXY_DEFAULTS.RADIUS_Z;
      const t_y = GALAXY_DEFAULTS.THICKNESS_Y;

      // 10% chance to be in the dense core for most galaxies
      const inCore = engine.random() < GALAXY_DEFAULTS.CORE_RADIUS_RATIO;

      switch (shape) {
        case 'spiral':
        case 'barred_spiral': {
          const numArms = engine.randomRange(
            GALAXY_DEFAULTS.MIN_ARMS,
            GALAXY_DEFAULTS.MAX_ARMS
          );
          const armOffsetMax = 0.5; // Dispersion from the arm
          const rotationFactor = 5;

          if (inCore) {
            // Core is an ellipsoid
            const r = engine.randomGaussian(0, r_x * 0.1);
            const theta = engine.random() * Math.PI * 2;
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
            y = engine.randomGaussian(0, t_y * 0.5);
          } else {
            // Arms
            const armIndex = Math.floor(engine.random() * numArms);
            const armAngle = (armIndex / numArms) * Math.PI * 2;
            // Distance from center
            const distance = engine.random() * r_x;
            // Spiral math
            let angle = (distance / r_x) * rotationFactor + armAngle;

            if (shape === 'barred_spiral' && distance < r_x * 0.3) {
              // Create a straight bar in the center instead of curling
              angle = armAngle;
            }

            // Add dispersion
            const dispersion =
              engine.randomGaussian(0, armOffsetMax) * (r_x - distance) * 0.1;

            x = Math.cos(angle) * distance + dispersion;
            z = Math.sin(angle) * distance + dispersion;
            y = engine.randomGaussian(0, t_y * 0.2); // Flatter disk
          }
          break;
        }
        case 'elliptical': {
          // 3D Gaussian ellipsoid
          x = engine.randomGaussian(0, r_x * 0.4);
          z = engine.randomGaussian(0, r_z * 0.4);
          y = engine.randomGaussian(0, t_y * 0.8);
          break;
        }
        case 'ring': {
          // Torus-like distribution
          const ringRadius = r_x * 0.7;
          const ringThickness = r_x * 0.15;
          const theta = engine.random() * Math.PI * 2;

          if (inCore && engine.random() < 0.2) {
            // Sparse core
            const r = engine.random() * ringRadius * 0.3;
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
            y = engine.randomGaussian(0, t_y * 0.2);
          } else {
            // Main ring
            const r = engine.randomGaussian(ringRadius, ringThickness);
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
            y = engine.randomGaussian(0, t_y * 0.1);
          }
          break;
        }
        case 'irregular': {
          // Multiple offset clusters
          const clusterCount = 4;
          const clusterIndex = Math.floor(engine.random() * clusterCount);
          const cx = Math.sin(clusterIndex) * r_x * 0.5;
          const cz = Math.cos(clusterIndex) * r_z * 0.5;

          x = engine.randomGaussian(cx, r_x * 0.3);
          z = engine.randomGaussian(cz, r_z * 0.3);
          y = engine.randomGaussian(0, t_y * 0.6);
          break;
        }
        case 'dwarf': {
          // Small, spherical, noisy
          const r = engine.randomGaussian(0, r_x * 0.15); // Much smaller
          const theta = engine.random() * Math.PI * 2;
          const phi = Math.acos(2 * engine.random() - 1);
          x = r * Math.sin(phi) * Math.cos(theta);
          z = r * Math.sin(phi) * Math.sin(theta);
          y = r * Math.cos(phi);
          break;
        }
      }

      // Determine color based on distance to core (density)
      const distToCore = Math.sqrt(x * x + y * y + z * z);
      const isCoreColor = distToCore < r_x * GALAXY_DEFAULTS.CORE_RADIUS_RATIO;
      const color = isCoreColor
        ? coreColor
        : engine.random() > 0.8
          ? coreColor
          : outerColor;

      // Spatial partitioning to avoid overlaps (Minimum spacing = 20 units)
      const MIN_SPACING = 20;
      let overlap = false;

      // Simple distance check against recently added systems to avoid N^2 complexity on huge scales
      // We check the last 100 systems, which is a good heuristic for localized overlaps without destroying performance.
      const checkCount = Math.min(systems.length, 100);
      for (let j = systems.length - 1; j >= systems.length - checkCount; j--) {
        const dx = systems[j].position[0] - x;
        const dy = systems[j].position[1] - y;
        const dz = systems[j].position[2] - z;
        if (dx * dx + dy * dy + dz * dz < MIN_SPACING * MIN_SPACING) {
          overlap = true;
          break;
        }
      }

      if (overlap) {
        // If overlap, try again by skipping this iteration (this will result in slightly fewer systems, but guarantees spacing)
        continue;
      }

      const sizeScale = 1;
      x *= sizeScale;
      y *= sizeScale;
      z *= sizeScale;

      const systemSeed = `${seedStr}-${i}`;
      const systemId = repositories
        ? repositories[i].id
        : `system-${systemSeed}-${i}`;
      const repoName = repositories
        ? repositories[i].name
        : `System ${systemId.slice(0, 4)}`;

      // Register Solar System Entity
      const metadata: Record<string, unknown> = { shape, isCoreColor };
      if (repositories) {
        metadata.repository = repositories[i];
        const visualProps = MappingEngine.mapRepositoryToVisuals(
          repositories[i]
        );
        metadata.visuals = visualProps;
      }

      const sysPos: [number, number, number] = [x, y, z];

      EntityFactory.createEntity(
        systemId,
        'solar_system',
        repoName,
        systemSeed,
        { position: sysPos },
        metadata
      );

      systems.push({
        id: systemId,
        position: sysPos,
        size: engine.randomRange(0.5, 2.0),
        color,
      });
    }

    return {
      seed: { value: seedStr },
      shape,
      bounds: {
        radiusX: GALAXY_DEFAULTS.RADIUS_X,
        radiusZ: GALAXY_DEFAULTS.RADIUS_Z,
        thicknessY: GALAXY_DEFAULTS.THICKNESS_Y,
      },
      systems,
      coreColor,
      outerColor,
    };
  }
}
