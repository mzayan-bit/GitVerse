// ============================================================================
// History Client — Git history endpoints via Octokit
// ============================================================================
// Composition-based: accepts a GitHubClient-compatible Octokit instance.
// All calls reuse the existing retry/rate-limit infrastructure.
// ============================================================================

import { Octokit } from '@octokit/rest';

/** Raw commit from GitHub API (subset we care about) */
interface RawGitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    } | null;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  parents: Array<{ sha: string }>;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    previous_filename?: string;
  }>;
}

interface RawGitHubBranch {
  name: string;
  commit: { sha: string };
  protected: boolean;
}

interface RawGitHubTag {
  name: string;
  commit: { sha: string };
}

interface RawGitHubRelease {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  created_at: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
}

export class HistoryClient {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  // ─── Commits ────────────────────────────────────────────────────────

  /**
   * Fetch commit list (paginated, up to maxPages).
   * Returns lightweight commit objects without file diffs.
   */
  public async listCommits(
    owner: string,
    repo: string,
    options?: {
      sha?: string;
      since?: string;
      until?: string;
      perPage?: number;
      maxPages?: number;
    }
  ): Promise<RawGitHubCommit[]> {
    const perPage = options?.perPage ?? 100;
    const maxPages = options?.maxPages ?? 10;
    const allCommits: RawGitHubCommit[] = [];

    for (let page = 1; page <= maxPages; page++) {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        sha: options?.sha,
        since: options?.since,
        until: options?.until,
        per_page: perPage,
        page,
      });

      allCommits.push(...(data as unknown as RawGitHubCommit[]));

      if (data.length < perPage) break; // No more pages
    }

    return allCommits;
  }

  /**
   * Fetch a single commit with full file diff stats.
   */
  public async getCommitDetails(
    owner: string,
    repo: string,
    sha: string
  ): Promise<RawGitHubCommit> {
    const { data } = await this.octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: sha,
    });
    return data as unknown as RawGitHubCommit;
  }

  // ─── Branches ───────────────────────────────────────────────────────

  public async listBranches(
    owner: string,
    repo: string
  ): Promise<RawGitHubBranch[]> {
    const data = await this.octokit.paginate(
      this.octokit.rest.repos.listBranches,
      { owner, repo, per_page: 100 }
    );
    return data as unknown as RawGitHubBranch[];
  }

  // ─── Tags ───────────────────────────────────────────────────────────

  public async listTags(owner: string, repo: string): Promise<RawGitHubTag[]> {
    const data = await this.octokit.paginate(this.octokit.rest.repos.listTags, {
      owner,
      repo,
      per_page: 100,
    });
    return data as unknown as RawGitHubTag[];
  }

  // ─── Releases ───────────────────────────────────────────────────────

  public async listReleases(
    owner: string,
    repo: string
  ): Promise<RawGitHubRelease[]> {
    const data = await this.octokit.paginate(
      this.octokit.rest.repos.listReleases,
      { owner, repo, per_page: 100 }
    );
    return data as unknown as RawGitHubRelease[];
  }
}
