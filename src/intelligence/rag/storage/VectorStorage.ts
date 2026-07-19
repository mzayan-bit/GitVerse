import { DocumentChunk } from '../chunking/ChunkTypes';
import { EmbeddedChunk } from '../embedding/EmbeddingProvider';

export interface StorageMetadata {
  repositoryId: string;
  path: string;
  language?: string;
  directory: string;
  startLine: number;
  endLine: number;
}

export interface VectorRecord {
  id: string; // chunkId
  vector: number[];
  payload: StorageMetadata & { text: string }; // The actual text for retrieval
}

export interface QueryFilter {
  repositoryId?: string;
  path?: string;
  language?: string;
  directory?: string;
}

export interface VectorStorage {
  /**
   * Initializes or connects to the storage provider.
   */
  connect(): Promise<void>;

  /**
   * Upserts a batch of records.
   */
  upsert(records: VectorRecord[], namespace?: string): Promise<void>;

  /**
   * Queries the vector database for the top-k most similar records.
   */
  query(
    vector: number[],
    topK: number,
    filter?: QueryFilter,
    namespace?: string
  ): Promise<VectorRecord[]>;

  /**
   * Deletes records by filter.
   */
  delete(filter: QueryFilter, namespace?: string): Promise<void>;
}

/**
 * Utility to map chunks to vector records
 */
export function createVectorRecords(
  chunks: DocumentChunk[],
  embeddings: EmbeddedChunk[]
): VectorRecord[] {
  const records: VectorRecord[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = embeddings.find((e) => e.chunkId === chunk.id);
    if (!embedding) continue;

    records.push({
      id: chunk.id,
      vector: embedding.vector,
      payload: {
        repositoryId: chunk.repositoryId,
        path: chunk.path,
        language: chunk.metadata.language,
        directory: chunk.metadata.directory,
        startLine: chunk.metadata.startLine,
        endLine: chunk.metadata.endLine,
        text: chunk.content,
      },
    });
  }
  return records;
}
