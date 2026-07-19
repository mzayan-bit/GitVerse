import { SearchDocument } from '../builder/DocumentTypes';
import { DocumentChunk, ChunkingConfig } from './ChunkTypes';

export class CodeChunker {
  /**
   * Basic sliding window code chunker that attempts to respect line breaks.
   */
  public static chunk(
    doc: SearchDocument,
    config: ChunkingConfig
  ): DocumentChunk[] {
    const lines = doc.content.split('\n');
    const chunks: DocumentChunk[] = [];

    // Rough estimation: 1 token ~= 4 chars of code
    const avgCharsPerToken = 4;
    const maxChars = config.maxTokens * avgCharsPerToken;
    const overlapChars = config.overlapTokens * avgCharsPerToken;

    let currentStartLine = 0;
    let currentChars = 0;
    let chunkIndex = 0;

    let chunkContent = '';
    const dir = doc.path.substring(0, doc.path.lastIndexOf('/')) || '/';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // If adding this line exceeds max characters, push the chunk and slide the window
      if (currentChars + line.length > maxChars && chunkContent.length > 0) {
        chunks.push(
          this.createChunk(
            doc,
            chunkIndex++,
            chunkContent,
            currentStartLine,
            i - 1,
            dir
          )
        );

        // Slide the window back for overlap
        // A smarter chunker would track AST nodes and avoid splitting functions
        // For this milestone, we use a simple text overlap mechanism
        const currentLines = chunkContent.split('\n');
        let overlapBuffer = '';
        let overlapStartLine = i;

        for (let j = currentLines.length - 1; j >= 0; j--) {
          if (overlapBuffer.length + currentLines[j].length > overlapChars)
            break;
          overlapBuffer = currentLines[j] + '\n' + overlapBuffer;
          overlapStartLine = currentStartLine + j;
        }

        chunkContent = overlapBuffer + line + '\n';
        currentChars = chunkContent.length;
        currentStartLine = overlapStartLine;
      } else {
        chunkContent += line + '\n';
        currentChars += line.length + 1;
      }
    }

    // Push remainder
    if (chunkContent.trim().length > 0) {
      chunks.push(
        this.createChunk(
          doc,
          chunkIndex,
          chunkContent,
          currentStartLine,
          lines.length - 1,
          dir
        )
      );
    }

    return chunks;
  }

  private static createChunk(
    doc: SearchDocument,
    chunkIndex: number,
    content: string,
    startLine: number,
    endLine: number,
    directory: string
  ): DocumentChunk {
    // Collect relationships from document metadata if available
    const rels: string[] = [];
    if (doc.metadata.analysis) {
      doc.metadata.analysis.imports.forEach((i) => rels.push(`imports:${i}`));
      doc.metadata.analysis.exports.forEach((e) => rels.push(`exports:${e}`));
    }

    return {
      id: `${doc.id}#${chunkIndex}`,
      documentId: doc.id,
      repositoryId: doc.repositoryId,
      path: doc.path,
      content,
      metadata: {
        language: doc.metadata.language,
        directory,
        startLine,
        endLine,
        tokensEstimate: Math.ceil(content.length / 4),
        chunkIndex,
        relationships: rels,
      },
    };
  }
}
