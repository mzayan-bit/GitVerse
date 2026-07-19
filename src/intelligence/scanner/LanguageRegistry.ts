import { FileType } from './ScannerTypes';

export class LanguageRegistry {
  private static languageMap: Record<string, string> = {
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript',
    '.py': 'Python',
    '.go': 'Go',
    '.rs': 'Rust',
    '.java': 'Java',
    '.cs': 'C#',
    '.cpp': 'C++',
    '.hpp': 'C++',
    '.c': 'C',
    '.h': 'C',
    '.md': 'Markdown',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.json': 'JSON',
  };

  private static binaryExtensions = new Set([
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.ico',
    '.pdf',
    '.zip',
    '.tar',
    '.gz',
    '.mp3',
    '.mp4',
    '.mov',
    '.exe',
    '.dll',
    '.so',
    '.dylib',
    '.wasm',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.class',
    '.jar',
  ]);

  private static configFiles = new Set([
    'package.json',
    'tsconfig.json',
    'Dockerfile',
    'docker-compose.yml',
    'Makefile',
    '.gitignore',
    '.eslintrc',
    '.prettierrc',
  ]);

  public static getLanguage(filename: string, extension: string): string {
    if (filename === 'Dockerfile') return 'Dockerfile';
    if (filename === 'Makefile') return 'Makefile';
    return this.languageMap[extension.toLowerCase()] || 'Unknown';
  }

  public static isBinary(extension: string): boolean {
    return this.binaryExtensions.has(extension.toLowerCase());
  }

  public static getFileType(filename: string, extension: string): FileType {
    if (this.isBinary(extension)) return 'binary';
    if (this.configFiles.has(filename)) return 'config';
    if (extension.toLowerCase() === '.md' || extension.toLowerCase() === '.txt')
      return 'documentation';
    if (this.getLanguage(filename, extension) !== 'Unknown') return 'source';
    return 'unknown';
  }
}
