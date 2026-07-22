import {
  CloudProviderConfig,
  ClusterModel,
  ServiceModel,
  DatabaseModel,
} from '@/domain/Infrastructure';

export interface InfrastructureState {
  version: string;
  providers: CloudProviderConfig[];
  clusters: ClusterModel[];
  services: ServiceModel[];
  databases: DatabaseModel[];
  timestamp: number;
}

export interface IInfrastructureParser {
  name: string;
  supports(fileContent: string, fileName: string): boolean;
  parse(
    fileContent: string,
    fileName: string
  ): Promise<Partial<InfrastructureState>>;
}
