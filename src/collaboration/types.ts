// ============================================================================
// Collaboration Types
// ============================================================================

export type ParticipantRole = 'owner' | 'editor' | 'viewer' | 'presenter';

export interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  role: ParticipantRole;
  color: string; // Unique cursor/highlight color
  joinedAt: number;
}

export interface PresenceState {
  participantId: string;
  cursor3D?: [number, number, number]; // Position in 3D universe
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  selectedEntityId?: string | null;
  focusedPlanetId?: string | null;
  isIdle: boolean;
  lastActiveAt: number;
}

export interface CollaborationSession {
  id: string;
  name: string;
  createdAt: number;
  ownerId: string;
  participants: Participant[];
  presenceStates: Record<string, PresenceState>;
  isActive: boolean;
}

export type SyncMessageType =
  | 'presence_update'
  | 'selection_change'
  | 'camera_sync'
  | 'annotation_add'
  | 'annotation_remove'
  | 'bookmark_add'
  | 'bookmark_remove'
  | 'investigation_update'
  | 'comment_add'
  | 'follow_user'
  | 'unfollow_user';

export interface SyncMessage {
  id: string;
  type: SyncMessageType;
  senderId: string;
  timestamp: number;
  payload: Record<string, unknown>;
  vectorClock: Record<string, number>;
}

export interface Annotation {
  id: string;
  authorId: string;
  entityId: string;
  text: string;
  position: [number, number, number];
  createdAt: number;
  color: string;
}

export interface Bookmark {
  id: string;
  authorId: string;
  entityId: string;
  label: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  createdAt: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  entityId?: string;
  parentId?: string; // For threaded replies
  createdAt: number;
}

export interface ActivityEvent {
  id: string;
  participantId: string;
  participantName: string;
  action: string;
  details: string;
  timestamp: number;
}
