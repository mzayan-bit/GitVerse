/**
 * ImportEngine — Orchestrates the full import pipeline.
 *
 * Pipeline: GitHub API → DTO → Domain Model → Validation → Normalization → Cache → Entity Preparation
 *
 * Supports:
 * - Importing all user repositories
 * - Importing a single organization's repositories
 * - Importing a single repository
 */

import { GitHubClient } from '../client';
import { RepositoryMapper } from './RepositoryMapper';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { GitHubOrganization } from '../types';

export type ImportMode = 'user' | 'organization' | 'single';

export interface ImportProgress {
  mode: ImportMode;
  total: number;
  processed: number;
  status: 'idle' | 'fetching' | 'mapping' | 'validating' | 'complete' | 'error';
  error?: string;
}

export interface ImportResult {
  repositories: RepositoryDomainModel[];
  progress: ImportProgress;
  duration: number;
}

export class ImportEngine {
  private client: GitHubClient;
  private mapper: RepositoryMapper;

  constructor(accessToken: string) {
    this.client = new GitHubClient(accessToken);
    this.mapper = new RepositoryMapper(this.client);
  }

  public getClient(): GitHubClient {
    return this.client;
  }

  /**
   * Import all repositories for the authenticated user.
   */
  public async importUserRepositories(
    onProgress?: (p: ImportProgress) => void
  ): Promise<ImportResult> {
    const start = Date.now();
    const progress: ImportProgress = {
      mode: 'user',
      total: 0,
      processed: 0,
      status: 'fetching',
    };
    onProgress?.(progress);

    try {
      const rawRepos = await this.client.listUserRepositories();
      progress.total = rawRepos.length;
      progress.status = 'mapping';
      onProgress?.(progress);

      const domainModels = await this.mapper.mapMany(rawRepos);

      progress.processed = domainModels.length;
      progress.status = 'validating';
      onProgress?.(progress);

      const validated = this.validate(domainModels);

      progress.status = 'complete';
      onProgress?.(progress);

      return {
        repositories: validated,
        progress,
        duration: Date.now() - start,
      };
    } catch (error) {
      progress.status = 'error';
      progress.error =
        error instanceof Error ? error.message : 'Unknown import error';
      onProgress?.(progress);
      return { repositories: [], progress, duration: Date.now() - start };
    }
  }

  /**
   * Import all repositories for a specific organization.
   */
  public async importOrgRepositories(
    org: string,
    onProgress?: (p: ImportProgress) => void
  ): Promise<ImportResult> {
    const start = Date.now();
    const progress: ImportProgress = {
      mode: 'organization',
      total: 0,
      processed: 0,
      status: 'fetching',
    };
    onProgress?.(progress);

    try {
      const rawRepos = await this.client.listOrgRepositories(org);
      progress.total = rawRepos.length;
      progress.status = 'mapping';
      onProgress?.(progress);

      const domainModels = await this.mapper.mapMany(rawRepos);

      progress.processed = domainModels.length;
      progress.status = 'validating';
      onProgress?.(progress);

      const validated = this.validate(domainModels);

      progress.status = 'complete';
      onProgress?.(progress);

      return {
        repositories: validated,
        progress,
        duration: Date.now() - start,
      };
    } catch (error) {
      progress.status = 'error';
      progress.error =
        error instanceof Error ? error.message : 'Unknown import error';
      onProgress?.(progress);
      return { repositories: [], progress, duration: Date.now() - start };
    }
  }

  /**
   * Import a single repository.
   */
  public async importSingleRepository(
    owner: string,
    repo: string
  ): Promise<ImportResult> {
    const start = Date.now();
    try {
      const rawRepo = await this.client.getRepository(owner, repo);
      const domainModel = await this.mapper.mapMany([rawRepo]);
      const validated = this.validate(domainModel);
      return {
        repositories: validated,
        progress: {
          mode: 'single',
          total: 1,
          processed: 1,
          status: 'complete',
        },
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        repositories: [],
        progress: {
          mode: 'single',
          total: 1,
          processed: 0,
          status: 'error',
          error:
            error instanceof Error ? error.message : 'Unknown import error',
        },
        duration: Date.now() - start,
      };
    }
  }

  /**
   * Fetch organizations for the current user.
   */
  public async fetchOrganizations(): Promise<GitHubOrganization[]> {
    return this.client.listOrganizations();
  }

  // ─── Validation ───────────────────────────────────────────────────

  private validate(models: RepositoryDomainModel[]): RepositoryDomainModel[] {
    return models.filter((m) => {
      if (!m.id || !m.name || !m.owner) return false;
      return true;
    });
  }
}
