import { SearchDocument } from '../builder/DocumentTypes';
import { ChunkingEngine } from '../chunking/ChunkingEngine';
import { EmbeddingPipeline } from '../embedding/EmbeddingPipeline';
import { VectorStorage, createVectorRecords } from '../storage/VectorStorage';

export interface IndexingJob {
  repositoryId: string;
  documents: SearchDocument[];
  checkpointIndex?: number;
}

export class IndexingQueueManager {
  private queue: IndexingJob[] = [];
  private isProcessing = false;

  private chunker: ChunkingEngine;
  private embedder: EmbeddingPipeline;
  private storage: VectorStorage;

  constructor(
    chunker: ChunkingEngine,
    embedder: EmbeddingPipeline,
    storage: VectorStorage
  ) {
    this.chunker = chunker;
    this.embedder = embedder;
    this.storage = storage;
  }

  public enqueue(job: IndexingJob) {
    this.queue.push({
      ...job,
      checkpointIndex: job.checkpointIndex || 0,
    });
    this.processNext();
  }

  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const job = this.queue.shift()!;
    try {
      // Incremental checkpoint processing
      const batchSize = 100; // documents per batch
      for (
        let i = job.checkpointIndex!;
        i < job.documents.length;
        i += batchSize
      ) {
        const batch = job.documents.slice(i, i + batchSize);

        // 1. Chunk
        const chunks = this.chunker.chunk(batch);

        // 2. Embed (Parallelized within provider constraints)
        const embeddings = await this.embedder.processBatch(chunks);

        // 3. Store
        const records = createVectorRecords(chunks, embeddings);
        await this.storage.upsert(records);

        // Update checkpoint
        job.checkpointIndex = i + batchSize;

        // Observability hook
        // console.log(`Indexed ${Math.min(job.checkpointIndex, job.documents.length)} / ${job.documents.length} docs`);
      }
    } catch (error) {
      console.error(
        `Indexing failed for repository ${job.repositoryId}`,
        error
      );
      // Re-queue with checkpoint on failure
      this.queue.unshift(job);
    } finally {
      this.isProcessing = false;
      // Yield to event loop, then continue
      setTimeout(() => this.processNext(), 0);
    }
  }
}
