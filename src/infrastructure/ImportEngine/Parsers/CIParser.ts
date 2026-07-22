import {
  IInfrastructureParser,
  InfrastructureState,
} from '../IInfrastructureParser';

export class CIParser implements IInfrastructureParser {
  name = 'ci-cd';

  supports(_fileContent: string, _fileName: string): boolean {
    return (
      _fileName.includes('.github/workflows') ||
      _fileName.includes('.gitlab-ci')
    );
  }

  async parse(
    _fileContent: string,
    _fileName: string
  ): Promise<Partial<InfrastructureState>> {
    return {
      timestamp: Date.now(),
    };
  }
}
