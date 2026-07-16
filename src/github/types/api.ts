/**
 * Strongly-typed GitHub API response types.
 * These are DTOs — raw shapes from the GitHub REST API,
 * completely decoupled from our domain models.
 */

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  total_private_repos?: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubOrganization {
  id: number;
  login: string;
  avatar_url: string;
  description: string | null;
  name?: string | null;
  repos_url: string;
  public_repos?: number;
  total_private_repos?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  html_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  default_branch: string;
  has_issues: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  license: { spdx_id: string; name: string } | null;
  visibility: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface GitHubRateLimitResponse {
  resources: {
    core: GitHubRateLimit;
    search: GitHubRateLimit;
    graphql: GitHubRateLimit;
  };
  rate: GitHubRateLimit;
}
