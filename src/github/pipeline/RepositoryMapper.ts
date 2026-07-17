/**
 * RepositoryMapper — Transforms GitHub DTOs into domain models.
 *
 * This is the ONLY place in the codebase where raw API shapes touch domain models.
 * Nothing downstream ever sees GitHubRepository.
 */

import { GitHubClient } from '../client';
import { GitHubRepository } from '../types';
import {
  RepositoryDomainModel,
  LanguageInfo,
  HealthScore,
  Contributor,
} from '@/domain/RepositoryModels';

export class RepositoryMapper {
  private client: GitHubClient;

  constructor(client: GitHubClient) {
    this.client = client;
  }

  /**
   * Maps a single GitHub repository DTO to our domain model.
   * Enriches with languages and contributors from additional API calls.
   */
  public async mapToDomain(
    repo: GitHubRepository
  ): Promise<RepositoryDomainModel> {
    const languages = await this.fetchLanguages(repo.owner.login, repo.name);
    const contributors = await this.fetchContributors(
      repo.owner.login,
      repo.name
    );

    const healthScore = this.computeHealthScore(repo);

    return {
      id: repo.id.toString(),
      owner: repo.owner.login,
      name: repo.name,
      description: repo.description || '',
      size: repo.size,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      commits: repo.size, // Approximation — size correlates with commit history
      pullRequests: 0,
      releases: 0,
      primaryLanguage: repo.language || 'Unknown',
      languages:
        languages.length > 0
          ? languages
          : [
              {
                name: repo.language || 'Unknown',
                color: '#ffffff',
                percentage: 100,
              },
            ],
      topics: repo.topics || [],
      techStack: [repo.language, ...(repo.topics || [])].filter(
        Boolean
      ) as string[],
      contributors,
      healthScore,
      complexityScore: this.computeComplexity(repo, languages),
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      isArchived: repo.archived,
      visibility: repo.private ? 'private' : 'public',
    };
  }

  /**
   * Maps an array of GitHub repositories to domain models.
   * Uses concurrent execution with a concurrency limit to avoid rate limits.
   */
  public async mapMany(
    repos: GitHubRepository[]
  ): Promise<RepositoryDomainModel[]> {
    const CONCURRENCY = 5;
    const results: RepositoryDomainModel[] = [];

    for (let i = 0; i < repos.length; i += CONCURRENCY) {
      const batch = repos.slice(i, i + CONCURRENCY);
      const mapped = await Promise.all(
        batch.map((repo) => this.mapToDomain(repo))
      );
      results.push(...mapped);
    }

    return results;
  }

  // ─── Private Helpers ──────────────────────────────────────────────

  private async fetchLanguages(
    owner: string,
    repo: string
  ): Promise<LanguageInfo[]> {
    try {
      const langData = await this.client.getRepositoryLanguages(owner, repo);
      const totalBytes = Object.values(langData).reduce((a, b) => a + b, 0);
      return Object.entries(langData).map(([name, bytes]) => ({
        name,
        color: '#ffffff',
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
      }));
    } catch {
      return [];
    }
  }

  private async fetchContributors(
    owner: string,
    repo: string
  ): Promise<Contributor[]> {
    try {
      const contribs = await this.client.listContributors(owner, repo, 5);
      return contribs.map((c) => ({
        username: c.login,
        avatarUrl: c.avatar_url,
        commits: c.contributions,
      }));
    } catch {
      return [];
    }
  }

  private computeHealthScore(repo: GitHubRepository): HealthScore {
    const daysSinceUpdate = repo.pushed_at
      ? (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 3600 * 24)
      : 365;

    let activity = 0;
    if (daysSinceUpdate < 7) activity = 100;
    else if (daysSinceUpdate < 30) activity = 70;
    else if (daysSinceUpdate < 90) activity = 40;
    else activity = 10;

    const community = Math.min(
      100,
      repo.stargazers_count * 2 + repo.forks_count * 5
    );
    const maintenance = repo.archived ? 10 : repo.has_issues ? 80 : 50;
    const overall = Math.round((activity + community + maintenance) / 3);

    return { overall, activity, community, maintenance };
  }

  private computeComplexity(
    repo: GitHubRepository,
    languages: LanguageInfo[]
  ): number {
    const langComplexity = Math.min(50, languages.length * 10);
    const sizeComplexity = Math.min(50, repo.size / 1000);
    return Math.round(langComplexity + sizeComplexity);
  }
}
