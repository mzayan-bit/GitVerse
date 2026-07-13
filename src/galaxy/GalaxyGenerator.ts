import { GalaxyConfig, GalaxyShape, GalaxySystemNode } from './GalaxyTypes';
import { GALAXY_DEFAULTS } from './GalaxyConfig';
import { GalaxyEngine } from './GalaxyEngine';

export class GalaxyGenerator {
  public static generate(
    seedStr: string,
    systemCount: number = 2000,
    forcedShape?: GalaxyShape
  ): GalaxyConfig {
    const engine = new GalaxyEngine(seedStr);

    const shape = forcedShape || engine.randomElement(GALAXY_DEFAULTS.SHAPES);
    const coreColor = engine.randomElement(GALAXY_DEFAULTS.CORE_COLORS);
    const outerColor = engine.randomElement(GALAXY_DEFAULTS.OUTER_COLORS);

    // Placeholder for systems
    const systems: GalaxySystemNode[] = [];

    // We will populate systems procedurally in step 2 & 3
    for (let i = 0; i < systemCount; i++) {
      // Basic random distribution as a placeholder
      const x = engine.randomRange(
        -GALAXY_DEFAULTS.RADIUS_X,
        GALAXY_DEFAULTS.RADIUS_X
      );
      const y = engine.randomRange(
        -GALAXY_DEFAULTS.THICKNESS_Y,
        GALAXY_DEFAULTS.THICKNESS_Y
      );
      const z = engine.randomRange(
        -GALAXY_DEFAULTS.RADIUS_Z,
        GALAXY_DEFAULTS.RADIUS_Z
      );

      systems.push({
        id: `sys-${i}`,
        position: [x, y, z],
        size: engine.randomRange(0.5, 2.0),
        color: engine.random() > 0.5 ? coreColor : outerColor,
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
