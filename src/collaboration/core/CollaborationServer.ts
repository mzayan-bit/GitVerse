import {
  CollaborationSession,
  Participant,
  SyncMessage,
  PresenceState,
  ActivityEvent,
} from '../types';
import { SessionManager } from './SessionManager';
import { PresenceManager } from './PresenceManager';
import { SynchronizationEngine } from './SynchronizationEngine';

type MessageHandler = (msg: SyncMessage) => void;

/**
 * CollaborationServer — The central orchestrator for all multiplayer features.
 * Provider-agnostic: works with WebSockets, WebRTC, or any transport layer.
 * Manages sessions, presence, and message routing.
 */
export class CollaborationServer {
  private static instance: CollaborationServer;
  private sessionManager: SessionManager;
  private presenceManager: PresenceManager;
  private syncEngine: SynchronizationEngine;
  private messageHandlers: Set<MessageHandler> = new Set();
  private localParticipantId: string | null = null;

  private constructor() {
    this.sessionManager = new SessionManager();
    this.presenceManager = new PresenceManager();
    this.syncEngine = new SynchronizationEngine();
  }

  public static getInstance(): CollaborationServer {
    if (!CollaborationServer.instance) {
      CollaborationServer.instance = new CollaborationServer();
    }
    return CollaborationServer.instance;
  }

  // ── Session Lifecycle ───────────────────────────────────────────────

  public createSession(name: string, owner: Participant): CollaborationSession {
    this.localParticipantId = owner.id;
    const session = this.sessionManager.create(name, owner);
    this.presenceManager.join(owner.id);
    this.emitActivity(owner.id, owner.name, 'created session', name);
    return session;
  }

  public joinSession(
    sessionId: string,
    participant: Participant
  ): CollaborationSession | null {
    this.localParticipantId = participant.id;
    const session = this.sessionManager.join(sessionId, participant);
    if (session) {
      this.presenceManager.join(participant.id);
      this.emitActivity(
        participant.id,
        participant.name,
        'joined session',
        session.name
      );
    }
    return session;
  }

  public leaveSession(participantId: string): void {
    this.presenceManager.leave(participantId);
    this.sessionManager.leave(participantId);
  }

  // ── Message Bus ─────────────────────────────────────────────────────

  public broadcast(message: SyncMessage): void {
    // Apply locally first
    this.syncEngine.applyMessage(message);
    // Notify all handlers (in a real system, this goes over WebSocket)
    for (const handler of this.messageHandlers) {
      handler(message);
    }
  }

  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  // ── Presence ────────────────────────────────────────────────────────

  public updatePresence(state: Partial<PresenceState>): void {
    if (!this.localParticipantId) return;
    this.presenceManager.update(this.localParticipantId, state);
  }

  public getPresenceStates(): Record<string, PresenceState> {
    return this.presenceManager.getAllStates();
  }

  // ── Accessors ───────────────────────────────────────────────────────

  public getActiveSession(): CollaborationSession | null {
    return this.sessionManager.getActiveSession();
  }

  public getLocalParticipantId(): string | null {
    return this.localParticipantId;
  }

  public getSyncEngine(): SynchronizationEngine {
    return this.syncEngine;
  }

  // ── Activity Feed ───────────────────────────────────────────────────

  private activityLog: ActivityEvent[] = [];

  private emitActivity(
    participantId: string,
    participantName: string,
    action: string,
    details: string
  ): void {
    this.activityLog.push({
      id: crypto.randomUUID(),
      participantId,
      participantName,
      action,
      details,
      timestamp: Date.now(),
    });
    // Keep only last 200 events
    if (this.activityLog.length > 200) {
      this.activityLog = this.activityLog.slice(-200);
    }
  }

  public getActivityLog(): ActivityEvent[] {
    return [...this.activityLog];
  }
}
