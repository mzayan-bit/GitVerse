import { PresenceState } from '../types';

/**
 * PresenceBatcher — Batches high-frequency presence updates (cursor,
 * camera, selection changes) to reduce network chatter.
 *
 * Instead of broadcasting every mousemove or camera tick, we buffer
 * updates and flush at a configurable rate (default: 10fps).
 */
export class PresenceBatcher {
  private static instance: PresenceBatcher;
  private buffer: Map<string, Partial<PresenceState>> = new Map();
  private flushIntervalMs = 100; // 10fps
  private timer: NodeJS.Timeout | null = null;
  private flushCallback:
    ((states: Map<string, Partial<PresenceState>>) => void) | null = null;

  private constructor() {}

  public static getInstance(): PresenceBatcher {
    if (!PresenceBatcher.instance) {
      PresenceBatcher.instance = new PresenceBatcher();
    }
    return PresenceBatcher.instance;
  }

  /**
   * Start the batcher with a callback that fires on each flush.
   */
  public start(
    onFlush: (states: Map<string, Partial<PresenceState>>) => void
  ): void {
    this.flushCallback = onFlush;
    if (this.timer) return;
    this.timer = setInterval(() => this.flush(), this.flushIntervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.flushCallback = null;
  }

  /**
   * Queue a presence update. Only the latest state per participant is kept.
   */
  public queue(participantId: string, update: Partial<PresenceState>): void {
    const existing = this.buffer.get(participantId);
    this.buffer.set(participantId, { ...existing, ...update });
  }

  private flush(): void {
    if (this.buffer.size === 0 || !this.flushCallback) return;

    // Hand off the current buffer and reset
    const batch = this.buffer;
    this.buffer = new Map();
    this.flushCallback(batch);
  }

  /**
   * Set the flush rate. Lower values = more real-time but more network traffic.
   */
  public setFlushRate(ms: number): void {
    this.flushIntervalMs = Math.max(16, ms); // Minimum ~60fps
    if (this.timer && this.flushCallback) {
      this.stop();
      this.start(this.flushCallback);
    }
  }
}
