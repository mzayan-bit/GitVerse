import {
  IInfrastructureParser,
  InfrastructureState,
} from '../IInfrastructureParser';

export class DockerComposeParser implements IInfrastructureParser {
  name = 'docker-compose';

  supports(_fileContent: string, _fileName: string): boolean {
    return (
      _fileName.includes('docker-compose') && _fileContent.includes('services:')
    );
  }

  async parse(
    _fileContent: string,
    _fileName: string
  ): Promise<Partial<InfrastructureState>> {
    return {
      services: [],
      databases: [],
      timestamp: Date.now(),
    };
  }
}
