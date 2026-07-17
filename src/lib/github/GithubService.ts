import { Octokit } from '@octokit/rest';
import {
  RepositoryDomainModel,
  LanguageInfo,
  HealthScore,
} from '@/domain/RepositoryModels';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class GithubService {
  private octokit: Octokit;
  private static CACHE_TTL = 1000 * 60 * 5; // 5 minutes
  private static repoCache = new Map<
    string,
    CacheEntry<RepositoryDomainModel[]>
  >();

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  /**
   * Helper for exponential backoff on rate limits
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          throw new Error('Offline: Cannot connect to GitHub API');
        }
        return await operation();
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as Record<string, any>;
        if (err.status === 403 || err.status === 429) {
          const resetTime = err.response?.headers?.['x-ratelimit-reset'];
          const waitTime = resetTime
            ? parseInt(resetTime) * 1000 - Date.now()
            : Math.pow(2, retries) * 1000;

          console.warn(`Rate limited. Retrying in ${waitTime}ms...`);
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(waitTime, 5000))
          ); // Cap wait at 5s for UX
          retries++;
        } else {
          throw error;
        }
      }
    }
    throw new Error('Max retries exceeded for GitHub API');
  }

  /**
   * Fetches the current authenticated user's repositories and maps them to our pristine domain models.
   */
  public async fetchUserRepositories(): Promise<RepositoryDomainModel[]> {
    const cacheKey = 'authenticated-user-repos';
    const cached = GithubService.repoCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < GithubService.CACHE_TTL) {
      console.log('Serving repositories from cache');
      return cached.data;
    }

    try {
      const { data: repos } = await this.executeWithRetry(() =>
        this.octokit.rest.repos.listForAuthenticatedUser({
          per_page: 100, // Handle pagination for production, capping at 100 for now
          sort: 'updated',
          direction: 'desc',
        })
      );

      if (!repos || repos.length === 0) {
        console.warn('Empty state: User has no repositories.');
        return [];
      }

      // Map to domain models (Promises mapped concurrently)
      const mappedRepos = await Promise.all(
        repos.map(async (repo) =>
          this.mapToDomainModel(repo as unknown as Record<string, unknown>)
        )
      );

      GithubService.repoCache.set(cacheKey, {
        data: mappedRepos,
        timestamp: Date.now(),
      });
      return mappedRepos;
    } catch (error) {
      console.error('Failed to fetch user repositories:', error);
      throw error;
    }
  }

  /**
   * Transforms raw GitHub repository data into our GitVerse RepositoryDomainModel.
   */
  private async mapToDomainModel(
    repo: Record<string, unknown>
  ): Promise<RepositoryDomainModel> {
    let languages: LanguageInfo[] = [];
    try {
      const { data: langData } = await this.executeWithRetry(
        () =>
          this.octokit.rest.repos.listLanguages({
            owner: (repo.owner as Record<string, string>).login,
            repo: repo.name as string,
          }),
        2
      );

      const totalBytes = Object.values(langData).reduce(
        (a: number, b: number) => a + b,
        0
      );
      languages = Object.entries(langData).map(([name, bytes]) => ({
        name,
        color: '#ffffff', // Handled by mapping engine
        percentage: totalBytes > 0 ? ((bytes as number) / totalBytes) * 100 : 0,
      }));
    } catch {
      console.warn(
        `Failed to fetch languages for ${repo.name}, falling back to defaults.`
      );
    }

    const activityScore = Math.min(((repo.size as number) || 1) / 1000, 100);
    const healthScore: HealthScore = {
      overall: Math.min(
        70 + ((repo.stargazers_count as number) > 10 ? 20 : 0),
        100
      ),
      activity: activityScore,
      community: repo.has_issues ? 80 : 40,
      maintenance: !repo.archived ? 90 : 20,
    };

    return {
      id: (repo.id as number).toString(),
      owner: (repo.owner as Record<string, string>).login,
      name: repo.name as string,
      description: (repo.description as string) || '',
      size: (repo.size as number) || 0,
      stars: (repo.stargazers_count as number) || 0,
      forks: (repo.forks_count as number) || 0,
      issues: (repo.open_issues_count as number) || 0,
      commits: (repo.size as number) || 0,
      pullRequests: 0,
      releases: 0,
      primaryLanguage: (repo.language as string) || 'Unknown',
      languages:
        languages.length > 0
          ? languages
          : [
              {
                name: (repo.language as string) || 'Unknown',
                color: '#fff',
                percentage: 100,
              },
            ],
      topics: (repo.topics as string[]) || [],
      techStack: [repo.language, ...((repo.topics as string[]) || [])].filter(
        Boolean
      ) as string[],
      contributors: [],
      healthScore,
      complexityScore: 50,
      createdAt: (repo.created_at as string) || new Date().toISOString(),
      updatedAt: (repo.updated_at as string) || new Date().toISOString(),
      isArchived: (repo.archived as boolean) || false,
      visibility: repo.private ? 'private' : 'public',
    };
  }
}
