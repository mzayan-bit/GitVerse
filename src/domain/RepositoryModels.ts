export interface Contributor {
  username: string;
  avatarUrl?: string;
  commits: number;
}

export interface LanguageInfo {
  name: string;
  color: string;
  percentage: number;
}

export interface HealthScore {
  overall: number; // 0-100
  activity: number;
  community: number;
  maintenance: number;
}

export interface RepositoryDomainModel {
  id: string;
  owner: string;
  name: string;
  description: string;
  size: number; // Size in KB

  // Stats
  stars: number;
  forks: number;
  issues: number;
  commits: number;
  pullRequests: number;
  releases: number;

  // Metadata
  primaryLanguage: string;
  languages: LanguageInfo[];
  topics: string[];
  techStack: string[];

  // Community
  contributors: Contributor[];

  // Health
  healthScore: HealthScore;
  complexityScore: number; // 0-100 (Cyclomatic complexity heuristic)

  // Timestamps
  createdAt: string; // ISO String
  updatedAt: string; // ISO String

  // Flags
  isArchived: boolean;
  visibility: 'public' | 'private' | 'internal';
}
