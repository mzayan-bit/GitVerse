import { IPlanetGenerator } from '../PlanetGenerator';
import {
  PlanetConfig,
  PlanetSeed,
  PlanetType,
  TerrainConfig,
  AtmosphereConfig,
  PlanetMaterialConfig,
} from '../PlanetTypes';
import { PlanetEngine } from '../PlanetEngine';
import * as Presets from '../Materials/Presets';

abstract class BaseVariantGenerator implements IPlanetGenerator {
  protected abstract type: PlanetType;

  public generate(engine: PlanetEngine, seed: PlanetSeed): PlanetConfig {
    return {
      seed,
      type: this.type,
      terrain: this.generateTerrain(engine),
      material: this.getMaterialPreset(),
      atmosphere: this.generateAtmosphere(engine),
    };
  }

  protected generateTerrain(engine: PlanetEngine): TerrainConfig {
    return {
      baseRadius: engine.randomRange(8, 12),
      displacementStrength: engine.randomRange(0.2, 1.5),
      noiseScale: engine.randomRange(0.5, 2.0),
      octaves: Math.floor(engine.randomRange(3, 6)),
      persistence: engine.randomRange(0.4, 0.6),
      lacunarity: engine.randomRange(1.8, 2.2),
      flattenPoles: engine.random() > 0.5,
    };
  }

  protected abstract getMaterialPreset(): PlanetMaterialConfig;

  protected generateAtmosphere(engine: PlanetEngine): AtmosphereConfig {
    return {
      enabled: engine.random() > 0.3,
      color: `#${Math.floor(engine.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`,
      glowIntensity: engine.randomRange(0.5, 2.0),
      thickness: engine.randomRange(1.05, 1.2),
      scattering: engine.randomRange(0.2, 0.8),
      hasClouds: engine.random() > 0.5,
      cloudSpeed: engine.randomRange(0.001, 0.005),
      cloudOpacity: engine.randomRange(0.5, 0.9),
    };
  }
}

export class RockyGenerator extends BaseVariantGenerator {
  protected type: PlanetType = 'rocky';
  protected getMaterialPreset() {
    return Presets.RockyMaterial;
  }
  protected generateAtmosphere(engine: PlanetEngine) {
    const atm = super.generateAtmosphere(engine);
    atm.enabled = engine.random() > 0.5; // less likely to have thick atmosphere
    return atm;
  }
}

export class IceGenerator extends BaseVariantGenerator {
  protected type: PlanetType = 'ice';
  protected getMaterialPreset() {
    return Presets.IceMaterial;
  }
  protected generateTerrain(engine: PlanetEngine) {
    const t = super.generateTerrain(engine);
    t.displacementStrength *= 0.5; // smoother
    return t;
  }
}

export class LavaGenerator extends BaseVariantGenerator {
  protected type: PlanetType = 'lava';
  protected getMaterialPreset() {
    return Presets.LavaMaterial;
  }
  protected generateAtmosphere(engine: PlanetEngine) {
    const atm = super.generateAtmosphere(engine);
    atm.enabled = true;
    atm.color = '#ff3300';
    atm.glowIntensity = engine.randomRange(1.5, 3.0);
    return atm;
  }
}

export class GasGenerator extends BaseVariantGenerator {
  protected type: PlanetType = 'gas';
  protected getMaterialPreset() {
    return Presets.GasMaterial;
  }
  protected generateTerrain(engine: PlanetEngine) {
    const t = super.generateTerrain(engine);
    t.baseRadius = engine.randomRange(15, 25);
    t.displacementStrength = 0; // Gas giants are smooth
    return t;
  }
  protected generateAtmosphere(engine: PlanetEngine) {
    const atm = super.generateAtmosphere(engine);
    atm.enabled = true;
    atm.thickness = engine.randomRange(1.1, 1.3);
    atm.hasClouds = true;
    atm.cloudOpacity = 1.0;
    return atm;
  }
}

export class DesertGenerator extends BaseVariantGenerator {
  protected type: PlanetType = 'desert';
  protected getMaterialPreset() {
    return Presets.DesertMaterial;
  }
}

export class OceanGenerator extends BaseVariantGenerator {
  protected type: PlanetType = 'ocean';
  protected getMaterialPreset() {
    return Presets.OceanMaterial;
  }
  protected generateTerrain(engine: PlanetEngine) {
    const t = super.generateTerrain(engine);
    t.displacementStrength = engine.randomRange(0.05, 0.2); // mostly flat
    return t;
  }
  protected generateAtmosphere(engine: PlanetEngine) {
    const atm = super.generateAtmosphere(engine);
    atm.enabled = true;
    atm.color = '#0066ff';
    return atm;
  }
}

export class ForestGenerator extends BaseVariantGenerator {
  protected type: PlanetType = 'forest';
  protected getMaterialPreset() {
    return Presets.ForestMaterial;
  }
  protected generateAtmosphere(engine: PlanetEngine) {
    const atm = super.generateAtmosphere(engine);
    atm.enabled = true;
    atm.hasClouds = true;
    return atm;
  }
}

export class BarrenGenerator extends BaseVariantGenerator {
  protected type: PlanetType = 'barren';
  protected getMaterialPreset() {
    return Presets.BarrenMaterial;
  }
  protected generateAtmosphere(engine: PlanetEngine) {
    const atm = super.generateAtmosphere(engine);
    atm.enabled = false;
    atm.hasClouds = false;
    return atm;
  }
}
