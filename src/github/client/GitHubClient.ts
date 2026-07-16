/**
 * GitHubClient — Production-grade GitHub API client.
 *
 * Features:
 * - Full Octokit wrapper with strong typing
 * - Automatic pagination for all list endpoints
 * - Exponential backoff retry with rate-limit awareness
 * - Request abstraction (every call goes through executeWithRetry)
 * - Caching hooks (external caching layer wraps this)
 */

import { Octokit } from '@octokit/rest';
import {
  GitHubUser,
  GitHubOrganization,
  GitHubRepository,
  GitHubLanguages,
  GitHubContributor,
  GitHubRateLimitResponse,
} from '../types';

export interface ClientMetrics {
  totalRequests: number;
  failedRequests: number;
  rateLimitHits: number;
  lastRequestAt: number | null;
}

export class GitHubClient {
  private octokit: Octokit;
  private metrics: ClientMetrics = {
    totalRequests: 0,
    failedRequests: 0,
    rateLimitHits: 0,
    lastRequestAt: null,
  };

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  public getMetrics(): ClientMetrics {
    return { ...this.metrics };
  }

  // ─── Request Infrastructure ───────────────────────────────────────

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        this.metrics.totalRequests++;
        this.metrics.lastRequestAt = Date.now();
        return await operation();
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as Record<string, any>;
        if (err.status === 403 || err.status === 429) {
          this.metrics.rateLimitHits++;
          const resetTime = err.response?.headers?.['x-ratelimit-reset'];
          const waitTime = resetTime
            ? parseInt(resetTime) * 1000 - Date.now()
            : Math.pow(2, retries) * 1000;

          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(Math.max(waitTime, 500), 10000))
          );
          retries++;
        } else {
          this.metrics.failedRequests++;
          throw error;
        }
      }
    }
    this.metrics.failedRequests++;
    throw new Error('Max retries exceeded for GitHub API');
  }

  // ─── User ─────────────────────────────────────────────────────────

  public async getCurrentUser(): Promise<GitHubUser> {
    const { data } = await this.executeWithRetry(() =>
      this.octokit.rest.users.getAuthenticated()
    );
    return data as unknown as GitHubUser;
  }

  // ─── Organizations ────────────────────────────────────────────────

  public async listOrganizations(): Promise<GitHubOrganization[]> {
    const orgs = await this.executeWithRetry(() =>
      this.octokit.paginate(this.octokit.rest.orgs.listForAuthenticatedUser, {
        per_page: 100,
      })
    );
    return orgs as unknown as GitHubOrganization[];
  }

  // ─── Repositories ─────────────────────────────────────────────────

  public async listUserRepositories(): Promise<GitHubRepository[]> {
    const repos = await this.executeWithRetry(() =>
      this.octokit.paginate(this.octokit.rest.repos.listForAuthenticatedUser, {
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
      })
    );
    return repos as unknown as GitHubRepository[];
  }

  public async listOrgRepositories(org: string): Promise<GitHubRepository[]> {
    const repos = await this.executeWithRetry(() =>
      this.octokit.paginate(this.octokit.rest.repos.listForOrg, {
        org,
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
      })
    );
    return repos as unknown as GitHubRepository[];
  }

  public async getRepository(
    owner: string,
    repo: string
  ): Promise<GitHubRepository> {
    const { data } = await this.executeWithRetry(() =>
      this.octokit.rest.repos.get({ owner, repo })
    );
    return data as unknown as GitHubRepository;
  }

  // ─── Languages ────────────────────────────────────────────────────

  public async getRepositoryLanguages(
    owner: string,
    repo: string
  ): Promise<GitHubLanguages> {
    const { data } = await this.executeWithRetry(
      () => this.octokit.rest.repos.listLanguages({ owner, repo }),
      2
    );
    return data as GitHubLanguages;
  }

  // ─── Contributors ─────────────────────────────────────────────────

  public async listContributors(
    owner: string,
    repo: string,
    limit = 10
  ): Promise<GitHubContributor[]> {
    const { data } = await this.executeWithRetry(
      () =>
        this.octokit.rest.repos.listContributors({
          owner,
          repo,
          per_page: limit,
        }),
      2
    );
    return (data || []) as unknown as GitHubContributor[];
  }

  // ─── Rate Limit ───────────────────────────────────────────────────

  public async getRateLimit(): Promise<GitHubRateLimitResponse> {
    const { data } = await this.executeWithRetry(() =>
      this.octokit.rest.rateLimit.get()
    );
    return data as unknown as GitHubRateLimitResponse;
  }
}
