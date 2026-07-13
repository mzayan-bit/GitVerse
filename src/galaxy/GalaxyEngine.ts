import { GalaxySeed } from './GalaxyTypes';

/**
 * A simple deterministic PRNG (Pseudo-Random Number Generator) based on Mulberry32.
 */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simple string hash to generate a seed number.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export class GalaxyEngine {
  private prng: () => number;

  constructor(seed: GalaxySeed | string) {
    const seedString = typeof seed === 'string' ? seed : seed.value;
    const numericSeed = hashString(seedString);
    this.prng = mulberry32(numericSeed);
  }

  /**
   * Returns a deterministic random number between 0 and 1.
   */
  public random(): number {
    return this.prng();
  }

  /**
   * Returns a deterministic random number between min and max.
   */
  public randomRange(min: number, max: number): number {
    return min + this.random() * (max - min);
  }

  /**
   * Returns a random element from an array.
   */
  public randomElement<T>(array: T[]): T {
    const index = Math.floor(this.random() * array.length);
    return array[index];
  }

  /**
   * Generates a 3D point using a Box-Muller transform for Gaussian distribution
   */
  public randomGaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.max(Number.EPSILON, this.random());
    const u2 = this.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}
