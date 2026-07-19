import { AnalysisResult } from '../parsers/AnalysisTypes';
import { DependencyGraph } from '../graph/DependencyGraph';

export interface CodeMetrics {
  averageFileSize: number;
  largestModules: Array<{ path: string; size: number }>;
  maxDirectoryDepth: number;
  codeDensity: number; // loc / (emptyLines + commentLines + loc)
  languageDistribution: Record<string, number>;
  maxDependencyDepth: number;
  hotspotCandidates: string[];
  cyclomaticComplexityEstimate: number; // A rough heuristic based on branching
}

export class CodeMetricsEngine {
  public static calculate(
    results: AnalysisResult[],
    graph: DependencyGraph
  ): CodeMetrics {
    if (results.length === 0) {
      return {
        averageFileSize: 0,
        largestModules: [],
        maxDirectoryDepth: 0,
        codeDensity: 0,
        languageDistribution: {},
        maxDependencyDepth: 0,
        hotspotCandidates: [],
        cyclomaticComplexityEstimate: 0,
      };
    }

    let totalLoc = 0;
    let totalEmpty = 0;
    let totalComments = 0;
    let maxDirDepth = 0;
    const langDist: Record<string, number> = {};
    const modulesSize: Array<{ path: string; size: number }> = [];
    let estimatedComplexity = 0;

    for (const res of results) {
      totalLoc += res.loc;
      totalEmpty += res.emptyLines;
      totalComments += res.commentLines;

      const depth = res.path.split('/').length - 1;
      if (depth > maxDirDepth) maxDirDepth = depth;

      langDist[res.language] = (langDist[res.language] || 0) + res.loc;

      modulesSize.push({ path: res.path, size: res.loc });

      // Rough heuristic: functions + imports + classes give a basic complexity curve
      estimatedComplexity +=
        res.functions.length * 1.5 +
        res.classes.length * 2 +
        res.imports.length * 0.5;
    }

    modulesSize.sort((a, b) => b.size - a.size);

    const totalLines = totalLoc + totalEmpty + totalComments;
    const density = totalLines > 0 ? totalLoc / totalLines : 0;

    // Detect dependency depth
    const maxDepDepth = this.calculateMaxDependencyDepth(graph);

    // Detect hotspots: large files with many incoming/outgoing edges
    const hotspots = this.detectHotspots(results, graph);

    return {
      averageFileSize: totalLoc / results.length,
      largestModules: modulesSize.slice(0, 5),
      maxDirectoryDepth: maxDirDepth,
      codeDensity: density,
      languageDistribution: langDist,
      maxDependencyDepth: maxDepDepth,
      hotspotCandidates: hotspots,
      cyclomaticComplexityEstimate: estimatedComplexity,
    };
  }

  private static calculateMaxDependencyDepth(graph: DependencyGraph): number {
    const adjList = new Map<string, string[]>();
    for (const edge of graph.edges) {
      if (!adjList.has(edge.source)) adjList.set(edge.source, []);
      adjList.get(edge.source)!.push(edge.target);
    }

    let maxDepth = 0;
    const memo = new Map<string, number>();

    const dfs = (node: string, visited: Set<string>): number => {
      if (memo.has(node)) return memo.get(node)!;
      if (visited.has(node)) return 0; // Cycle

      visited.add(node);
      let depth = 0;
      const neighbors = adjList.get(node) || [];
      for (const neighbor of neighbors) {
        depth = Math.max(depth, 1 + dfs(neighbor, visited));
      }
      visited.delete(node);
      memo.set(node, depth);
      return depth;
    };

    for (const node of graph.fileNodes.keys()) {
      maxDepth = Math.max(maxDepth, dfs(node, new Set()));
    }

    return maxDepth;
  }

  private static detectHotspots(
    results: AnalysisResult[],
    graph: DependencyGraph
  ): string[] {
    const edgeCounts = new Map<string, number>();
    for (const edge of graph.edges) {
      edgeCounts.set(edge.source, (edgeCounts.get(edge.source) || 0) + 1);
      edgeCounts.set(edge.target, (edgeCounts.get(edge.target) || 0) + 1);
    }

    // A hotspot is a file that is large AND has many edges
    const scores = results.map((res) => {
      const edges = edgeCounts.get(res.path) || 0;
      return { path: res.path, score: res.loc * edges };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, 5).map((s) => s.path);
  }
}
