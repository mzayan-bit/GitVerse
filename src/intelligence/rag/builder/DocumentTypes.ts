import { FileMetadata } from '../../scanner/ScannerTypes';
import { AnalysisResult } from '../../analysis/parsers/AnalysisTypes';

export type DocumentType =
  | 'code'
  | 'markdown'
  | 'documentation'
  | 'comment'
  | 'directory_summary'
  | 'commit_message';

export interface SearchDocument {
  id: string; // Typically repositoryId + path + version
  repositoryId: string;
  path: string;
  type: DocumentType;
  content: string;
  version: string;

  // Strongly typed metadata
  metadata: {
    language?: string;
    isDirectory?: boolean;
    fileMetadata?: FileMetadata;
    analysis?: AnalysisResult;
    commitHash?: string;
    author?: string;
  };
}
