import { RepositoryDomainModel } from '@/domain/RepositoryModels';

export class GraphNode {
  public id: string;
  public repository: RepositoryDomainModel;

  // Computed metrics (added by Metrics Engine later)
  public metrics: Record<string, number> = {};

  constructor(repository: RepositoryDomainModel) {
    this.id = repository.id;
    this.repository = repository;
  }
}
