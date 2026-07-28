/**
 * SeedManager — Deterministic PRNG and String Hashing Engine.
 * Ensures consistent, reproducible universe generation across sessions.
 */

export class SeedManager {
  private currentSeed: number;

  constructor(seedInput: string | number = 'gitverse-default-seed') {
    this.currentSeed =
      typeof seedInput === 'number'
        ? seedInput
        : SeedManager.hashString(seedInput);
  }

  /**
   * Fast 32-bit Murmur3-like string hash algorithm
   */
  public static hashString(str: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    }
    return h >>> 0;
  }

  /**
   * Mulberry32 PRNG — returns a float between 0 (inclusive) and 1 (exclusive)
   */
  public nextFloat(): number {
    let t = (this.currentSeed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Float in range [min, max)
   */
  public nextRange(min: number, max: number): number {
    return min + this.nextFloat() * (max - min);
  }

  /**
   * Integer in range [min, max]
   */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextRange(min, max + 1));
  }

  /**
   * Boolean with probability
   */
  public nextBool(probability = 0.5): boolean {
    return this.nextFloat() < probability;
  }

  /**
   * Pick random item from array deterministically
   */
  public nextChoice<T>(array: T[]): T {
    const index = this.nextInt(0, array.length - 1);
    return array[index];
  }

  /**
   * Fork a child SeedManager derived from current state + subKey
   */
  public fork(subKey: string | number): SeedManager {
    const combinedHash = SeedManager.hashString(
      `${this.currentSeed}:${subKey}`
    );
    return new SeedManager(combinedHash);
  }

  public getSeed(): number {
    return this.currentSeed;
  }
}
