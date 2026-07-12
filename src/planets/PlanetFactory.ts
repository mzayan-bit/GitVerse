import { PlanetConfig, PlanetSeed, PlanetType } from './PlanetTypes';
import { PlanetEngine } from './PlanetEngine';
import { BasePlanetGenerator } from './PlanetGenerator';

/**
 * Creates planet configurations based on seeds.
 * In a future step, this will route to specific generators (Rocky, Ice, Gas, etc.)
 */
export class PlanetFactory {
  static create(seed: string, forcedType?: PlanetType): PlanetConfig {
    const planetSeed: PlanetSeed = { value: seed };
    const engine = new PlanetEngine(planetSeed);

    // For now, always use the BasePlanetGenerator.
    // Later we will choose a generator based on the seed or forcedType.
    const generator = new BasePlanetGenerator();

    return generator.generate(engine, planetSeed);
  }
}
