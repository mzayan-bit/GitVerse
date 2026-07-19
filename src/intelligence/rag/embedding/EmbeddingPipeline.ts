import { DocumentChunk } from '../chunking/ChunkTypes';
import { EmbeddedChunk, EmbeddingProvider } from './EmbeddingProvider';

export class EmbeddingPipeline {
  private provider: EmbeddingProvider;
  private cache: Map<string, number[]> = new Map();

  constructor(provider: EmbeddingProvider) {
    this.provider = provider;
  }

  public async processBatch(chunks: DocumentChunk[]): Promise<EmbeddedChunk[]> {
    const results: EmbeddedChunk[] = [];
    const toEmbed: DocumentChunk[] = [];
    const texts: string[] = [];

    // 1. Check cache first
    for (const chunk of chunks) {
      const cacheKey = this.generateHash(chunk.content);
      const cached = this.cache.get(cacheKey);

      if (cached) {
        results.push({
          chunkId: chunk.id,
          vector: cached,
          dimensions: this.provider.dimensions,
        });
      } else {
        toEmbed.push(chunk);
        texts.push(chunk.content);
      }
    }

    // 2. Batch embed missing chunks
    if (texts.length > 0) {
      try {
        const vectors = await this.provider.embedBatch(texts);
        for (let i = 0; i < toEmbed.length; i++) {
          const chunk = toEmbed[i];
          const vector = vectors[i];

          this.cache.set(this.generateHash(chunk.content), vector);

          results.push({
            chunkId: chunk.id,
            vector,
            dimensions: this.provider.dimensions,
          });
        }
      } catch (error) {
        console.error('Embedding failed', error);
        // Implement retry logic here
        throw error;
      }
    }

    return results;
  }

  private generateHash(content: string): string {
    // Simple hash for caching purposes
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
}
