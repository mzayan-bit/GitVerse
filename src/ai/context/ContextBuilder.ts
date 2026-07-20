import {
  EngineeringContext,
  RepositorySnapshot,
  SemanticCitation,
} from './ContextTypes';
import { RetrievalResult } from '../../intelligence/rag/retrieval/RetrievalResult';
import { RetrievalService } from '../../intelligence/rag/retrieval/RetrievalService';

export class ContextBuilder {
  private retrievalService: RetrievalService;

  constructor(retrievalService: RetrievalService) {
    this.retrievalService = retrievalService;
  }

  /**
   * Orchestrates the gathering of all necessary context from various GitVerse engines.
   */
  public async buildContext(
    repositoryId: string,
    userQuery: string
  ): Promise<EngineeringContext> {
    // 1. Fetch Semantic Citations via RAG
    const ragResults = await this.retrievalService.search(userQuery, 5, {
      repositoryId,
    });
    const citations: SemanticCitation[] = ragResults.map(
      (r: RetrievalResult) => ({
        chunkId: r.chunkId,
        path: r.metadata.path,
        snippet: r.content,
        relevanceScore: r.score,
      })
    );

    // 2. Fetch Repository Snapshot (Mocked for integration)
    // In a full implementation, this calls MetricsEngine and Git endpoints
    const snapshot: RepositorySnapshot = {
      repositoryId,
      totalFiles: 120,
      totalLines: 15400,
      primaryLanguages: ['TypeScript', 'Python'],
      recentCommits: [
        {
          hash: 'a1b2c3d',
          message: 'Update Auth',
          author: 'zayan',
          date: new Date().toISOString(),
        },
      ],
    };

    return {
      snapshot,
      citations,
      directoryStructure: this.mockDirectoryTree(),
      dependencyGraphContext: this.mockDependencyGraph(),
    };
  }

  private mockDirectoryTree() {
    return `
src/
  auth/
  components/
  intelligence/
    rag/
  systems/
    `;
  }

  private mockDependencyGraph() {
    return `Dependency Graph: src/components/dashboard -> src/intelligence/rag`;
  }
}
