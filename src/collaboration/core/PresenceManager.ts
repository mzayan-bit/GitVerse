import { PresenceState } from '../types';

const IDLE_TIMEOUT_MS = 60_000; // 1 minute

/**
 * PresenceManager — Tracks the live state of all participants:
 * cursor position, camera, selection, idle status, etc.
 */
export class PresenceManager {
  private states: Map<string, PresenceState> = new Map();

  public join(participantId: string): void {
    this.states.set(participantId, {
      participantId,
      isIdle: false,
      lastActiveAt: Date.now(),
    });
  }

  public leave(participantId: string): void {
    this.states.delete(participantId);
  }

  public update(participantId: string, partial: Partial<PresenceState>): void {
    const current = this.states.get(participantId);
    if (!current) return;

    this.states.set(participantId, {
      ...current,
      ...partial,
      lastActiveAt: Date.now(),
      isIdle: false,
    });
  }

  public markIdle(participantId: string): void {
    const current = this.states.get(participantId);
    if (!current) return;
    this.states.set(participantId, { ...current, isIdle: true });
  }

  public getState(participantId: string): PresenceState | undefined {
    return this.states.get(participantId);
  }

  public getAllStates(): Record<string, PresenceState> {
    const result: Record<string, PresenceState> = {};
    for (const [id, state] of this.states) {
      result[id] = state;
    }
    return result;
  }

  /**
   * Scans for participants that haven't sent an update within the idle timeout.
   */
  public detectIdleParticipants(): string[] {
    const now = Date.now();
    const idled: string[] = [];
    for (const [id, state] of this.states) {
      if (!state.isIdle && now - state.lastActiveAt > IDLE_TIMEOUT_MS) {
        this.markIdle(id);
        idled.push(id);
      }
    }
    return idled;
  }
}
