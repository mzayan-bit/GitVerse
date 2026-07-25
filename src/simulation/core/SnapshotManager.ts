import { useGraphManager } from '@/intelligence/KnowledgeGraph/GraphManager';

/**
 * Manages deep copies or structural sharing of the application state.
 * Prevents simulation mutations from affecting the live production dashboard.
 */
export class SnapshotManager {
  private static instance: SnapshotManager;
  private snapshots: Map<string, unknown> = new Map();

  private constructor() {}

  public static getInstance(): SnapshotManager {
    if (!SnapshotManager.instance) {
      SnapshotManager.instance = new SnapshotManager();
    }
    return SnapshotManager.instance;
  }

  public createSnapshot(tag: string): string {
    const id = `snapshot-${tag}-${Date.now()}`;

    // Snapshot the Knowledge Graph
    // In a massive graph, we would use structural sharing (immutable.js or Immer).
    // For now, we perform a deep clone of the graph state.
    const graphState = useGraphManager.getState().graph;
    const clonedState = graphState
      ? JSON.parse(JSON.stringify(graphState))
      : null;

    this.snapshots.set(id, {
      graph: clonedState,
      timestamp: Date.now(),
    });

    return id;
  }

  public getSnapshot(id: string): unknown {
    return this.snapshots.get(id);
  }

  public restoreSnapshot(id: string): void {
    const snapshot = this.snapshots.get(id);
    if (!snapshot) throw new Error(`Snapshot ${id} not found`);

    // In a real system, we'd swap a pointer to the current "sandbox" state store.
    // We explicitly DO NOT restore into KnowledgeGraphManager directly as that would affect production.
  }

  public clear(): void {
    this.snapshots.clear();
  }
}
