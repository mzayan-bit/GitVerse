import {
  IInfrastructureParser,
  InfrastructureState,
} from '../IInfrastructureParser';

export class TerraformParser implements IInfrastructureParser {
  name = 'terraform';

  supports(_fileContent: string, _fileName: string): boolean {
    return _fileName.endsWith('.tf') || _fileName.endsWith('.tfstate');
  }

  async parse(
    _fileContent: string,
    _fileName: string
  ): Promise<Partial<InfrastructureState>> {
    return {
      providers: [],
      clusters: [],
      timestamp: Date.now(),
    };
  }
}
