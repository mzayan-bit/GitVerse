export interface DocumentChunk {
  id: string; // Document ID + chunk index
  documentId: string;
  repositoryId: string;
  path: string;

  content: string; // The text content to embed

  // Metadata for precision filtering
  metadata: {
    language?: string;
    directory: string;
    startLine: number;
    endLine: number;
    tokensEstimate: number;
    chunkIndex: number;
    relationships: string[]; // e.g., 'imports:react', 'exports:GraphNode'
  };
}

export interface ChunkingConfig {
  maxTokens: number;
  overlapTokens: number;
}
