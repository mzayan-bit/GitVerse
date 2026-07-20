export interface RepositorySnapshot {
  repositoryId: string;
  totalFiles: number;
  totalLines: number;
  primaryLanguages: string[];
  recentCommits: CommitSummary[];
}

export interface CommitSummary {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export interface SemanticCitation {
  chunkId: string;
  path: string;
  snippet: string;
  relevanceScore: number;
}

export interface EngineeringContext {
  snapshot: RepositorySnapshot;
  citations: SemanticCitation[];
  directoryStructure?: string;
  dependencyGraphContext?: string;
}
