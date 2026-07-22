import {
  IInfrastructureParser,
  InfrastructureState,
} from '../IInfrastructureParser';

export class KubernetesParser implements IInfrastructureParser {
  name = 'kubernetes';

  supports(_fileContent: string, _fileName: string): boolean {
    return (
      _fileName.endsWith('.yaml') &&
      _fileContent.includes('apiVersion:') &&
      _fileContent.includes('kind:')
    );
  }

  async parse(
    _fileContent: string,
    _fileName: string
  ): Promise<Partial<InfrastructureState>> {
    // Normalization & stubbing
    return {
      services: [],
      timestamp: Date.now(),
    };
  }
}
