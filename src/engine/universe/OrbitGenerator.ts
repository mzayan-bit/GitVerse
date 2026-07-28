import { SeedManager } from './SeedManager';

export interface OrbitPath {
  semiMajorAxis: number;
  semiMinorAxis: number;
  eccentricity: number;
  inclination: number; // in radians
  longitudeOfAscendingNode: number; // in radians
  argumentOfPeriapsis: number; // in radians
  orbitalPeriod: number; // in seconds
  initialAnomaly: number; // in radians
  density: number; // Orbit density driven by dependencies
}

export class OrbitGenerator {
  /**
   * Calculate 3D position on Keplerian orbit for a given time t
   */
  public static getPositionOnOrbit(
    orbit: OrbitPath,
    timeInSeconds: number
  ): [number, number, number] {
    const meanAnomaly =
      orbit.initialAnomaly +
      ((2 * Math.PI) / orbit.orbitalPeriod) * timeInSeconds;

    // Approximate Eccentric Anomaly using Newton's method
    let E = meanAnomaly;
    for (let i = 0; i < 5; i++) {
      E =
        E -
        (E - orbit.eccentricity * Math.sin(E) - meanAnomaly) /
          (1 - orbit.eccentricity * Math.cos(E));
    }

    // 2D position in orbital plane
    const xOrbital = orbit.semiMajorAxis * (Math.cos(E) - orbit.eccentricity);
    const yOrbital =
      orbit.semiMajorAxis *
      Math.sqrt(1 - orbit.eccentricity * orbit.eccentricity) *
      Math.sin(E);

    // Rotate into 3D celestial coordinates
    const cosI = Math.cos(orbit.inclination);
    const sinI = Math.sin(orbit.inclination);
    const cosO = Math.cos(orbit.longitudeOfAscendingNode);
    const sinO = Math.sin(orbit.longitudeOfAscendingNode);
    const cosW = Math.cos(orbit.argumentOfPeriapsis);
    const sinW = Math.sin(orbit.argumentOfPeriapsis);

    const x =
      (cosO * cosW - sinO * sinW * cosI) * xOrbital +
      (-cosO * sinW - sinO * cosW * cosI) * yOrbital;
    const y =
      (sinO * cosW + cosO * sinW * cosI) * xOrbital +
      (-sinO * sinW + cosO * cosW * cosI) * yOrbital;
    const z = sinW * sinI * xOrbital + cosW * sinI * yOrbital;

    return [x, y, z];
  }

  /**
   * Generates a deterministic OrbitPath for a planet around a solar center
   */
  public static generateOrbit(
    orbitIndex: number,
    dependencyCount: number,
    seedManager: SeedManager
  ): OrbitPath {
    const seed = seedManager.fork(`orbit:${orbitIndex}`);
    const semiMajorAxis = 140 + orbitIndex * 120 + seed.nextRange(-20, 30);
    const eccentricity = seed.nextRange(0.01, 0.22);
    const semiMinorAxis =
      semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
    const inclination = seed.nextRange(-0.25, 0.25);
    const longitudeOfAscendingNode = seed.nextRange(0, Math.PI * 2);
    const argumentOfPeriapsis = seed.nextRange(0, Math.PI * 2);
    const orbitalPeriod = 40 + orbitIndex * 25 + seed.nextRange(-10, 15);
    const initialAnomaly = seed.nextRange(0, Math.PI * 2);
    const density = Math.min(10, 1 + dependencyCount * 1.5);

    return {
      semiMajorAxis,
      semiMinorAxis,
      eccentricity,
      inclination,
      longitudeOfAscendingNode,
      argumentOfPeriapsis,
      orbitalPeriod,
      initialAnomaly,
      density,
    };
  }
}
