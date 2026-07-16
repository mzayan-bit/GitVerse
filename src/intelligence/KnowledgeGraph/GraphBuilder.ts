import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { RepositoryGraph } from './RepositoryGraph';
import { GraphNode } from './GraphNode';

export class GraphBuilder {
  public static buildGraph(
    repositories: RepositoryDomainModel[]
  ): RepositoryGraph {
    const graph = new RepositoryGraph();

    // 1. Create nodes
    for (const repo of repositories) {
      const node = new GraphNode(repo);
      graph.addNode(node);
    }

    // Edges will be added by the RelationshipEngine
    return graph;
  }
}
