export interface EmbeddedChunk {
  chunkId: string;
  vector: number[];
  dimensions: number;
}

export interface EmbeddingProvider {
  name: string;
  dimensions: number;

  /**
   * Embeds a single string into a vector space.
   */
  embed(text: string): Promise<number[]>;

  /**
   * Embeds a batch of strings. Providers with batch APIs should override this.
   */
  embedBatch(texts: string[]): Promise<number[][]>;
}

export class MockEmbeddingProvider implements EmbeddingProvider {
  name = 'MockLocalProvider';
  dimensions = 1536;

  public async embed(text: string): Promise<number[]> {
    // Generate a pseudo-random deterministic vector for the text
    const vector = new Array(this.dimensions).fill(0).map((_, i) => {
      return Math.sin(text.length * i) / 10;
    });
    return vector;
  }

  public async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }
}
