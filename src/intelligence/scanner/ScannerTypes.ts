export type FileType =
  'source' | 'binary' | 'config' | 'documentation' | 'unknown';

export interface FileMetadata {
  path: string;
  extension: string;
  sizeBytes: number;
  type: FileType;
  language: string;
  isBinary: boolean;
  isDirectory: boolean;
}

export interface ScannerConfig {
  rootDir: string;
  ignorePatterns: string[];
  maxDepth?: number;
  maxFileSize?: number;
}

export interface ScannerResult {
  totalFiles: number;
  totalDirectories: number;
  totalSize: number;
  files: Record<string, FileMetadata>;
  directories: string[];
  skippedFiles: string[];
  durationMs: number;
}
