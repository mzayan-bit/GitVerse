import { EngineeringContext } from './ContextTypes';

export class ContextCompressor {
  /**
   * Compresses the context to fit within a given token budget.
   * Prioritizes highest-scoring citations first.
   */
  public static compress(
    context: EngineeringContext,
    maxTokens: number
  ): string {
    let output = '';
    let currentTokens = 0;

    // 1. Always include basic repo snapshot (high priority, low token cost)
    const snapshotStr = `Repository: ${context.snapshot.repositoryId}\nFiles: ${context.snapshot.totalFiles}\nLines: ${context.snapshot.totalLines}\nLanguages: ${context.snapshot.primaryLanguages.join(', ')}\n\n`;
    output += snapshotStr;
    currentTokens += this.estimateTokens(snapshotStr);

    // 2. Add highest relevance citations until budget is near capacity
    if (context.citations.length > 0) {
      output += `### Relevant Code Snippets:\n`;
      // Sort descending by score
      const sorted = [...context.citations].sort(
        (a, b) => b.relevanceScore - a.relevanceScore
      );

      for (const citation of sorted) {
        const citationStr = `File: ${citation.path}\n\`\`\`\n${citation.snippet}\n\`\`\`\n\n`;
        const tokens = this.estimateTokens(citationStr);

        if (currentTokens + tokens < maxTokens - 200) {
          // Keep 200 buffer for graph/dirs
          output += citationStr;
          currentTokens += tokens;
        } else {
          break;
        }
      }
    }

    // 3. Add graph/dir info if room permits
    if (context.directoryStructure && currentTokens < maxTokens - 100) {
      output += `### Directory Structure:\n${context.directoryStructure}\n`;
    }

    return output;
  }

  private static estimateTokens(text: string): number {
    // Rough estimation: 4 chars ~= 1 token
    return Math.ceil(text.length / 4);
  }
}
