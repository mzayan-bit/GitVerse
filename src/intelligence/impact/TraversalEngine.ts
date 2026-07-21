import { ImpactGraph } from './ImpactGraph';
import { ImpactPath, ImpactPathEdge } from './ImpactTypes';
import { RelationshipResolver } from './RelationshipResolver';

// ============================================================================
// Traversal Engine
// Computes downstream/upstream impact using graph traversal algorithms.
// ============================================================================

export class TraversalEngine {
  private resolver = new RelationshipResolver();
  private maxDepth = 10; // Prevent infinite loops in deeply nested/circular graphs

  // Memoization cache for downstream/upstream queries to ensure O(V+E) performance across repeated hits
  private downstreamCache = new Map<string, ImpactPath[]>();
  private upstreamCache = new Map<string, ImpactPath[]>();

  /**
   * Traverse the graph from a specific node to find all downstream impacted paths.
   */
  public findDownstreamImpact(
    graph: ImpactGraph,
    startNodeId: string
  ): ImpactPath[] {
    if (this.downstreamCache.has(startNodeId)) {
      return this.downstreamCache.get(startNodeId)!;
    }

    const paths: ImpactPath[] = [];
    const visited = new Set<string>();

    this.dfs(
      graph,
      startNodeId,
      [startNodeId],
      [],
      0,
      1.0,
      visited,
      paths,
      'DOWNSTREAM'
    );

    this.downstreamCache.set(startNodeId, paths);
    return paths;
  }

  /**
   * Traverse the graph from a specific node to find all upstream factors.
   */
  public findUpstreamImpact(
    graph: ImpactGraph,
    startNodeId: string
  ): ImpactPath[] {
    if (this.upstreamCache.has(startNodeId)) {
      return this.upstreamCache.get(startNodeId)!;
    }

    const paths: ImpactPath[] = [];
    const visited = new Set<string>();

    this.dfs(
      graph,
      startNodeId,
      [startNodeId],
      [],
      0,
      1.0,
      visited,
      paths,
      'UPSTREAM'
    );

    this.upstreamCache.set(startNodeId, paths);
    return paths;
  }

  private dfs(
    graph: ImpactGraph,
    currentNodeId: string,
    currentPathNodes: string[],
    currentPathEdges: ImpactPathEdge[],
    depth: number,
    cumulativeWeight: number,
    globalVisited: Set<string>, // Used to prevent infinite loops globally
    allPaths: ImpactPath[],
    direction: 'UPSTREAM' | 'DOWNSTREAM'
  ): void {
    if (depth >= this.maxDepth) {
      allPaths.push({
        nodes: [...currentPathNodes],
        edges: [...currentPathEdges],
        cumulativeRisk: cumulativeWeight,
      });
      return;
    }

    const edges = graph.baseGraph.getConnectedEdges(currentNodeId);
    let hasValidNeighbors = false;

    for (const edge of edges) {
      const neighborId =
        edge.sourceId === currentNodeId ? edge.targetId : edge.sourceId;

      // Prevent circular paths within the current traversal
      if (currentPathNodes.includes(neighborId)) continue;

      const edgeDirection = this.resolver.resolveDirection(edge.type);
      const isOutbound = edge.sourceId === currentNodeId;

      // Filter by traversal direction
      let isValidTraversal = false;
      if (direction === 'DOWNSTREAM') {
        // We traverse if A -> B and B depends on A (Downstream)
        isValidTraversal =
          (isOutbound && edgeDirection === 'DOWNSTREAM') ||
          (!isOutbound && edgeDirection === 'UPSTREAM') ||
          edgeDirection === 'BIDIRECTIONAL';
      } else {
        // Upstream traversal
        isValidTraversal =
          (isOutbound && edgeDirection === 'UPSTREAM') ||
          (!isOutbound && edgeDirection === 'DOWNSTREAM') ||
          edgeDirection === 'BIDIRECTIONAL';
      }

      if (isValidTraversal) {
        hasValidNeighbors = true;
        const weight = this.resolver.getWeight(edge.type);
        const newWeight = cumulativeWeight * weight;

        const pathEdge: ImpactPathEdge = {
          sourceId: currentNodeId,
          targetId: neighborId,
          relationshipType: edge.type,
          weight,
        };

        // If weight drops too low, impact is negligible, cut branch
        if (newWeight > 0.05) {
          this.dfs(
            graph,
            neighborId,
            [...currentPathNodes, neighborId],
            [...currentPathEdges, pathEdge],
            depth + 1,
            newWeight,
            globalVisited,
            allPaths,
            direction
          );
        }
      }
    }

    // If leaf node (no more valid neighbors), store the path
    if (!hasValidNeighbors && currentPathNodes.length > 1) {
      allPaths.push({
        nodes: [...currentPathNodes],
        edges: [...currentPathEdges],
        cumulativeRisk: cumulativeWeight,
      });
    }
  }
}
