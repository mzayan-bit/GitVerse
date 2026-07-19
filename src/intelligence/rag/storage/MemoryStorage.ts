import { VectorStorage, VectorRecord, QueryFilter } from './VectorStorage';

export class MemoryStorage implements VectorStorage {
  private records: VectorRecord[] = [];

  public async connect(): Promise<void> {
    // In-memory doesn't require connection
    return Promise.resolve();
  }

  public async upsert(
    records: VectorRecord[],
    namespace?: string
  ): Promise<void> {
    void namespace;
    // Basic upsert by ID
    for (const record of records) {
      const idx = this.records.findIndex((r) => r.id === record.id);
      if (idx >= 0) {
        this.records[idx] = record;
      } else {
        this.records.push(record);
      }
    }
    return Promise.resolve();
  }

  public async query(
    vector: number[],
    topK: number,
    filter?: QueryFilter,
    namespace?: string
  ): Promise<VectorRecord[]> {
    void namespace;
    // Filter records
    let filtered = this.records;
    if (filter) {
      filtered = filtered.filter((r) => {
        if (
          filter.repositoryId &&
          r.payload.repositoryId !== filter.repositoryId
        )
          return false;
        if (filter.path && r.payload.path !== filter.path) return false;
        if (filter.language && r.payload.language !== filter.language)
          return false;
        if (
          filter.directory &&
          !r.payload.directory.startsWith(filter.directory)
        )
          return false;
        return true;
      });
    }

    // Compute cosine similarity
    const scored = filtered.map((r) => ({
      record: r,
      score: this.cosineSimilarity(vector, r.vector),
    }));

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);

    // Return top-k
    return scored.slice(0, topK).map((s) => s.record);
  }

  public async delete(filter: QueryFilter, namespace?: string): Promise<void> {
    void namespace;
    this.records = this.records.filter((r) => {
      let matches = true;
      if (filter.repositoryId && r.payload.repositoryId !== filter.repositoryId)
        matches = false;
      if (filter.path && r.payload.path !== filter.path) matches = false;
      if (filter.language && r.payload.language !== filter.language)
        matches = false;
      if (filter.directory && !r.payload.directory.startsWith(filter.directory))
        matches = false;

      // Keep if it DOES NOT match the filter
      return !matches;
    });
    return Promise.resolve();
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
