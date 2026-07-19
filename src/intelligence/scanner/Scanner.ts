import { ScannerConfig, ScannerResult } from './ScannerTypes';
import { ScannerWorker } from './ScannerWorker';
import { ScannerCache } from './ScannerCache';

/**
 * Repository Scanner Engine
 * Supports recursive scanning, ignore rules, and binary detection.
 */
export class Scanner {
  private config: ScannerConfig;

  constructor(config: ScannerConfig) {
    this.config = {
      maxDepth: 10,
      maxFileSize: 1024 * 1024 * 10, // 10MB default
      ...config,
    };
  }

  /**
   * Scan a virtual or physical file system.
   * For this implementation, we accept a list of pre-fetched file paths and sizes
   * to remain compatible with both local and GitHub-hosted repositories.
   */
  public async scan(
    repoId: string,
    files: Array<{ path: string; size: number }>
  ): Promise<ScannerResult> {
    const cached = ScannerCache.get(repoId);
    if (cached) return cached;

    const startTime = Date.now();
    const result: ScannerResult = {
      totalFiles: 0,
      totalDirectories: 0,
      totalSize: 0,
      files: {},
      directories: [],
      skippedFiles: [],
      durationMs: 0,
    };

    const dirSet = new Set<string>();

    for (const file of files) {
      // 1. Ignore rules
      if (this.shouldIgnore(file.path)) {
        result.skippedFiles.push(file.path);
        continue;
      }

      // 2. Directory indexing
      const parts = file.path.split('/');
      parts.pop(); // Remove filename
      let currentDir = '';
      for (const part of parts) {
        currentDir = currentDir ? `${currentDir}/${part}` : part;
        dirSet.add(currentDir);
      }

      // 3. File sizing limits
      if (this.config.maxFileSize && file.size > this.config.maxFileSize) {
        result.skippedFiles.push(file.path);
        continue;
      }

      // 4. Extract Metadata
      const metadata = ScannerWorker.processFile(file.path, file.size);

      result.files[file.path] = metadata;
      result.totalFiles++;
      result.totalSize += file.size;
    }

    result.directories = Array.from(dirSet);
    result.totalDirectories = dirSet.size;
    result.durationMs = Date.now() - startTime;

    ScannerCache.set(repoId, result);

    return result;
  }

  private shouldIgnore(path: string): boolean {
    for (const pattern of this.config.ignorePatterns) {
      // Simple exact match or starts with for ignore rules
      if (path.includes(pattern) || path.startsWith(pattern)) {
        return true;
      }
    }
    return false;
  }
}
