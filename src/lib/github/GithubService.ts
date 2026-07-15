import { Octokit } from '@octokit/rest';
import {
  RepositoryDomainModel,
  LanguageInfo,
  HealthScore,
} from '@/domain/RepositoryModels';

export class GithubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  /**
   * Fetches the current authenticated user's repositories and maps them to our pristine domain models.
   */
  public async fetchUserRepositories(): Promise<RepositoryDomainModel[]> {
    try {
      // 1. Fetch repositories
      const { data: repos } =
        await this.octokit.rest.repos.listForAuthenticatedUser({
          per_page: 100, // Handle pagination for production, capping at 100 for now
          sort: 'updated',
          direction: 'desc',
        });

      // 2. Map to domain models (Promises mapped concurrently)
      const mappedRepos = await Promise.all(
        repos.map(async (repo) =>
          this.mapToDomainModel(repo as unknown as Record<string, unknown>)
        )
      );

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
    // We can fetch extra details like Languages and Commits here if needed.
    // For performance, we will only fetch detailed languages if missing, or mock the complex ones for now.
    // Let's grab languages:
    let languages: LanguageInfo[] = [];
    try {
      const { data: langData } = await this.octokit.rest.repos.listLanguages({
        owner: (repo.owner as Record<string, string>).login,
        repo: repo.name as string,
      });

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
      console.warn(`Failed to fetch languages for ${repo.name}`);
    }

    // Health Score calculation heuristic
    const activityScore = Math.min((repo.size || 1) / 1000, 100);
    const healthScore: HealthScore = {
      overall: Math.min(70 + (repo.stargazers_count > 10 ? 20 : 0), 100),
      activity: activityScore,
      community: repo.has_issues ? 80 : 40,
      maintenance: !repo.archived ? 90 : 20,
    };

    return {
      id: repo.id.toString(),
      owner: repo.owner.login,
      name: repo.name,
      description: repo.description || '',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      issues: repo.open_issues_count || 0,
      commits: repo.size || 0, // Using size as a very loose proxy for commits if we don't want to make N API calls
      pullRequests: 0, // Requires search API
      releases: 0,
      primaryLanguage: repo.language || 'Unknown',
      languages:
        languages.length > 0
          ? languages
          : [
              {
                name: repo.language || 'Unknown',
                color: '#fff',
                percentage: 100,
              },
            ],
      topics: repo.topics || [],
      techStack: [repo.language, ...(repo.topics || [])].filter(
        Boolean
      ) as string[],
      contributors: [], // Requires N API calls, skipping for performance in this iteration
      healthScore,
      complexityScore: 50, // Static for now
      createdAt: repo.created_at || new Date().toISOString(),
      updatedAt: repo.updated_at || new Date().toISOString(),
      isArchived: repo.archived || false,
      visibility: repo.private ? 'private' : 'public',
    };
  }
}
