import { AnalysisResult } from '../analysis/parsers/AnalysisTypes';
import { RegexParser } from '../analysis/parsers/RegexParser';

export class ParserManager {
  public static route(
    path: string,
    language: string,
    content: string
  ): AnalysisResult | null {
    if (language === 'Unknown' || !content) {
      return null;
    }

    // We use a robust regex parser that works across all requested languages
    return RegexParser.parse(path, language, content);
  }
}
