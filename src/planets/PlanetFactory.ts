import { PlanetConfig, PlanetSeed, PlanetType } from './PlanetTypes';
import { PlanetEngine } from './PlanetEngine';
import { IPlanetGenerator } from './PlanetGenerator';
import {
  RockyGenerator,
  IceGenerator,
  LavaGenerator,
  GasGenerator,
  DesertGenerator,
  OceanGenerator,
  ForestGenerator,
  BarrenGenerator,
} from './Generators';

/**
 * Creates planet configurations based on seeds.
 */
export class PlanetFactory {
  static create(seed: string, forcedType?: PlanetType): PlanetConfig {
    const planetSeed: PlanetSeed = { value: seed };
    const engine = new PlanetEngine(planetSeed);

    let typeToGenerate = forcedType;

    if (!typeToGenerate) {
      const types: PlanetType[] = [
        'rocky',
        'ice',
        'lava',
        'gas',
        'desert',
        'ocean',
        'forest',
        'barren',
      ];
      typeToGenerate = engine.randomElement(types);
    }

    let generator: IPlanetGenerator;

    switch (typeToGenerate) {
      case 'rocky':
        generator = new RockyGenerator();
        break;
      case 'ice':
        generator = new IceGenerator();
        break;
      case 'lava':
        generator = new LavaGenerator();
        break;
      case 'gas':
        generator = new GasGenerator();
        break;
      case 'desert':
        generator = new DesertGenerator();
        break;
      case 'ocean':
        generator = new OceanGenerator();
        break;
      case 'forest':
        generator = new ForestGenerator();
        break;
      case 'barren':
        generator = new BarrenGenerator();
        break;
      default:
        generator = new RockyGenerator();
        break;
    }

    return generator.generate(engine, planetSeed);
  }
}
