import { SimulationState, ChaosScenario, PredictionReport } from '../types';
import { SnapshotManager } from './SnapshotManager';
import { ScenarioRunner } from './ScenarioRunner';
import { PredictionEngine } from '../intelligence/PredictionEngine';
import { GraphManager } from '@/intelligence/KnowledgeGraph/GraphManager';

export class SimulationEngine {
  private static instance: SimulationEngine;
  private activeSimulation: SimulationState | null = null;
  private runner: ScenarioRunner;
  private predictionEngine: PredictionEngine;

  private constructor() {
    this.runner = new ScenarioRunner();
    this.predictionEngine = new PredictionEngine();
  }

  public static getInstance(): SimulationEngine {
    if (!SimulationEngine.instance) {
      SimulationEngine.instance = new SimulationEngine();
    }
    return SimulationEngine.instance;
  }

  /**
   * Initializes a new simulation sandbox, taking a snapshot of production state.
   */
  public createSimulation(name: string): SimulationState {
    // 1. Snapshot the production state (KnowledgeGraph, LiveMetrics, etc)
    const snapshotId = SnapshotManager.getInstance().createSnapshot('baseline');

    this.activeSimulation = {
      id: crypto.randomUUID(),
      name,
      status: 'idle',
      events: [],
      snapshots: [snapshotId],
    };

    return this.activeSimulation;
  }

  /**
   * Executes a chaos scenario inside the sandbox and generates a prediction report.
   */
  public async runScenario(scenario: ChaosScenario): Promise<PredictionReport> {
    if (!this.activeSimulation) {
      throw new Error('No active simulation. Call createSimulation first.');
    }

    this.activeSimulation.status = 'running';
    this.activeSimulation.startTime = Date.now();

    try {
      // Execute the scenario inside the isolated snapshot
      await this.runner.execute(scenario, this.activeSimulation);

      // Calculate blast radius and predictions based on the mutated snapshot
      const report = await this.predictionEngine.generateReport(
        scenario,
        this.activeSimulation
      );

      this.activeSimulation.status = 'completed';
      this.activeSimulation.endTime = Date.now();

      return report;
    } catch (error) {
      this.activeSimulation.status = 'failed';
      this.activeSimulation.endTime = Date.now();
      throw error;
    }
  }

  public rollback(): void {
    if (!this.activeSimulation) return;

    // Restore the baseline snapshot to the sandbox
    const baselineId = this.activeSimulation.snapshots[0];
    SnapshotManager.getInstance().restoreSnapshot(baselineId);

    this.activeSimulation = null;
  }

  public getActiveSimulation(): SimulationState | null {
    return this.activeSimulation;
  }
}
