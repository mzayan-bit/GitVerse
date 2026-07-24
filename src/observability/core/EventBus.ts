import { LiveEvent, EventCallback } from '../types';

/**
 * High-performance EventBus for routing live engineering events.
 * Supports wildcard subscriptions and fast fan-out.
 */
export class EventBus {
  private static instance: EventBus;
  private subscribers: Map<string, Set<EventCallback>> = new Map();
  private globalSubscribers: Set<EventCallback> = new Set();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to specific event types or sources
   * @param topic Can be event type ('metric', 'log') or sourceId ('service-a')
   * @param callback Function to call when event matches
   */
  public subscribe(topic: string, callback: EventCallback): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(topic);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(topic);
        }
      }
    };
  }

  /**
   * Subscribe to ALL events
   */
  public subscribeAll(callback: EventCallback): () => void {
    this.globalSubscribers.add(callback);
    return () => {
      this.globalSubscribers.delete(callback);
    };
  }

  /**
   * Publish an event to the bus
   */
  public publish(event: LiveEvent): void {
    // 1. Notify global subscribers
    this.globalSubscribers.forEach((cb) => cb(event));

    // 2. Notify type subscribers (e.g., 'metric')
    const typeSubs = this.subscribers.get(event.type);
    if (typeSubs) {
      typeSubs.forEach((cb) => cb(event));
    }

    // 3. Notify source subscribers (e.g., 'planet-123')
    const sourceSubs = this.subscribers.get(event.sourceId);
    if (sourceSubs) {
      sourceSubs.forEach((cb) => cb(event));
    }
  }

  public clear(): void {
    this.subscribers.clear();
    this.globalSubscribers.clear();
  }
}
