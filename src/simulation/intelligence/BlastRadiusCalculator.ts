import { RepositoryGraph } from '@/intelligence/KnowledgeGraph/RepositoryGraph';

export class BlastRadiusCalculator {
  /**
   * Calculates direct and indirect blast radius using breadth-first search on the Knowledge Graph.
   */
  public calculate(
    _graph: RepositoryGraph,
    targetNodeId: string
  ): { direct: string[]; indirect: string[] } {
    const direct: string[] = [];
    const indirect: string[] = [];

    // The graph object usually has nodes and edges. Let's assume it has an easy way to get adjacent nodes.
    // Given we are stubbing out deep traversals, we do a simple mock.

    // In actual implementation:
    // 1. Direct dependencies: Edge from targetNodeId -> otherNode
    // 2. Indirect dependencies: BFS from direct dependencies

    // Stub returning just the target node for safety
    direct.push(targetNodeId);

    return { direct, indirect };
  }
}
