export interface DependencyAnalysis {
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  type: string;
}

export interface GraphReasoningResult {
  matchingNodeIds: string[];
  circularDependencies: Array<{ cycle: string[] }>;
  dependencyPaths: DependencyAnalysis[];
  insights: string[];
}

export class KnowledgeReasoner {
  /**
   * Search for nodes consuming a specific tech stack (e.g. "Redis", "Postgres", "Kafka")
   */
  public static queryTechStackConsumers(
    techKeyword: string,
    nodes: Array<{
      id: string;
      name: string;
      techStack?: string[];
      description?: string;
    }>
  ): string[] {
    const kw = techKeyword.toLowerCase();
    return nodes
      .filter(
        (n) =>
          n.name.toLowerCase().includes(kw) ||
          n.description?.toLowerCase().includes(kw) ||
          n.techStack?.some((t) => t.toLowerCase().includes(kw))
      )
      .map((n) => n.id);
  }

  /**
   * Detect circular dependencies using Cycle Detection
   */
  public static detectCircularDependencies(
    edges: Array<{ sourceId: string; targetId: string }>
  ): Array<{ cycle: string[] }> {
    const adj = new Map<string, string[]>();
    edges.forEach((e) => {
      let list = adj.get(e.sourceId);
      if (!list) {
        list = [];
        adj.set(e.sourceId, list);
      }
      list.push(e.targetId);
    });

    const cycles: Array<{ cycle: string[] }> = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (node: string, path: string[]) => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          const cycleStart = path.indexOf(neighbor);
          if (cycleStart !== -1) {
            cycles.push({ cycle: path.slice(cycleStart) });
          }
        }
      }

      recStack.delete(node);
    };

    adj.forEach((_, node) => {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    });

    return cycles;
  }
}
