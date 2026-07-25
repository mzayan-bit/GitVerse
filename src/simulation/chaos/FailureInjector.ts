import { ChaosFailureDefinition, SimulationState } from '../types';

export class FailureInjector {
  public async inject(
    failure: ChaosFailureDefinition,
    state: SimulationState
  ): Promise<void> {
    const eventId = crypto.randomUUID();

    // Push the event to the simulation sandbox state
    state.events.push({
      id: eventId,
      timestamp: state.startTime! + failure.startTimeOffsetMs,
      type: 'failure_injected',
      targetId: failure.targetId,
      details: {
        failureType: failure.type,
        config: failure.config,
      },
    });

    // In a full implementation, this might manipulate the Snapshot's knowledge graph to mark a node as offline.
    console.log(
      `[Sandbox] Injected failure ${failure.type} into node ${failure.targetId}`
    );
  }
}
