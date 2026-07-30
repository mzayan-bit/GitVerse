import { create } from 'zustand';
import * as THREE from 'three';

// ── Camera Modes ──────────────────────────────────────────────────────
export type CameraMode =
  'orbit' | 'fly' | 'explore' | 'focus' | 'presentation' | 'firstPerson';

// ── Camera Bookmark ───────────────────────────────────────────────────
export interface CameraBookmark {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  mode: CameraMode;
  createdAt: number;
}

// ── Camera Rig State ──────────────────────────────────────────────────
export interface CameraRigState {
  // Current interpolated state
  position: THREE.Vector3;
  target: THREE.Vector3;
  velocity: THREE.Vector3;
  up: THREE.Vector3;

  // Goal state (what we're interpolating towards)
  goalPosition: THREE.Vector3;
  goalTarget: THREE.Vector3;

  // Physics
  momentum: THREE.Vector3;
  damping: number;
  acceleration: number;
  maxSpeed: number;
  speedMultiplier: number; // Shift boost

  // Mode
  mode: CameraMode;
  isTransitioning: boolean;
  transitionProgress: number;

  // Constraints
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;

  // Bookmarks
  bookmarks: CameraBookmark[];
  focusHistory: Array<{ entityId: string; timestamp: number }>;
}

// ── Store ─────────────────────────────────────────────────────────────
interface CameraStore extends CameraRigState {
  setMode: (mode: CameraMode) => void;
  setGoal: (position: THREE.Vector3, target: THREE.Vector3) => void;
  setGoalArrays: (
    position: [number, number, number],
    target: [number, number, number]
  ) => void;
  applyImpulse: (impulse: THREE.Vector3) => void;
  setSpeedMultiplier: (mult: number) => void;
  setDamping: (d: number) => void;
  addBookmark: (label: string) => void;
  removeBookmark: (id: string) => void;
  goToBookmark: (id: string) => void;
  pushFocusHistory: (entityId: string) => void;
  resetCamera: () => void;
}

const DEFAULT_POSITION = new THREE.Vector3(0, 400, 1000);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

export const useCameraRig = create<CameraStore>((set, get) => ({
  position: DEFAULT_POSITION.clone(),
  target: DEFAULT_TARGET.clone(),
  velocity: new THREE.Vector3(),
  up: new THREE.Vector3(0, 1, 0),

  goalPosition: DEFAULT_POSITION.clone(),
  goalTarget: DEFAULT_TARGET.clone(),

  momentum: new THREE.Vector3(),
  damping: 0.92,
  acceleration: 80,
  maxSpeed: 500,
  speedMultiplier: 1,

  mode: 'orbit',
  isTransitioning: false,
  transitionProgress: 0,

  minDistance: 5,
  maxDistance: 50000,
  minPolarAngle: 0.1,
  maxPolarAngle: Math.PI - 0.1,

  bookmarks: [],
  focusHistory: [],

  setMode: (mode) =>
    set({ mode, isTransitioning: true, transitionProgress: 0 }),

  setGoal: (position, target) =>
    set({
      goalPosition: position.clone(),
      goalTarget: target.clone(),
      isTransitioning: true,
      transitionProgress: 0,
    }),

  setGoalArrays: (position, target) =>
    set({
      goalPosition: new THREE.Vector3(...position),
      goalTarget: new THREE.Vector3(...target),
      isTransitioning: true,
      transitionProgress: 0,
    }),

  applyImpulse: (impulse) => {
    const s = get();
    const newMomentum = s.momentum.clone().add(impulse);
    // Clamp to max speed
    if (newMomentum.length() > s.maxSpeed * s.speedMultiplier) {
      newMomentum.normalize().multiplyScalar(s.maxSpeed * s.speedMultiplier);
    }
    set({ momentum: newMomentum });
  },

  setSpeedMultiplier: (mult) => set({ speedMultiplier: mult }),
  setDamping: (d) => set({ damping: d }),

  addBookmark: (label) => {
    const s = get();
    set({
      bookmarks: [
        ...s.bookmarks,
        {
          id: crypto.randomUUID(),
          label,
          position: s.position.toArray() as [number, number, number],
          target: s.target.toArray() as [number, number, number],
          mode: s.mode,
          createdAt: Date.now(),
        },
      ],
    });
  },

  removeBookmark: (id) =>
    set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),

  goToBookmark: (id) => {
    const s = get();
    const bk = s.bookmarks.find((b) => b.id === id);
    if (!bk) return;
    set({
      goalPosition: new THREE.Vector3(...bk.position),
      goalTarget: new THREE.Vector3(...bk.target),
      mode: bk.mode,
      isTransitioning: true,
      transitionProgress: 0,
    });
  },

  pushFocusHistory: (entityId) =>
    set((s) => ({
      focusHistory: [
        ...s.focusHistory.slice(-19),
        { entityId, timestamp: Date.now() },
      ],
    })),

  resetCamera: () =>
    set({
      goalPosition: DEFAULT_POSITION.clone(),
      goalTarget: DEFAULT_TARGET.clone(),
      mode: 'orbit',
      momentum: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      isTransitioning: true,
      transitionProgress: 0,
    }),
}));
