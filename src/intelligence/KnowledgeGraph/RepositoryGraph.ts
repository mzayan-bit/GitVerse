import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';
import { RelationshipType } from './RelationshipTypes';

export class RepositoryGraph {
  public nodes: Map<string, GraphNode> = new Map();
  public edges: GraphEdge[] = [];
  private adjacencyList: Map<string, GraphEdge[]> = new Map();

  public addNode(node: GraphNode): void {
    if (!this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, []);
    }
  }

  public addEdge(edge: GraphEdge): void {
    if (this.nodes.has(edge.sourceId) && this.nodes.has(edge.targetId)) {
      this.edges.push(edge);
      this.adjacencyList.get(edge.sourceId)?.push(edge);

      // Undirected graph equivalent for easy traversal, we add the reverse edge implicitly
      // or we can just push it to the target's adjacency list as well for undirected traversal
      this.adjacencyList.get(edge.targetId)?.push(edge);
    }
  }

  public getConnectedEdges(nodeId: string): GraphEdge[] {
    return this.adjacencyList.get(nodeId) || [];
  }

  public getConnectedNodes(
    nodeId: string,
    type?: RelationshipType
  ): GraphNode[] {
    const edges = this.getConnectedEdges(nodeId);
    const nodes: GraphNode[] = [];

    for (const edge of edges) {
      if (type && edge.type !== type) continue;

      const neighborId =
        edge.sourceId === nodeId ? edge.targetId : edge.sourceId;
      const neighborNode = this.nodes.get(neighborId);
      if (neighborNode) {
        nodes.push(neighborNode);
      }
    }

    return nodes;
  }

  public clear(): void {
    this.nodes.clear();
    this.edges = [];
    this.adjacencyList.clear();
  }
}
