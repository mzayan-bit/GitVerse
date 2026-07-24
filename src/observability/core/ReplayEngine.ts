import { EventBus } from './EventBus';
import { EventStore } from './EventStore';

/**
 * Replays historical events from the EventStore for debugging or time-travel.
 */
export class ReplayEngine {
  private isReplaying = false;
  private playbackSpeed = 1.0;

  /**
   * Replays the last N events at the specified playback speed.
   */
  public async replayRecent(
    limit: number = 100,
    speedMultiplier: number = 1.0
  ): Promise<void> {
    if (this.isReplaying) return;
    this.isReplaying = true;
    this.playbackSpeed = speedMultiplier;

    const events = EventStore.getInstance().getRecent(limit);
    if (events.length === 0) {
      this.isReplaying = false;
      return;
    }

    const bus = EventBus.getInstance();

    for (let i = 0; i < events.length; i++) {
      if (!this.isReplaying) break; // Allow cancellation

      const current = events[i];
      bus.publish(current);

      if (i < events.length - 1) {
        const next = events[i + 1];
        const timeDiff = next.timestamp - current.timestamp;
        const sleepMs = Math.max(0, timeDiff / this.playbackSpeed);

        if (sleepMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, sleepMs));
        }
      }
    }

    this.isReplaying = false;
  }

  public stopReplay(): void {
    this.isReplaying = false;
  }
}
