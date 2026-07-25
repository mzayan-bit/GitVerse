import { ChaosFailureDefinition, SimulationState } from '../types';

export class FailureInjector {
  public async inject(
    failure: ChaosFailureDefinition,
    state: SimulationState
  ): Promise<void> {
    // Stub
  }
}
