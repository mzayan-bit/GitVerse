import { SyncMessage } from '../types';

/**
 * ConflictResolver — Resolves concurrent edits using Last-Writer-Wins
 * with vector clock comparison as tiebreaker.
 */
export class ConflictResolver {
  /**
   * Given two concurrent messages targeting the same entity,
   * determines which one "wins" using LWW strategy.
   */
  public resolve(existing: SyncMessage, incoming: SyncMessage): SyncMessage {
    // 1. Timestamp comparison (Last-Writer-Wins)
    if (incoming.timestamp > existing.timestamp) {
      return incoming;
    }
    if (existing.timestamp > incoming.timestamp) {
      return existing;
    }

    // 2. Tiebreaker: compare vector clock sums
    const sumClock = (vc: Record<string, number>) =>
      Object.values(vc).reduce((a, b) => a + b, 0);

    const incomingSum = sumClock(incoming.vectorClock);
    const existingSum = sumClock(existing.vectorClock);

    if (incomingSum > existingSum) return incoming;
    if (existingSum > incomingSum) return existing;

    // 3. Final tiebreaker: lexicographic sender ID comparison
    return incoming.senderId > existing.senderId ? incoming : existing;
  }
}
