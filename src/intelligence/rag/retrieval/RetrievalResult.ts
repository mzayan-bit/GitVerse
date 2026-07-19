import { StorageMetadata } from '../storage/VectorStorage';

export interface RetrievalResult {
  chunkId: string;
  score: number;
  content: string;
  metadata: StorageMetadata;
}
