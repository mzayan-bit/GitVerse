import { AnalysisResult } from './AnalysisTypes';

export class RegexParser {
  public static parse(
    path: string,
    language: string,
    content: string
  ): AnalysisResult {
    const lines = content.split('\n');
    const loc = lines.length;
    let emptyLines = 0;
    let commentLines = 0;

    const imports: string[] = [];
    const exports: string[] = [];
    const classes: string[] = [];
    const functions: string[] = [];
    const interfaces: string[] = [];
    const enums: string[] = [];
    const modules: string[] = [];

    // Basic regex patterns
    const importRegex =
      /^(?:import|from|#include|use|require)\s+['"<]?([a-zA-Z0-9_./-]+)['">]?/m;
    const exportRegex =
      /^(?:export|module\.exports|exports\.)\s+(?:(?:default\s+)?(?:class|function|const|let|var|interface|enum)\s+)?([a-zA-Z0-9_]+)/m;
    const classRegex = /(?:class|struct)\s+([a-zA-Z0-9_]+)/;
    const functionRegex = /(?:function|def|func|fn)\s+([a-zA-Z0-9_]+)/;
    const interfaceRegex = /interface\s+([a-zA-Z0-9_]+)/;
    const enumRegex = /enum\s+([a-zA-Z0-9_]+)/;
    const moduleRegex = /(?:module|namespace|package)\s+([a-zA-Z0-9_.]+)/;

    for (let line of lines) {
      line = line.trim();
      if (!line) {
        emptyLines++;
        continue;
      }
      if (
        line.startsWith('//') ||
        line.startsWith('#') ||
        line.startsWith('/*') ||
        line.startsWith('*')
      ) {
        commentLines++;
        continue;
      }

      // Very rudimentary extraction
      let match = line.match(importRegex);
      if (match && match[1]) imports.push(match[1]);

      match = line.match(exportRegex);
      if (match && match[1]) exports.push(match[1]);

      match = line.match(classRegex);
      if (match && match[1]) classes.push(match[1]);

      match = line.match(functionRegex);
      if (match && match[1]) functions.push(match[1]);

      match = line.match(interfaceRegex);
      if (match && match[1]) interfaces.push(match[1]);

      match = line.match(enumRegex);
      if (match && match[1]) enums.push(match[1]);

      match = line.match(moduleRegex);
      if (match && match[1]) modules.push(match[1]);
    }

    return {
      path,
      language,
      loc,
      emptyLines,
      commentLines,
      codeLines: loc - emptyLines - commentLines,
      imports: Array.from(new Set(imports)),
      exports: Array.from(new Set(exports)),
      classes: Array.from(new Set(classes)),
      functions: Array.from(new Set(functions)),
      interfaces: Array.from(new Set(interfaces)),
      enums: Array.from(new Set(enums)),
      modules: Array.from(new Set(modules)),
    };
  }
}
