// ============================================================================
// Repository History Types
// ============================================================================
// Core type definitions for the entire evolution system.
// Every type here is a DTO — shaped from Git history, decoupled from visuals.
// ============================================================================

/** A single file change within a commit */
export interface GitFileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  previousPath?: string; // Only for renames
}

/** Commit statistics summary */
export interface GitCommitStats {
  additions: number;
  deletions: number;
  total: number;
}

/** A single Git commit */
export interface GitCommit {
  sha: string;
  message: string;
  author: GitAuthor;
  date: string; // ISO 8601
  parents: string[]; // Parent SHAs
  stats: GitCommitStats;
  files: GitFileChange[];
  isMerge: boolean;
}

/** A Git branch reference */
export interface GitBranch {
  name: string;
  sha: string; // HEAD commit SHA
  isDefault: boolean;
  isProtected: boolean;
}

/** A Git tag */
export interface GitTag {
  name: string;
  sha: string;
  date: string; // ISO 8601
  message: string;
}

/** A GitHub release (superset of tag) */
export interface GitRelease {
  tagName: string;
  name: string;
  date: string; // ISO 8601
  body: string;
  isDraft: boolean;
  isPrerelease: boolean;
}

/** A commit author with aggregate stats */
export interface GitAuthor {
  login: string;
  email: string;
  avatarUrl: string;
  commitCount: number;
}

/** The complete history of a repository */
export interface RepositoryHistory {
  repoFullName: string;
  defaultBranch: string;
  commits: GitCommit[];
  branches: GitBranch[];
  tags: GitTag[];
  releases: GitRelease[];
  authors: GitAuthor[];
  mergeCommits: GitCommit[];
  importedAt: string; // ISO 8601
  totalCommitCount: number;
}

/** Import progress callback */
export interface HistoryImportProgress {
  phase: 'commits' | 'branches' | 'tags' | 'releases' | 'processing';
  loaded: number;
  total: number;
  message: string;
}
