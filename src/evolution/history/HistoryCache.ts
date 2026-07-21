// ============================================================================
// History Cache — In-memory + localStorage persistence
// ============================================================================
// Stores repository history with TTL-based invalidation.
// Uses localStorage with compressed JSON to minimize footprint.
// ============================================================================

import type { RepositoryHistory } from './HistoryTypes';

const CACHE_PREFIX = 'gitverse-history-';
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours

interface CacheEntry {
  data: RepositoryHistory;
  storedAt: number;
}

export class HistoryCache {
  private static instance: HistoryCache;
  private memoryCache = new Map<string, CacheEntry>();

  private constructor() {
    this.hydrateFromStorage();
  }

  public static getInstance(): HistoryCache {
    if (!HistoryCache.instance) {
      HistoryCache.instance = new HistoryCache();
    }
    return HistoryCache.instance;
  }

  /** Store history for a repo */
  public store(repoFullName: string, history: RepositoryHistory): void {
    const entry: CacheEntry = {
      data: history,
      storedAt: Date.now(),
    };

    this.memoryCache.set(repoFullName, entry);

    // Persist to localStorage (trimmed to save space)
    try {
      const trimmed = this.trimForStorage(history);
      const key = CACHE_PREFIX + repoFullName;
      localStorage.setItem(
        key,
        JSON.stringify({ data: trimmed, storedAt: entry.storedAt })
      );
    } catch {
      // localStorage full or unavailable — memory cache still works
    }
  }

  /** Get cached history, or null if expired/missing */
  public get(repoFullName: string): RepositoryHistory | null {
    // Check memory first
    const memEntry = this.memoryCache.get(repoFullName);
    if (memEntry && !this.isExpired(memEntry)) {
      return memEntry.data;
    }

    // Check localStorage
    try {
      const key = CACHE_PREFIX + repoFullName;
      const raw = localStorage.getItem(key);
      if (raw) {
        const entry = JSON.parse(raw) as CacheEntry;
        if (!this.isExpired(entry)) {
          this.memoryCache.set(repoFullName, entry);
          return entry.data;
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // Parse error or unavailable
    }

    return null;
  }

  /** Invalidate cache for a specific repo */
  public invalidate(repoFullName: string): void {
    this.memoryCache.delete(repoFullName);
    try {
      localStorage.removeItem(CACHE_PREFIX + repoFullName);
    } catch {
      // Ignore
    }
  }

  /** Clear all history caches */
  public clearAll(): void {
    this.memoryCache.clear();
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(CACHE_PREFIX)
      );
      for (const key of keys) {
        localStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.storedAt > CACHE_TTL_MS;
  }

  /** Trim large fields to fit localStorage limits */
  private trimForStorage(history: RepositoryHistory): RepositoryHistory {
    // For storage, limit commits to 500 and strip large file arrays
    const trimmedCommits = history.commits.slice(0, 500).map((c) => ({
      ...c,
      files: c.files.slice(0, 50), // Keep at most 50 file changes per commit
    }));

    return {
      ...history,
      commits: trimmedCommits,
      mergeCommits: history.mergeCommits.slice(0, 100),
    };
  }

  /** Hydrate memory cache from localStorage on startup */
  private hydrateFromStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(CACHE_PREFIX)
      );
      for (const key of keys) {
        const repoName = key.slice(CACHE_PREFIX.length);
        const raw = localStorage.getItem(key);
        if (raw) {
          const entry = JSON.parse(raw) as CacheEntry;
          if (!this.isExpired(entry)) {
            this.memoryCache.set(repoName, entry);
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    } catch {
      // Ignore hydration errors
    }
  }
}
