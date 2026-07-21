// ============================================================================
// Evolution Manager — Zustand store for playback state
// ============================================================================

import { create } from 'zustand';
import type { EvolutionTimeline, TimelineEntry } from './EvolutionTypes';
import type { RepositoryHistory } from '../history/HistoryTypes';

export type PlaybackSpeed = 0.5 | 1 | 2 | 5 | 10;

interface EvolutionStore {
  // --- State ---
  timeline: EvolutionTimeline | null;
  history: RepositoryHistory | null;
  currentIndex: number;
  isPlaying: boolean;
  playbackSpeed: PlaybackSpeed;
  selectedBranch: string | null;
  isLoading: boolean;
  error: string | null;

  // Derived (cached)
  currentEntry: TimelineEntry | null;

  // --- Actions ---
  setTimeline: (
    timeline: EvolutionTimeline,
    history: RepositoryHistory
  ) => void;
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  seekTo: (index: number) => void;
  seekToDate: (date: Date) => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  setBranch: (name: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useEvolutionManager = create<EvolutionStore>((set, get) => ({
  timeline: null,
  history: null,
  currentIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  selectedBranch: null,
  isLoading: false,
  error: null,
  currentEntry: null,

  setTimeline: (timeline, history) =>
    set({
      timeline,
      history,
      currentIndex: 0,
      isPlaying: false,
      currentEntry: timeline.entries[0] || null,
      error: null,
    }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  togglePlayback: () => {
    const state = get();
    if (state.isPlaying) {
      set({ isPlaying: false });
    } else {
      // If at end, restart from beginning
      if (
        state.timeline &&
        state.currentIndex >= state.timeline.entries.length - 1
      ) {
        set({
          currentIndex: 0,
          isPlaying: true,
          currentEntry: state.timeline.entries[0] || null,
        });
      } else {
        set({ isPlaying: true });
      }
    }
  },

  seekTo: (index) => {
    const state = get();
    if (!state.timeline) return;
    const clampedIndex = Math.max(
      0,
      Math.min(index, state.timeline.entries.length - 1)
    );
    set({
      currentIndex: clampedIndex,
      currentEntry: state.timeline.entries[clampedIndex] || null,
    });
  },

  seekToDate: (date) => {
    const state = get();
    if (!state.timeline) return;
    const targetMs = date.getTime();

    // Binary search
    const entries = state.timeline.entries;
    let low = 0;
    let high = entries.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midMs = new Date(entries[mid].date).getTime();
      if (midMs < targetMs) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const idx = Math.min(low, entries.length - 1);
    set({
      currentIndex: idx,
      currentEntry: entries[idx] || null,
    });
  },

  stepForward: () => {
    const state = get();
    if (!state.timeline) return;
    const next = Math.min(
      state.currentIndex + 1,
      state.timeline.entries.length - 1
    );
    set({
      currentIndex: next,
      currentEntry: state.timeline.entries[next] || null,
    });
  },

  stepBackward: () => {
    const state = get();
    if (!state.timeline) return;
    const prev = Math.max(state.currentIndex - 1, 0);
    set({
      currentIndex: prev,
      currentEntry: state.timeline.entries[prev] || null,
    });
  },

  setSpeed: (speed) => set({ playbackSpeed: speed }),
  setBranch: (name) => set({ selectedBranch: name }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      timeline: null,
      history: null,
      currentIndex: 0,
      isPlaying: false,
      playbackSpeed: 1,
      selectedBranch: null,
      isLoading: false,
      error: null,
      currentEntry: null,
    }),
}));
