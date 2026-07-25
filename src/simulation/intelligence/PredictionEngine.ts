import { ChaosScenario, SimulationState, PredictionReport } from '../types';

export class PredictionEngine {
  public async generateReport(
    scenario: ChaosScenario,
    state: SimulationState
  ): Promise<PredictionReport> {
    return {
      id: crypto.randomUUID(),
      scenarioId: scenario.id,
      affectedNodes: [],
      criticalPathImpacted: false,
      expectedDowntimeMs: 0,
      confidenceScore: 0,
      recoveryOrder: [],
      blastRadius: { direct: [], indirect: [] },
      reasoning: 'Stubbed prediction engine',
    };
  }
}
