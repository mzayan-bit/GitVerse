import { PlanetConfig, PlanetSeed } from './PlanetTypes';
import { PlanetEngine } from './PlanetEngine';
import {
  DEFAULT_ATMOSPHERE,
  DEFAULT_MATERIAL,
  DEFAULT_TERRAIN,
} from './PlanetSettings';

export interface IPlanetGenerator {
  generate(engine: PlanetEngine, seed: PlanetSeed): PlanetConfig;
}

/**
 * Base generator that returns defaults.
 * Specific planet type generators will override these values.
 */
export class BasePlanetGenerator implements IPlanetGenerator {
  public generate(_engine: PlanetEngine, seed: PlanetSeed): PlanetConfig {
    return {
      seed,
      type: 'rocky',
      terrain: { ...DEFAULT_TERRAIN },
      material: { ...DEFAULT_MATERIAL },
      atmosphere: { ...DEFAULT_ATMOSPHERE },
    };
  }
}
