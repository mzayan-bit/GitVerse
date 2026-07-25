import { CollaborationServer } from '../core/CollaborationServer';
import { SyncMessage } from '../types';
import { useSharedState } from './SharedStateStore';

/**
 * UniverseSyncAdapter — Bridges the CollaborationServer message bus
 * with the Zustand SharedStateStore and the 3D Universe managers.
 *
 * Listens for incoming sync messages and applies them to the local
 * shared state. Also provides methods for the local user to broadcast
 * their own state changes.
 */
export class UniverseSyncAdapter {
  private static instance: UniverseSyncAdapter;
  private unsubscribe: (() => void) | null = null;
  private presencePollTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): UniverseSyncAdapter {
    if (!UniverseSyncAdapter.instance) {
      UniverseSyncAdapter.instance = new UniverseSyncAdapter();
    }
    return UniverseSyncAdapter.instance;
  }

  /**
   * Start listening for incoming collaboration messages.
   */
  public connect(): void {
    const server = CollaborationServer.getInstance();

    this.unsubscribe = server.onMessage((msg) => {
      this.handleIncomingMessage(msg);
    });

    // Poll presence states at 10fps for smooth cursor rendering
    this.presencePollTimer = setInterval(() => {
      const states = server.getPresenceStates();
      useSharedState.getState().setRemotePresence(states);
    }, 100);
  }

  public disconnect(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    if (this.presencePollTimer) {
      clearInterval(this.presencePollTimer);
      this.presencePollTimer = null;
    }
  }

  // ── Outbound: Broadcast local user actions ──────────────────────────

  public broadcastCameraSync(
    position: [number, number, number],
    target: [number, number, number]
  ): void {
    const server = CollaborationServer.getInstance();
    const localId = server.getLocalParticipantId();
    if (!localId) return;

    const clock = server.getSyncEngine().tick(localId);
    server.broadcast({
      id: crypto.randomUUID(),
      type: 'camera_sync',
      senderId: localId,
      timestamp: Date.now(),
      payload: { position, target },
      vectorClock: clock,
    });
  }

  public broadcastSelectionChange(entityId: string | null): void {
    const server = CollaborationServer.getInstance();
    const localId = server.getLocalParticipantId();
    if (!localId) return;

    server.updatePresence({ selectedEntityId: entityId });

    const clock = server.getSyncEngine().tick(localId);
    server.broadcast({
      id: crypto.randomUUID(),
      type: 'selection_change',
      senderId: localId,
      timestamp: Date.now(),
      payload: { entityId },
      vectorClock: clock,
    });
  }

  // ── Inbound: Handle remote messages ─────────────────────────────────

  private handleIncomingMessage(msg: SyncMessage): void {
    const store = useSharedState.getState();

    switch (msg.type) {
      case 'annotation_add': {
        const annotation = msg.payload['annotation'] as Parameters<
          typeof store.addAnnotation
        >[0];
        if (annotation) store.addAnnotation(annotation);
        break;
      }
      case 'annotation_remove': {
        const id = msg.payload['annotationId'] as string;
        if (id) store.removeAnnotation(id);
        break;
      }
      case 'bookmark_add': {
        const bookmark = msg.payload['bookmark'] as Parameters<
          typeof store.addBookmark
        >[0];
        if (bookmark) store.addBookmark(bookmark);
        break;
      }
      case 'bookmark_remove': {
        const id = msg.payload['bookmarkId'] as string;
        if (id) store.removeBookmark(id);
        break;
      }
      case 'follow_user': {
        // No-op for remote messages (only affects the sender's local state)
        break;
      }
      default:
        break;
    }
  }
}
