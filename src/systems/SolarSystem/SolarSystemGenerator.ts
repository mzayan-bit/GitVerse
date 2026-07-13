import {
  SolarSystemConfig,
  SolarSystemSeed,
  PlanetNode,
  StarConfig,
  OrbitConfig,
} from './SolarSystemTypes';
import { SOLAR_SYSTEM_DEFAULTS } from './SolarSystemConfig';
import { PlanetEngine } from '@/planets/PlanetEngine';
import { PlanetFactory } from '@/planets/PlanetFactory';

export class SolarSystemGenerator {
  static generate(
    seedStr: string,
    requestedPlanetCount?: number
  ): SolarSystemConfig {
    const seed: SolarSystemSeed = { value: seedStr };
    const engine = new PlanetEngine(seed); // Reuse PRNG from PlanetEngine

    const star = this.generateStar(engine);

    // Determine planet count
    let count = requestedPlanetCount;
    if (count === undefined) {
      count = Math.floor(
        engine.randomRange(
          SOLAR_SYSTEM_DEFAULTS.MIN_PLANETS,
          Math.min(10, SOLAR_SYSTEM_DEFAULTS.MAX_PLANETS)
        )
      );
    }

    const planets = this.generatePlanets(engine, seedStr, count, star.radius);

    return {
      seed,
      star,
      planets,
    };
  }

  private static generateStar(engine: PlanetEngine): StarConfig {
    const radius = engine.randomRange(
      SOLAR_SYSTEM_DEFAULTS.MIN_STAR_RADIUS,
      SOLAR_SYSTEM_DEFAULTS.MAX_STAR_RADIUS
    );
    const color = engine.randomElement(SOLAR_SYSTEM_DEFAULTS.STAR_COLORS);

    return {
      radius,
      color,
      temperature: engine.randomRange(3000, 10000),
      glowIntensity: engine.randomRange(1.5, 3.0),
      emission: engine.randomRange(1.0, 2.5),
      type: 'main_sequence',
    };
  }

  private static generatePlanets(
    engine: PlanetEngine,
    systemSeed: string,
    count: number,
    starRadius: number
  ): PlanetNode[] {
    const nodes: PlanetNode[] = [];

    let currentOrbitRadius =
      starRadius + SOLAR_SYSTEM_DEFAULTS.MIN_ORBIT_RADIUS;

    for (let i = 0; i < count; i++) {
      // Planet ID and Seed based on system seed + index
      const planetId = `${systemSeed}-planet-${i}`;

      // Generate Planet Config
      const planetConfig = PlanetFactory.create(planetId);

      // Ensure orbit is pushed out far enough to avoid collision with previous planet
      const planetRadius = planetConfig.terrain.baseRadius;
      currentOrbitRadius +=
        planetRadius * 2 +
        engine.randomRange(10, SOLAR_SYSTEM_DEFAULTS.ORBIT_SPACING);

      // Eccentricity (0 to 0.2 mostly, rarely up to 0.4)
      const eccentricity =
        engine.random() > 0.8
          ? engine.randomRange(0.2, 0.4)
          : engine.randomRange(0, 0.1);

      const radiusX = currentOrbitRadius;
      const radiusZ = currentOrbitRadius * (1 - eccentricity * 0.5); // Elliptical distortion

      const orbit: OrbitConfig = {
        radiusX,
        radiusZ,
        speed:
          (engine.randomRange(
            SOLAR_SYSTEM_DEFAULTS.MIN_ORBIT_SPEED,
            SOLAR_SYSTEM_DEFAULTS.MAX_ORBIT_SPEED
          ) *
            (engine.random() > 0.9 ? 2 : 1)) /
          (Math.sqrt(currentOrbitRadius) * 0.1), // Kepler approximation
        direction: engine.random() > 0.1 ? 1 : -1, // Most orbit same direction
        inclination: engine.randomRange(-0.1, 0.1), // Slight tilt
        eccentricity,
        rotationSpeed: engine.randomRange(0.01, 0.1),
        rotationTilt: engine.randomRange(-0.5, 0.5),
        initialAngle: engine.randomRange(0, Math.PI * 2),
      };

      nodes.push({
        id: planetId,
        planet: planetConfig,
        orbit,
      });

      // Push radius for next iteration
      currentOrbitRadius += planetRadius * 2;
    }

    return nodes;
  }
}
