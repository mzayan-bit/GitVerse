// ============================================================================
// Evolution Types — Snapshots and Timeline entries
// ============================================================================

/** A file in the virtual file system at a point in time */
export interface VirtualFile {
  path: string;
  extension: string;
  estimatedSize: number;
  lastModifiedCommit: string; // SHA
  lastModifiedDate: string; // ISO 8601
}

/** Directory structure at a point in time */
export interface VirtualDirectory {
  path: string;
  name: string;
  fileCount: number;
  totalSize: number;
  children: string[]; // Child directory paths
  files: string[]; // File paths in this directory
}

/** Language distribution at a point in time */
export interface LanguageSnapshot {
  name: string;
  fileCount: number;
  estimatedBytes: number;
  percentage: number;
}

/** Contributor activity at a point in time */
export interface ContributorSnapshot {
  login: string;
  avatarUrl: string;
  commitCount: number;
  firstCommitDate: string;
  lastCommitDate: string;
}

/** Complete state of the repository at a given moment */
export interface RepositorySnapshot {
  date: string; // ISO 8601
  commitSha: string;
  commitMessage: string;
  commitAuthor: string;

  // File system state
  fileCount: number;
  totalSize: number;
  files: Map<string, VirtualFile>;
  directories: Map<string, VirtualDirectory>;

  // Aggregate metrics
  totalCommits: number;
  totalAuthors: number;
  languages: LanguageSnapshot[];
  activeContributors: ContributorSnapshot[];

  // Growth deltas from previous snapshot
  filesAdded: number;
  filesRemoved: number;
  filesModified: number;
}

/** A single entry in the evolution timeline */
export interface TimelineEntry {
  index: number;
  commitSha: string;
  commitMessage: string;
  authorLogin: string;
  authorAvatar: string;
  date: string;
  isMerge: boolean;

  // Cumulative stats at this point
  cumulativeFiles: number;
  cumulativeSize: number;
  cumulativeCommits: number;
  cumulativeAuthors: number;

  // Delta from previous entry
  filesAdded: string[];
  filesRemoved: string[];
  filesModified: string[];

  // Tags/releases at this commit
  tags: string[];
  releaseName: string | null;
}

/** The complete evolution timeline for a repository */
export interface EvolutionTimeline {
  repoFullName: string;
  defaultBranch: string;
  entries: TimelineEntry[];
  startDate: string;
  endDate: string;
  totalCommits: number;

  // Pre-computed curves for quick visualization
  growthCurve: Array<{ date: string; files: number; size: number }>;
  languageCurve: Array<{
    date: string;
    languages: Array<{ name: string; percentage: number }>;
  }>;
  contributorCurve: Array<{ date: string; count: number }>;
}
