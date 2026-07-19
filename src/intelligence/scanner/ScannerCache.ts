import { ScannerResult } from './ScannerTypes';

export class ScannerCache {
  private static cache = new Map<string, ScannerResult>();

  public static get(repoId: string): ScannerResult | undefined {
    return this.cache.get(repoId);
  }

  public static set(repoId: string, result: ScannerResult): void {
    this.cache.set(repoId, result);
  }

  public static clear(): void {
    this.cache.clear();
  }
}
