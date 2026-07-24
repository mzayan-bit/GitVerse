import { EventBus } from './EventBus';
import { EventCallback } from '../types';

/**
 * Manages active subscriptions and their lifecycles.
 */
export class SubscriptionManager {
  private subscriptions: Map<string, () => void> = new Map();

  public subscribe(id: string, topic: string, callback: EventCallback): void {
    // Clean up existing if overwriting
    this.unsubscribe(id);

    const unsubscribeFn = EventBus.getInstance().subscribe(topic, callback);
    this.subscriptions.set(id, unsubscribeFn);
  }

  public subscribeAll(id: string, callback: EventCallback): void {
    this.unsubscribe(id);
    const unsubscribeFn = EventBus.getInstance().subscribeAll(callback);
    this.subscriptions.set(id, unsubscribeFn);
  }

  public unsubscribe(id: string): void {
    const unsub = this.subscriptions.get(id);
    if (unsub) {
      unsub();
      this.subscriptions.delete(id);
    }
  }

  public unsubscribeAll(): void {
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions.clear();
  }
}
