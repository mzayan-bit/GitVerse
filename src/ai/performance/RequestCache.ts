import { GenerationResult } from '../providers/AITypes';

interface CacheEntry {
  hash: string;
  response: GenerationResult;
  timestamp: number;
}

export class RequestCache {
  private cache: Map<string, CacheEntry> = new Map();
  private ttl: number = 3600000; // 1 hour by default

  constructor(ttlMs?: number) {
    if (ttlMs) this.ttl = ttlMs;
  }

  public get(queryHash: string): GenerationResult | null {
    const entry = this.cache.get(queryHash);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(queryHash);
      return null;
    }

    return entry.response;
  }

  public set(queryHash: string, response: GenerationResult) {
    this.cache.set(queryHash, {
      hash: queryHash,
      response,
      timestamp: Date.now(),
    });
  }

  /**
   * Generates a deterministic hash for identical queries with identical contexts.
   */
  public static hashQuery(query: string, contextSnapshot: string): string {
    // In a real implementation this would use crypto.subtle.digest or an external library
    // For now we simulate it by combining strings
    return Buffer.from(`${query}:${contextSnapshot}`).toString('base64');
  }
}
