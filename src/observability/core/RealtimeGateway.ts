import { EventBus } from './EventBus';
import { EventStore } from './EventStore';
import { LiveEvent } from '../types';

/**
 * Central entry point for all incoming live events.
 * Handles persistence to EventStore and dispatching via EventBus.
 */
export class RealtimeGateway {
  private static instance: RealtimeGateway;

  private constructor() {}

  public static getInstance(): RealtimeGateway {
    if (!RealtimeGateway.instance) {
      RealtimeGateway.instance = new RealtimeGateway();
    }
    return RealtimeGateway.instance;
  }

  /**
   * Ingest a raw event from any provider into the system.
   */
  public ingest(event: LiveEvent): void {
    // 1. Persist to store for history/replay
    EventStore.getInstance().add(event);

    // 2. Publish to realtime bus
    EventBus.getInstance().publish(event);
  }

  /**
   * Batch ingest for high-throughput providers
   */
  public ingestBatch(events: LiveEvent[]): void {
    // In a real high-perf scenario, EventStore and EventBus would have native batch methods.
    events.forEach((e) => this.ingest(e));
  }
}
