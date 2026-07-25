import { ChaosScenario, SimulationState } from '../types';
import { FailureInjector } from '../chaos/FailureInjector';

export class ScenarioRunner {
  private injector: FailureInjector;

  constructor() {
    this.injector = new FailureInjector();
  }

  public async execute(
    scenario: ChaosScenario,
    state: SimulationState
  ): Promise<void> {
    // Sort failures by start time
    const sortedFailures = [...scenario.failures].sort(
      (a, b) => a.startTimeOffsetMs - b.startTimeOffsetMs
    );

    for (const failure of sortedFailures) {
      // Simulate time passing (in a real advanced simulation, this uses virtual time)
      // For this implementation, we execute sequentially against the snapshot state immediately.
      await this.injector.inject(failure, state);
    }
  }
}
