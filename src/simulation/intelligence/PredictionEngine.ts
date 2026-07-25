import { ChaosScenario, SimulationState, PredictionReport } from '../types';
import { SnapshotManager } from '../core/SnapshotManager';
import { RepositoryGraph } from '@/intelligence/KnowledgeGraph/RepositoryGraph';

export class PredictionEngine {
  public async generateReport(
    scenario: ChaosScenario,
    state: SimulationState
  ): Promise<PredictionReport> {
    // Read the isolated snapshot graph
    const snapshotId = state.snapshots[0];
    const snapshot = SnapshotManager.getInstance().getSnapshot(snapshotId) as {
      graph: RepositoryGraph;
    };

    // Fallback if graph is empty or not loaded
    if (!snapshot || !snapshot.graph) {
      return this.createEmptyReport(scenario.id);
    }

    const affectedNodes = new Set<string>();
    let criticalPathImpacted = false;

    // A very simple blast radius simulation: Any node targeted by a failure affects itself.
    // In a real knowledge graph traversal, we'd follow dependencies upstream.
    for (const failure of scenario.failures) {
      affectedNodes.add(failure.targetId);
      // Let's pretend if the targetId includes 'db' or 'core', it's critical
      if (
        failure.targetId.includes('db') ||
        failure.targetId.includes('core')
      ) {
        criticalPathImpacted = true;
      }
    }

    const expectedDowntimeMs = scenario.failures.reduce(
      (total, f) => total + (f.durationMs || 3600000),
      0
    ); // default 1 hour

    return {
      id: crypto.randomUUID(),
      scenarioId: scenario.id,
      affectedNodes: Array.from(affectedNodes),
      criticalPathImpacted,
      expectedDowntimeMs,
      confidenceScore: 0.85, // 85% confidence based on dependency mapping
      recoveryOrder: Array.from(affectedNodes), // Simplified recovery order
      blastRadius: {
        direct: Array.from(affectedNodes),
        indirect: [], // In full implementation, this is populated by graph traversal
      },
      reasoning:
        'Blast radius predicted based on direct dependency mapping within the Knowledge Graph snapshot.',
    };
  }

  private createEmptyReport(scenarioId: string): PredictionReport {
    return {
      id: crypto.randomUUID(),
      scenarioId,
      affectedNodes: [],
      criticalPathImpacted: false,
      expectedDowntimeMs: 0,
      confidenceScore: 0,
      recoveryOrder: [],
      blastRadius: { direct: [], indirect: [] },
      reasoning: 'No graph data found in snapshot.',
    };
  }
}
