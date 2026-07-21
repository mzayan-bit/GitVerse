// ============================================================================
// Evolution Engine — Computes repository state at any point in time
// ============================================================================

import type { RepositoryHistory } from '../history/HistoryTypes';
import type {
  EvolutionTimeline,
  TimelineEntry,
  RepositorySnapshot,
} from './EvolutionTypes';
import { SnapshotBuilder } from './SnapshotBuilder';

export class EvolutionEngine {
  /**
   * Build the complete evolution timeline from repository history.
   * Processes commits chronologically, building cumulative snapshots.
   */
  public static buildTimeline(history: RepositoryHistory): EvolutionTimeline {
    const builder = new SnapshotBuilder();

    // Sort commits oldest-first (API returns newest-first)
    const chronological = [...history.commits].reverse();

    // Build tag/release lookup by SHA
    const tagsBySha = new Map<string, string[]>();
    for (const tag of history.tags) {
      const existing = tagsBySha.get(tag.sha) || [];
      existing.push(tag.name);
      tagsBySha.set(tag.sha, existing);
    }

    const releasesBySha = new Map<string, string>();
    for (const release of history.releases) {
      // Find the tag's SHA
      const tag = history.tags.find((t) => t.name === release.tagName);
      if (tag) {
        releasesBySha.set(tag.sha, release.name);
      }
    }

    const entries: TimelineEntry[] = [];
    const growthCurve: Array<{ date: string; files: number; size: number }> =
      [];
    const contributorCurve: Array<{ date: string; count: number }> = [];
    const languageCurveMap: Array<{
      date: string;
      languages: Array<{ name: string; percentage: number }>;
    }> = [];

    for (let i = 0; i < chronological.length; i++) {
      const commit = chronological[i];
      const snapshot = builder.applyCommit(commit);

      const entry: TimelineEntry = {
        index: i,
        commitSha: commit.sha,
        commitMessage: commit.message.split('\n')[0], // First line only
        authorLogin: commit.author.login,
        authorAvatar: commit.author.avatarUrl,
        date: commit.date,
        isMerge: commit.isMerge,

        cumulativeFiles: snapshot.fileCount,
        cumulativeSize: snapshot.totalSize,
        cumulativeCommits: snapshot.totalCommits,
        cumulativeAuthors: snapshot.totalAuthors,

        filesAdded: commit.files
          .filter((f) => f.status === 'added')
          .map((f) => f.path),
        filesRemoved: commit.files
          .filter((f) => f.status === 'deleted')
          .map((f) => f.path),
        filesModified: commit.files
          .filter((f) => f.status === 'modified' || f.status === 'renamed')
          .map((f) => f.path),

        tags: tagsBySha.get(commit.sha) || [],
        releaseName: releasesBySha.get(commit.sha) || null,
      };

      entries.push(entry);

      // Sample curves at intervals to keep data size manageable
      if (i % Math.max(1, Math.floor(chronological.length / 100)) === 0) {
        growthCurve.push({
          date: commit.date,
          files: snapshot.fileCount,
          size: snapshot.totalSize,
        });

        contributorCurve.push({
          date: commit.date,
          count: snapshot.totalAuthors,
        });

        languageCurveMap.push({
          date: commit.date,
          languages: snapshot.languages.slice(0, 5).map((l) => ({
            name: l.name,
            percentage: l.percentage,
          })),
        });
      }
    }

    return {
      repoFullName: history.repoFullName,
      defaultBranch: history.defaultBranch,
      entries,
      startDate: chronological[0]?.date || '',
      endDate: chronological[chronological.length - 1]?.date || '',
      totalCommits: entries.length,
      growthCurve,
      languageCurve: languageCurveMap,
      contributorCurve,
    };
  }

  /**
   * Get the full RepositorySnapshot at a specific timeline index.
   * Replays commits from the beginning up to the index.
   */
  public static getSnapshotAtIndex(
    history: RepositoryHistory,
    index: number
  ): RepositorySnapshot {
    const builder = new SnapshotBuilder();
    const chronological = [...history.commits].reverse();
    const targetIndex = Math.min(index, chronological.length - 1);

    let snapshot: RepositorySnapshot | null = null;
    for (let i = 0; i <= targetIndex; i++) {
      snapshot = builder.applyCommit(chronological[i]);
    }

    return snapshot!;
  }

  /**
   * Get the snapshot at a specific date using binary search.
   */
  public static getSnapshotAtDate(
    timeline: EvolutionTimeline,
    date: Date
  ): { index: number; entry: TimelineEntry } | null {
    const target = date.getTime();
    const entries = timeline.entries;

    if (entries.length === 0) return null;

    let low = 0;
    let high = entries.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midDate = new Date(entries[mid].date).getTime();

      if (midDate === target) {
        return { index: mid, entry: entries[mid] };
      } else if (midDate < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Return the closest entry
    const closestIndex = Math.min(low, entries.length - 1);
    return { index: closestIndex, entry: entries[closestIndex] };
  }

  /**
   * Filter timeline to a specific branch's commits.
   */
  public static getBranchTimeline(
    timeline: EvolutionTimeline,
    _branchName: string
  ): TimelineEntry[] {
    // Since GitHub API commit listing by branch already filters,
    // we return the full timeline for now.
    // A more advanced implementation would trace parent chains.
    return timeline.entries;
  }

  /**
   * Extract the growth curve from the timeline.
   */
  public static getGrowthCurve(
    timeline: EvolutionTimeline
  ): Array<{ date: string; files: number; size: number }> {
    return timeline.growthCurve;
  }

  /**
   * Extract contributor growth from the timeline.
   */
  public static getContributorEvolution(
    timeline: EvolutionTimeline
  ): Array<{ date: string; count: number }> {
    return timeline.contributorCurve;
  }

  /**
   * Extract language evolution from the timeline.
   */
  public static getLanguageEvolution(timeline: EvolutionTimeline): Array<{
    date: string;
    languages: Array<{ name: string; percentage: number }>;
  }> {
    return timeline.languageCurve;
  }
}
