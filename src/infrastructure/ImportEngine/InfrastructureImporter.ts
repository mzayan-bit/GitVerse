import {
  IInfrastructureParser,
  InfrastructureState,
} from './IInfrastructureParser';
import { KubernetesParser } from './Parsers/KubernetesParser';
import { DockerComposeParser } from './Parsers/DockerComposeParser';
import { TerraformParser } from './Parsers/TerraformParser';
import { CIParser } from './Parsers/CIParser';

export class InfrastructureImporter {
  private parsers: IInfrastructureParser[] = [
    new KubernetesParser(),
    new DockerComposeParser(),
    new TerraformParser(),
    new CIParser(),
  ];

  private cache = new Map<string, InfrastructureState>();

  public async importFile(
    fileContent: string,
    fileName: string
  ): Promise<InfrastructureState> {
    const cacheKey = `${fileName}-${this.hash(fileContent)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const parser = this.parsers.find((p) => p.supports(fileContent, fileName));
    if (!parser) {
      throw new Error('No compatible parser found for ' + fileName);
    }

    // Versioning and normalization happen here
    const parsed = await parser.parse(fileContent, fileName);

    const state: InfrastructureState = {
      version: '1.0',
      providers: parsed.providers || [],
      clusters: parsed.clusters || [],
      services: parsed.services || [],
      databases: parsed.databases || [],
      timestamp: parsed.timestamp || Date.now(),
    };

    this.cache.set(cacheKey, state);
    return state;
  }

  private hash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = (hash << 5) - hash + content.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString();
  }
}
