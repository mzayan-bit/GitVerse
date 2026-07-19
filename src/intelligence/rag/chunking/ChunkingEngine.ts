import { SearchDocument } from '../builder/DocumentTypes';
import { DocumentChunk, ChunkingConfig } from './ChunkTypes';
import { CodeChunker } from './CodeChunker';

export class ChunkingEngine {
  private config: ChunkingConfig;

  constructor(config?: Partial<ChunkingConfig>) {
    this.config = {
      maxTokens: 512,
      overlapTokens: 50,
      ...config,
    };
  }

  public chunk(documents: SearchDocument[]): DocumentChunk[] {
    const allChunks: DocumentChunk[] = [];

    for (const doc of documents) {
      if (doc.type === 'directory_summary' || doc.type === 'commit_message') {
        // These are typically short enough to be single chunks
        allChunks.push({
          id: `${doc.id}#0`,
          documentId: doc.id,
          repositoryId: doc.repositoryId,
          path: doc.path,
          content: doc.content,
          metadata: {
            language: doc.metadata.language || 'text',
            directory: doc.path,
            startLine: 0,
            endLine: doc.content.split('\n').length,
            tokensEstimate: Math.ceil(doc.content.length / 4),
            chunkIndex: 0,
            relationships: [],
          },
        });
      } else {
        // Use the code chunker for code and markdown for now
        allChunks.push(...CodeChunker.chunk(doc, this.config));
      }
    }

    return allChunks;
  }
}
