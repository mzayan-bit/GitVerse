import { FileMetadata } from './ScannerTypes';
import { LanguageRegistry } from './LanguageRegistry';

/**
 * Worker-like abstraction for processing file metadata.
 * In a real WebWorker environment, this would receive messages.
 */
export class ScannerWorker {
  public static async processBatch(
    files: { path: string; size: number }[]
  ): Promise<FileMetadata[]> {
    const CHUNK_SIZE = 50;
    const results: FileMetadata[] = [];

    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
      const chunk = files.slice(i, i + CHUNK_SIZE);
      const chunkResults = await Promise.all(
        chunk.map((file) =>
          Promise.resolve(this.processFile(file.path, file.size))
        )
      );
      results.push(...chunkResults);
    }

    return results;
  }

  public static processFile(path: string, sizeBytes: number): FileMetadata {
    const filename = path.split('/').pop() || path;
    const extensionIndex = filename.lastIndexOf('.');
    const extension =
      extensionIndex > 0 ? filename.substring(extensionIndex) : '';

    return {
      path,
      extension,
      sizeBytes,
      type: LanguageRegistry.getFileType(filename, extension),
      language: LanguageRegistry.getLanguage(filename, extension),
      isBinary: LanguageRegistry.isBinary(extension),
      isDirectory: false,
    };
  }
}
