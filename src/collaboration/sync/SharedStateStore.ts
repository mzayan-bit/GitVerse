import { create } from 'zustand';
import { Annotation, Bookmark, PresenceState } from '../types';

interface SharedState {
  // Other participants' presence
  remotePresence: Record<string, PresenceState>;

  // Shared annotations on entities
  annotations: Annotation[];

  // Shared bookmarks
  bookmarks: Bookmark[];

  // Who the local user is following (camera sync)
  followingUserId: string | null;

  // Observation mode (read-only, no interactions)
  isObserving: boolean;

  // Actions
  setRemotePresence: (states: Record<string, PresenceState>) => void;
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (id: string) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  followUser: (userId: string | null) => void;
  setObserving: (value: boolean) => void;
}

export const useSharedState = create<SharedState>((set) => ({
  remotePresence: {},
  annotations: [],
  bookmarks: [],
  followingUserId: null,
  isObserving: false,

  setRemotePresence: (states) => set({ remotePresence: states }),

  addAnnotation: (annotation) =>
    set((s) => ({ annotations: [...s.annotations, annotation] })),

  removeAnnotation: (id) =>
    set((s) => ({ annotations: s.annotations.filter((a) => a.id !== id) })),

  addBookmark: (bookmark) =>
    set((s) => ({ bookmarks: [...s.bookmarks, bookmark] })),

  removeBookmark: (id) =>
    set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),

  followUser: (userId) => set({ followingUserId: userId }),

  setObserving: (value) => set({ isObserving: value }),
}));
