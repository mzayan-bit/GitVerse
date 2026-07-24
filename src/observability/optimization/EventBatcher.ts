import { LiveEvent } from '../types';
import { RealtimeGateway } from '../core/RealtimeGateway';

/**
 * High-performance batching engine for Observability Events.
 * Buffers incoming events and flushes them in chunks using requestIdleCallback or setTimeout
 * to prevent main-thread blocking under extreme load (100k+ events/min).
 */
export class EventBatcher {
  private static instance: EventBatcher;
  private buffer: LiveEvent[] = [];
  private flushIntervalMs = 50; // 20fps updates
  private timer: NodeJS.Timeout | null = null;

  private constructor() {
    this.start();
  }

  public static getInstance(): EventBatcher {
    if (!EventBatcher.instance) {
      EventBatcher.instance = new EventBatcher();
    }
    return EventBatcher.instance;
  }

  public queue(event: LiveEvent): void {
    this.buffer.push(event);

    // Safety check for extreme spikes
    if (this.buffer.length > 50000) {
      this.flush(); // Force synchronous flush if buffer blows up
    }
  }

  private start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.flush();
    }, this.flushIntervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private flush(): void {
    if (this.buffer.length === 0) return;

    // Grab current buffer and reset immediately to capture new events
    const batch = this.buffer;
    this.buffer = [];

    // Compress batch if needed (e.g. aggregate metrics for same source)
    const compressed = this.compress(batch);

    // Offload to gateway
    RealtimeGateway.getInstance().ingestBatch(compressed);
  }

  /**
   * Adaptive compression: If we receive 100 CPU updates for the same planet in 50ms,
   * we only care about the latest one.
   */
  private compress(events: LiveEvent[]): LiveEvent[] {
    const latestMetrics = new Map<string, LiveEvent>();
    const others: LiveEvent[] = [];

    for (const event of events) {
      if (event.type === 'metric') {
        // Compound key: type + sourceId + metricName
        const key = `${event.type}:${event.sourceId}:${event.metricName}`;
        latestMetrics.set(key, event);
      } else {
        others.push(event);
      }
    }

    return [...others, ...latestMetrics.values()];
  }
}
