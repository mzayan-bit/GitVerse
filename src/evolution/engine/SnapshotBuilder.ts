// ============================================================================
// Snapshot Builder — Incrementally constructs RepositorySnapshot from diffs
// ============================================================================
// Maintains a virtual file system and applies additions, deletions, renames
// from each commit to compute the repo state at any point.
// ============================================================================

import type { GitCommit, GitFileChange } from '../history/HistoryTypes';
import type {
  VirtualFile,
  VirtualDirectory,
  LanguageSnapshot,
  ContributorSnapshot,
  RepositorySnapshot,
} from './EvolutionTypes';

// Language extension mapping for estimation
const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JavaScript',
  py: 'Python',
  rs: 'Rust',
  go: 'Go',
  java: 'Java',
  rb: 'Ruby',
  cpp: 'C++',
  c: 'C',
  h: 'C',
  cs: 'C#',
  php: 'PHP',
  swift: 'Swift',
  kt: 'Kotlin',
  scala: 'Scala',
  dart: 'Dart',
  vue: 'Vue',
  svelte: 'Svelte',
  md: 'Markdown',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  css: 'CSS',
  scss: 'SCSS',
  html: 'HTML',
  sql: 'SQL',
  sh: 'Shell',
  bash: 'Shell',
  toml: 'TOML',
  xml: 'XML',
};

const AVERAGE_BYTES_PER_LINE = 35;

export class SnapshotBuilder {
  private files: Map<string, VirtualFile> = new Map();
  private authorSet: Map<string, ContributorSnapshot> = new Map();
  private commitCount = 0;

  /**
   * Apply a commit's changes to the virtual file system.
   * Returns a snapshot of the current state.
   */
  public applyCommit(commit: GitCommit): RepositorySnapshot {
    this.commitCount++;
    let filesAdded = 0;
    let filesRemoved = 0;
    let filesModified = 0;

    // Apply file changes
    for (const change of commit.files) {
      switch (change.status) {
        case 'added':
          this.addFile(change, commit);
          filesAdded++;
          break;
        case 'deleted':
          this.removeFile(change.path);
          filesRemoved++;
          break;
        case 'renamed':
          this.renameFile(change, commit);
          filesModified++;
          break;
        case 'modified':
          this.modifyFile(change, commit);
          filesModified++;
          break;
      }
    }

    // If no file changes (lightweight commit), still track the commit
    if (commit.files.length === 0 && commit.stats.total > 0) {
      // Estimate: distribute changes across existing files
      filesModified = Math.min(commit.stats.total, this.files.size);
    }

    // Track author
    const authorLogin = commit.author.login;
    const existing = this.authorSet.get(authorLogin);
    if (existing) {
      existing.commitCount++;
      existing.lastCommitDate = commit.date;
    } else {
      this.authorSet.set(authorLogin, {
        login: authorLogin,
        avatarUrl: commit.author.avatarUrl,
        commitCount: 1,
        firstCommitDate: commit.date,
        lastCommitDate: commit.date,
      });
    }

    return this.buildSnapshot(commit, filesAdded, filesRemoved, filesModified);
  }

  /** Get the current snapshot without applying a commit */
  public getCurrentSnapshot(commit: GitCommit): RepositorySnapshot {
    return this.buildSnapshot(commit, 0, 0, 0);
  }

  /** Reset the builder to empty state */
  public reset(): void {
    this.files.clear();
    this.authorSet.clear();
    this.commitCount = 0;
  }

  // ─── Private methods ────────────────────────────────────────────────

  private addFile(change: GitFileChange, commit: GitCommit): void {
    const ext = this.getExtension(change.path);
    const estimatedSize =
      (change.additions + change.deletions) * AVERAGE_BYTES_PER_LINE || 500;

    this.files.set(change.path, {
      path: change.path,
      extension: ext,
      estimatedSize,
      lastModifiedCommit: commit.sha,
      lastModifiedDate: commit.date,
    });
  }

  private removeFile(path: string): void {
    this.files.delete(path);
  }

