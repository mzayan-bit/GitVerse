import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { RepositoryGraph } from './RepositoryGraph';
import { GraphNode } from './GraphNode';
import { MetricsEngine } from '../MetricsEngine';

export class GraphBuilder {
  public static buildGraph(
    repositories: RepositoryDomainModel[]
  ): RepositoryGraph {
    const graph = new RepositoryGraph();

    // 1. Create nodes and compute metrics
    for (const repo of repositories) {
      const node = new GraphNode(repo);
      node.metrics = MetricsEngine.computeMetrics(repo) as unknown as Record<
        string,
        number
      >;
      graph.addNode(node);
    }

    // Edges will be added by the RelationshipEngine
    return graph;
  }
}
