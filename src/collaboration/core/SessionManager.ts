import { CollaborationSession, Participant } from '../types';

/**
 * SessionManager — Creates, joins, recovers, and manages collaboration sessions.
 * Supports reconnection and session recovery after disconnects.
 */
export class SessionManager {
  private sessions: Map<string, CollaborationSession> = new Map();
  private activeSessionId: string | null = null;

  public create(name: string, owner: Participant): CollaborationSession {
    const session: CollaborationSession = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      ownerId: owner.id,
      participants: [owner],
      presenceStates: {},
      isActive: true,
    };

    this.sessions.set(session.id, session);
    this.activeSessionId = session.id;
    return session;
  }

  public join(
    sessionId: string,
    participant: Participant
  ): CollaborationSession | null {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) return null;

    // Check if participant already exists (reconnect case)
    const existing = session.participants.find((p) => p.id === participant.id);
    if (!existing) {
      session.participants.push(participant);
    }

    this.activeSessionId = sessionId;
    return session;
  }

  public leave(participantId: string): void {
    if (!this.activeSessionId) return;
    const session = this.sessions.get(this.activeSessionId);
    if (!session) return;

    session.participants = session.participants.filter(
      (p) => p.id !== participantId
    );

    // If last participant leaves, deactivate session
    if (session.participants.length === 0) {
      session.isActive = false;
    }
  }

  public getActiveSession(): CollaborationSession | null {
    if (!this.activeSessionId) return null;
    return this.sessions.get(this.activeSessionId) ?? null;
  }

  public recoverSession(sessionId: string): CollaborationSession | null {
    return this.sessions.get(sessionId) ?? null;
  }

  public listSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values());
  }
}
