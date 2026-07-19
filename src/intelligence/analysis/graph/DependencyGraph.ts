import { AnalysisResult } from '../parsers/AnalysisTypes';

export interface GraphEdge {
  source: string;
  target: string;
  type: 'import' | 'module';
}

export interface CircularDependency {
  path: string[];
}

export class DependencyGraph {
  public fileNodes: Map<string, AnalysisResult> = new Map();
  public folderNodes: Set<string> = new Set();
  public edges: GraphEdge[] = [];
  public circularDependencies: CircularDependency[] = [];
  public sharedModules: string[] = [];

  public build(results: AnalysisResult[]): void {
    // Register nodes
    for (const res of results) {
      this.fileNodes.set(res.path, res);

      const folder = res.path.substring(0, res.path.lastIndexOf('/'));
      if (folder) {
        this.folderNodes.add(folder);
      }
    }

    // Build edges
    for (const res of results) {
      for (const imp of res.imports) {
        // Resolve path to some extent (extremely basic for now)
        // A full resolver would need tsconfig paths and relative path resolution
        const target = this.resolveImport(res.path, imp);
        if (target) {
          this.edges.push({
            source: res.path,
            target,
            type: 'import',
          });
        }
      }
    }

    this.detectCircularDependencies();
    this.detectSharedModules();
  }

  private resolveImport(sourcePath: string, importPath: string): string | null {
    if (importPath.startsWith('.')) {
      const sourceDir = sourcePath.substring(0, sourcePath.lastIndexOf('/'));
      const parts = sourceDir.split('/');
      const importParts = importPath.split('/');

      for (const part of importParts) {
        if (part === '..') parts.pop();
        else if (part !== '.') parts.push(part);
      }
      const resolved = parts.join('/');

      // Try to find matching file
      for (const [path] of this.fileNodes) {
        if (path.startsWith(resolved)) {
          return path;
        }
      }
    }
    return importPath; // External or unresolvable
  }

  private detectCircularDependencies(): void {
    // Basic cycle detection using Tarjan's or simple DFS
    // For now we will implement a simple DFS cycle detector
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const pathStack: string[] = [];

    const adjList = new Map<string, string[]>();
    for (const edge of this.edges) {
      if (!adjList.has(edge.source)) adjList.set(edge.source, []);
      adjList.get(edge.source)!.push(edge.target);
    }

    const dfs = (node: string) => {
      visited.add(node);
      recStack.add(node);
      pathStack.push(node);

      const neighbors = adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        } else if (recStack.has(neighbor)) {
          // Cycle found
          const cycleStart = pathStack.indexOf(neighbor);
          const cycle = pathStack.slice(cycleStart);
          cycle.push(neighbor);
          this.circularDependencies.push({ path: [...cycle] });
        }
      }

      recStack.delete(node);
      pathStack.pop();
    };

    for (const node of this.fileNodes.keys()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }
  }

  private detectSharedModules(): void {
    // Find modules imported by many different files
    const importCounts = new Map<string, number>();
    for (const edge of this.edges) {
      importCounts.set(edge.target, (importCounts.get(edge.target) || 0) + 1);
    }

    for (const [target, count] of importCounts.entries()) {
      if (count > 3) {
        this.sharedModules.push(target);
      }
    }
  }
}
