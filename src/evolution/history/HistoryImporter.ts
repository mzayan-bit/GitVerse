// ============================================================================
// History Importer — Orchestrates full repository history import
// ============================================================================

import { HistoryClient } from './HistoryClient';
import { HistoryCache } from './HistoryCache';
import type {
  RepositoryHistory,
  GitCommit,
  GitBranch,
  GitTag,
  GitRelease,
  GitAuthor,
  GitFileChange,
  HistoryImportProgress,
} from './HistoryTypes';

export class HistoryImporter {
  private client: HistoryClient;
  private cache: HistoryCache;

  constructor(accessToken: string) {
    this.client = new HistoryClient(accessToken);
    this.cache = HistoryCache.getInstance();
  }

  /**
   * Import the full history for a repository.
   * Returns cached data if available and not expired.
   */
  public async importHistory(
    owner: string,
    repo: string,
    defaultBranch: string,
    onProgress?: (progress: HistoryImportProgress) => void
  ): Promise<RepositoryHistory> {
    const fullName = `${owner}/${repo}`;

    // Check cache first
    const cached = this.cache.get(fullName);
    if (cached) return cached;

    // Phase 1: Fetch commits (the heaviest call)
    onProgress?.({
      phase: 'commits',
      loaded: 0,
      total: 0,
      message: 'Fetching commit history...',
    });

    const rawCommits = await this.client.listCommits(owner, repo, {
      sha: defaultBranch,
      maxPages: 10, // Up to 1000 commits
    });

    onProgress?.({
      phase: 'commits',
      loaded: rawCommits.length,
      total: rawCommits.length,
      message: `Loaded ${rawCommits.length} commits`,
    });

    // Phase 2: Fetch branches, tags, releases in parallel
    onProgress?.({
      phase: 'branches',
      loaded: 0,
      total: 0,
      message: 'Fetching branches, tags, and releases...',
    });

    const [rawBranches, rawTags, rawReleases] = await Promise.all([
      this.client.listBranches(owner, repo),
      this.client.listTags(owner, repo),
      this.client.listReleases(owner, repo),
    ]);

    onProgress?.({
      phase: 'processing',
      loaded: 0,
      total: rawCommits.length,
      message: 'Processing history data...',
    });

    // Phase 3: Fetch detailed stats for a sample of commits (first 200)
    // to get file change information without hammering the API
    const detailedCommitLimit = Math.min(rawCommits.length, 200);
    const detailedCommits = [];

    for (let i = 0; i < detailedCommitLimit; i++) {
      try {
        const detail = await this.client.getCommitDetails(
          owner,
          repo,
          rawCommits[i].sha
        );
        detailedCommits.push(detail);

        if (i % 20 === 0) {
          onProgress?.({
            phase: 'processing',
            loaded: i,
            total: detailedCommitLimit,
            message: `Processing commit details ${i}/${detailedCommitLimit}...`,
          });
        }
      } catch {
        // If a detail fetch fails, use the lightweight commit
        detailedCommits.push(rawCommits[i]);
      }
    }

    // For remaining commits (beyond 200), use lightweight data
    for (let i = detailedCommitLimit; i < rawCommits.length; i++) {
      detailedCommits.push(rawCommits[i]);
    }

    // Phase 4: Transform into our domain types
    const authorMap = new Map<string, GitAuthor>();
    const commits: GitCommit[] = [];
    const mergeCommits: GitCommit[] = [];

    for (const raw of detailedCommits) {
      const authorLogin = raw.author?.login || 'unknown';
      const authorEmail = raw.commit.author?.email || '';
      const authorAvatar = raw.author?.avatar_url || '';

      // Track authors
      if (!authorMap.has(authorLogin)) {
        authorMap.set(authorLogin, {
          login: authorLogin,
          email: authorEmail,
          avatarUrl: authorAvatar,
          commitCount: 0,
        });
      }
      const author = authorMap.get(authorLogin)!;
      author.commitCount++;

      // Transform file changes
      const files: GitFileChange[] = (raw.files || []).map((f) => ({
        path: f.filename,
        status: HistoryImporter.normalizeStatus(f.status),
        additions: f.additions,
        deletions: f.deletions,
        previousPath: f.previous_filename,
      }));

      const isMerge = raw.parents.length > 1;

      const commit: GitCommit = {
        sha: raw.sha,
        message: raw.commit.message,
        author: { ...author },
        date: raw.commit.author?.date || new Date().toISOString(),
        parents: raw.parents.map((p) => p.sha),
        stats: {
          additions: raw.stats?.additions || 0,
          deletions: raw.stats?.deletions || 0,
          total: raw.stats?.total || 0,
        },
        files,
        isMerge,
      };

      commits.push(commit);
      if (isMerge) mergeCommits.push(commit);
    }

    // Transform branches
    const branches: GitBranch[] = rawBranches.map((b) => ({
      name: b.name,
      sha: b.commit.sha,
      isDefault: b.name === defaultBranch,
      isProtected: b.protected,
    }));

    // Transform tags
    const tags: GitTag[] = rawTags.map((t) => ({
      name: t.name,
      sha: t.commit.sha,
      date: '', // Tags don't have dates in list endpoint
      message: '',
    }));

    // Transform releases
    const releases: GitRelease[] = rawReleases.map((r) => ({
      tagName: r.tag_name,
      name: r.name || r.tag_name,
      date: r.published_at || r.created_at,
      body: r.body || '',
      isDraft: r.draft,
      isPrerelease: r.prerelease,
    }));

    const history: RepositoryHistory = {
      repoFullName: fullName,
      defaultBranch,
      commits,
      branches,
      tags,
      releases,
      authors: Array.from(authorMap.values()),
      mergeCommits,
      importedAt: new Date().toISOString(),
      totalCommitCount: commits.length,
    };

    // Cache the result
    this.cache.store(fullName, history);

    onProgress?.({
      phase: 'processing',
      loaded: commits.length,
      total: commits.length,
      message: 'History import complete!',
    });

    return history;
  }

  private static normalizeStatus(
    status: string
  ): 'added' | 'modified' | 'deleted' | 'renamed' {
    switch (status) {
      case 'added':
        return 'added';
      case 'removed':
      case 'deleted':
        return 'deleted';
      case 'renamed':
        return 'renamed';
      default:
        return 'modified';
    }
  }
}
