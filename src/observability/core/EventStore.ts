import { LiveEvent } from '../types';

/**
 * In-memory circular buffer for recent events.
 * Used for hydration of new clients and replay functionality.
 */
export class EventStore {
  private static instance: EventStore;
  private events: LiveEvent[] = [];
  private maxCapacity = 10000;

  private constructor() {}

  public static getInstance(): EventStore {
    if (!EventStore.instance) {
      EventStore.instance = new EventStore();
    }
    return EventStore.instance;
  }

  public setCapacity(capacity: number): void {
    this.maxCapacity = capacity;
    this.trim();
  }

  public add(event: LiveEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxCapacity) {
      this.events.shift();
    }
  }

  public getRecent(limit: number = 100): LiveEvent[] {
    return this.events.slice(-limit);
  }

  public getByType(type: LiveEvent['type'], limit: number = 100): LiveEvent[] {
    return this.events.filter((e) => e.type === type).slice(-limit);
  }

  public getBySource(sourceId: string, limit: number = 100): LiveEvent[] {
    return this.events.filter((e) => e.sourceId === sourceId).slice(-limit);
  }

  public clear(): void {
    this.events = [];
  }

  private trim(): void {
    if (this.events.length > this.maxCapacity) {
      this.events = this.events.slice(-this.maxCapacity);
    }
  }
}
