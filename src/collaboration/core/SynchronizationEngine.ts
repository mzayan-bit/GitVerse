import { SyncMessage } from '../types';
import { ConflictResolver } from './ConflictResolver';

/**
 * SynchronizationEngine — CRDT-ready engine for applying and ordering
 * collaborative state changes across participants.
 * Uses vector clocks for causal ordering.
 */
export class SynchronizationEngine {
  private vectorClock: Record<string, number> = {};
  private messageLog: SyncMessage[] = [];
  private conflictResolver: ConflictResolver;

  constructor() {
    this.conflictResolver = new ConflictResolver();
  }

  /**
   * Increment the local vector clock for a participant and return it.
   */
  public tick(participantId: string): Record<string, number> {
    this.vectorClock[participantId] =
      (this.vectorClock[participantId] || 0) + 1;
    return { ...this.vectorClock };
  }

  /**
   * Apply an incoming sync message, resolving conflicts if needed.
   */
  public applyMessage(message: SyncMessage): void {
    // Merge the incoming vector clock
    for (const [id, clock] of Object.entries(message.vectorClock)) {
      this.vectorClock[id] = Math.max(this.vectorClock[id] || 0, clock);
    }

    // Check for conflicts (concurrent edits to the same entity)
    const conflicting = this.findConflict(message);
    if (conflicting) {
      const winner = this.conflictResolver.resolve(conflicting, message);
      // Only apply if this message wins
      if (winner.id !== message.id) return;
    }

    this.messageLog.push(message);

    // Keep only the last 1000 messages for replay
    if (this.messageLog.length > 1000) {
      this.messageLog = this.messageLog.slice(-1000);
    }
  }

  /**
   * Find a conflicting message (same type targeting the same entity, from a different sender).
   */
  private findConflict(incoming: SyncMessage): SyncMessage | null {
    const entityId = incoming.payload['entityId'] as string | undefined;
    if (!entityId) return null;

    // Look backwards for a recent message targeting the same entity
    for (
      let i = this.messageLog.length - 1;
      i >= Math.max(0, this.messageLog.length - 50);
      i--
    ) {
      const existing = this.messageLog[i];
      if (
        existing.type === incoming.type &&
        existing.senderId !== incoming.senderId &&
        (existing.payload['entityId'] as string) === entityId &&
        incoming.timestamp - existing.timestamp < 2000 // Within 2 second window
      ) {
        return existing;
      }
    }
    return null;
  }

  public getMessageLog(): SyncMessage[] {
    return [...this.messageLog];
  }

  public getVectorClock(): Record<string, number> {
    return { ...this.vectorClock };
  }
}