  private renameFile(change: GitFileChange, commit: GitCommit): void {
    if (change.previousPath) {
      const oldFile = this.files.get(change.previousPath);
      this.files.delete(change.previousPath);

      this.files.set(change.path, {
        path: change.path,
        extension: this.getExtension(change.path),
        estimatedSize:
          oldFile?.estimatedSize ||
          change.additions * AVERAGE_BYTES_PER_LINE ||
          500,
        lastModifiedCommit: commit.sha,
        lastModifiedDate: commit.date,
      });
    }
  }

  private modifyFile(change: GitFileChange, commit: GitCommit): void {
    const existing = this.files.get(change.path);
    if (existing) {
      // Adjust size estimate based on line changes
      const delta =
        (change.additions - change.deletions) * AVERAGE_BYTES_PER_LINE;
      existing.estimatedSize = Math.max(100, existing.estimatedSize + delta);
      existing.lastModifiedCommit = commit.sha;
      existing.lastModifiedDate = commit.date;
    } else {
      // File exists in repo but we haven't seen its addition (before our history window)
      this.addFile({ ...change, status: 'added' }, commit);
    }
  }

  private buildSnapshot(
    commit: GitCommit,
    filesAdded: number,
    filesRemoved: number,
    filesModified: number
  ): RepositorySnapshot {
    // Build directory structure
    const directories = this.computeDirectories();

    // Compute language distribution
    const languages = this.computeLanguages();

    // Compute total size
    let totalSize = 0;
    for (const file of this.files.values()) {
      totalSize += file.estimatedSize;
    }

    return {
      date: commit.date,
      commitSha: commit.sha,
      commitMessage: commit.message,
      commitAuthor: commit.author.login,
      fileCount: this.files.size,
      totalSize,
      files: new Map(this.files),
      directories,
      totalCommits: this.commitCount,
      totalAuthors: this.authorSet.size,
      languages,
      activeContributors: Array.from(this.authorSet.values()),
      filesAdded,
      filesRemoved,
      filesModified,
    };
  }

  private computeDirectories(): Map<string, VirtualDirectory> {
    const dirs = new Map<string, VirtualDirectory>();

    for (const file of this.files.values()) {
      const parts = file.path.split('/');
      // Build directory chain
      for (let i = 0; i < parts.length - 1; i++) {
        const dirPath = parts.slice(0, i + 1).join('/');
        if (!dirs.has(dirPath)) {
          dirs.set(dirPath, {
            path: dirPath,
            name: parts[i],
            fileCount: 0,
            totalSize: 0,
            children: [],
            files: [],
          });
        }
      }

      // Add file to its parent directory
      if (parts.length > 1) {
        const parentPath = parts.slice(0, -1).join('/');
        const parent = dirs.get(parentPath);
        if (parent) {
          parent.files.push(file.path);
          parent.fileCount++;
          parent.totalSize += file.estimatedSize;
        }
      }
    }

    // Build child relationships
    for (const [path, dir] of dirs) {
      const parentParts = path.split('/');
      if (parentParts.length > 1) {
        const parentPath = parentParts.slice(0, -1).join('/');
        const parent = dirs.get(parentPath);
        if (parent && !parent.children.includes(path)) {
          parent.children.push(path);
        }
      }
    }

    return dirs;
  }

  private computeLanguages(): LanguageSnapshot[] {
    const langMap = new Map<string, { count: number; bytes: number }>();

    for (const file of this.files.values()) {
      const lang =
        EXTENSION_TO_LANGUAGE[file.extension] || file.extension || 'Other';
      const existing = langMap.get(lang) || { count: 0, bytes: 0 };
      existing.count++;
      existing.bytes += file.estimatedSize;
      langMap.set(lang, existing);
    }

    const total = this.files.size || 1;
    return Array.from(langMap.entries())
      .map(([name, data]) => ({
        name,
        fileCount: data.count,
        estimatedBytes: data.bytes,
        percentage: (data.count / total) * 100,
      }))
      .sort((a, b) => b.fileCount - a.fileCount);
  }

  private getExtension(path: string): string {
    const parts = path.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }
}
