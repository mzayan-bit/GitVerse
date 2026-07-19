import { SearchDocument, DocumentType } from './DocumentTypes';
import { FileMetadata } from '../../scanner/ScannerTypes';
import { AnalysisResult } from '../../analysis/parsers/AnalysisTypes';
import * as crypto from 'crypto';

export class DocumentBuilder {
  /**
   * Converts raw repository assets into SearchDocuments.
   */
  public static buildFromFile(
    repositoryId: string,
    fileMetadata: FileMetadata,
    content: string,
    analysis?: AnalysisResult,
    commitHash: string = 'latest'
  ): SearchDocument {
    let type: DocumentType = 'code';

    if (fileMetadata.extension.toLowerCase() === '.md') {
      type = fileMetadata.path.toLowerCase().includes('readme')
        ? 'documentation'
        : 'markdown';
    }

    const id = this.generateId(repositoryId, fileMetadata.path, commitHash);

    return {
      id,
      repositoryId,
      path: fileMetadata.path,
      type,
      content,
      version: commitHash,
      metadata: {
        language: fileMetadata.language,
        isDirectory: fileMetadata.isDirectory,
        fileMetadata,
        analysis,
        commitHash,
      },
    };
  }

  public static buildDirectorySummary(
    repositoryId: string,
    dirPath: string,
    summary: string,
    commitHash: string = 'latest'
  ): SearchDocument {
    return {
      id: this.generateId(repositoryId, dirPath, commitHash),
      repositoryId,
      path: dirPath,
      type: 'directory_summary',
      content: summary,
      version: commitHash,
      metadata: {
        isDirectory: true,
        commitHash,
      },
    };
  }

  public static buildCommitMessage(
    repositoryId: string,
    commitHash: string,
    message: string,
    author: string
  ): SearchDocument {
    return {
      id: this.generateId(repositoryId, commitHash, 'commit'),
      repositoryId,
      path: `commit://${commitHash}`,
      type: 'commit_message',
      content: message,
      version: commitHash,
      metadata: {
        commitHash,
        author,
      },
    };
  }

  private static generateId(
    repositoryId: string,
    path: string,
    version: string
  ): string {
    const hash = crypto.createHash('sha256');
    hash.update(`${repositoryId}:${path}:${version}`);
    return hash.digest('hex');
  }
}
