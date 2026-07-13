import { PlanetConfig } from '@/planets/PlanetTypes';

export interface SolarSystemSeed {
  value: string;
}

export interface OrbitConfig {
  radiusX: number;
  radiusZ: number;
  speed: number;
  direction: 1 | -1;
  inclination: number; // Orbit tilt relative to solar equator
  eccentricity: number; // 0 = circular, >0 = elliptical
  rotationSpeed: number;
  rotationTilt: number; // Axis tilt of the planet
  initialAngle: number; // Starting position on the orbit path
}

export interface StarConfig {
  radius: number;
  color: string;
  temperature: number; // Determines base color mapping if color isn't strictly set
  glowIntensity: number;
  emission: number;
  type: 'main_sequence' | 'neutron' | 'black_hole'; // Future expansion
}

export interface PlanetNode {
  id: string;
  planet: PlanetConfig;
  orbit: OrbitConfig;
}

export interface SolarSystemConfig {
  seed: SolarSystemSeed;
  star: StarConfig;
  planets: PlanetNode[];
}
