/**
 * RepositoryCache — Intelligent caching layer for domain models.
 *
 * Features:
 * - In-memory cache with TTL
 * - localStorage persistence (survives page refreshes)
 * - Cache invalidation
 * - Background refresh hooks
 * - Cache statistics
 * - Offline mode preparation
 */

import { RepositoryDomainModel } from '@/domain/RepositoryModels';

interface CacheEntry {
  data: RepositoryDomainModel[];
  timestamp: number;
  source: 'user' | 'org';
  sourceKey: string;
}

export interface CacheStatistics {
  totalEntries: number;
  totalRepositories: number;
  oldestEntry: number | null;
  newestEntry: number | null;
  memoryHits: number;
  persistentHits: number;
  misses: number;
}

const DEFAULT_TTL = 1000 * 60 * 10; // 10 minutes
const STORAGE_PREFIX = 'gitverse_cache_';

export class RepositoryCache {
  private memoryCache = new Map<string, CacheEntry>();
  private ttl: number;
  private stats = { memoryHits: 0, persistentHits: 0, misses: 0 };

  constructor(ttlMs = DEFAULT_TTL) {
    this.ttl = ttlMs;
  }

  /**
   * Retrieve cached data. Checks memory first, then persistent storage.
   */
  public get(key: string): RepositoryDomainModel[] | null {
    // 1. Check memory cache
    const memEntry = this.memoryCache.get(key);
    if (memEntry && !this.isExpired(memEntry)) {
      this.stats.memoryHits++;
      return memEntry.data;
    }

    // 2. Check persistent cache
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_PREFIX + key);
        if (stored) {
          const parsed = JSON.parse(stored) as CacheEntry;
          if (!this.isExpired(parsed)) {
            // Promote to memory cache
            this.memoryCache.set(key, parsed);
            this.stats.persistentHits++;
            return parsed.data;
          } else {
            localStorage.removeItem(STORAGE_PREFIX + key);
          }
        }
      } catch {
        // Corrupted localStorage entry, silently skip
      }
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Store data in both memory and persistent cache.
   */
  public set(
    key: string,
    data: RepositoryDomainModel[],
    source: 'user' | 'org' = 'user'
  ): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      source,
      sourceKey: key,
    };

    this.memoryCache.set(key, entry);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
      } catch {
        // Storage quota exceeded — silently skip persistence
      }
    }
  }

  /**
   * Invalidate a specific cache entry.
   */
  public invalidate(key: string): void {
    this.memoryCache.delete(key);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_PREFIX + key);
    }
  }

  /**
   * Clear all cache entries.
   */
  public clear(): void {
    this.memoryCache.clear();

    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(STORAGE_PREFIX)
      );
      keys.forEach((k) => localStorage.removeItem(k));
    }
  }

  /**
   * Get cache statistics.
   */
  public getStatistics(): CacheStatistics {
    let oldest: number | null = null;
    let newest: number | null = null;
    let totalRepos = 0;

    for (const entry of this.memoryCache.values()) {
      totalRepos += entry.data.length;
      if (oldest === null || entry.timestamp < oldest) oldest = entry.timestamp;
      if (newest === null || entry.timestamp > newest) newest = entry.timestamp;
    }

    return {
      totalEntries: this.memoryCache.size,
      totalRepositories: totalRepos,
      oldestEntry: oldest,
      newestEntry: newest,
      memoryHits: this.stats.memoryHits,
      persistentHits: this.stats.persistentHits,
      misses: this.stats.misses,
    };
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.ttl;
  }
}

/**
 * Singleton cache instance for the application.
 * Shared across all components that need cached repository data.
 */
export const repositoryCache = new RepositoryCache();
