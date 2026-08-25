import { CameraMode } from '@/navigation/camera/CameraRig';

export interface MovementPresetConfig {
  mode: CameraMode;
  acceleration: number;
  maxSpeed: number;
  damping: number;
  rotationalDamping: number;
  inertiaFactor: number;
  minDistance: number;
  maxDistance: number;
  mouseSensitivity: number;
  trackpadSensitivity: number;
  collisionRadius: number;
  springStiffness: number;
}

export const MOVEMENT_PRESETS: Record<CameraMode, MovementPresetConfig> = {
  orbit: {
    mode: 'orbit',
    acceleration: 100,
    maxSpeed: 800,
    damping: 0.35,
    rotationalDamping: 0.88,
    inertiaFactor: 0.95,
    minDistance: 10,
    maxDistance: 15000,
    mouseSensitivity: 0.003,
    trackpadSensitivity: 0.015,
    collisionRadius: 15,
    springStiffness: 12,
  },
  fly: {
    mode: 'fly',
    acceleration: 250,
    maxSpeed: 1200,
    damping: 0.94,
    rotationalDamping: 0.9,
    inertiaFactor: 0.98,
    minDistance: 5,
    maxDistance: 30000,
    mouseSensitivity: 0.002,
    trackpadSensitivity: 0.001,
    collisionRadius: 10,
    springStiffness: 16,
  },
  explore: {
    mode: 'explore',
    acceleration: 180,
    maxSpeed: 900,
    damping: 0.91,
    rotationalDamping: 0.89,
    inertiaFactor: 0.94,
    minDistance: 5,
    maxDistance: 20000,
    mouseSensitivity: 0.0025,
    trackpadSensitivity: 0.0012,
    collisionRadius: 12,
    springStiffness: 14,
  },
  focus: {
    mode: 'focus',
    acceleration: 120,
    maxSpeed: 600,
    damping: 0.88,
    rotationalDamping: 0.85,
    inertiaFactor: 0.9,
    minDistance: 2,
    maxDistance: 5000,
    mouseSensitivity: 0.002,
    trackpadSensitivity: 0.001,
    collisionRadius: 8,
    springStiffness: 20,
  },
  presentation: {
    mode: 'presentation',
    acceleration: 60,
    maxSpeed: 400,
    damping: 0.96,
    rotationalDamping: 0.95,
    inertiaFactor: 0.99,
    minDistance: 20,
    maxDistance: 25000,
    mouseSensitivity: 0.001,
    trackpadSensitivity: 0.0005,
    collisionRadius: 25,
    springStiffness: 8,
  },
  firstPerson: {
    mode: 'firstPerson',
    acceleration: 300,
    maxSpeed: 1000,
    damping: 0.85,
    rotationalDamping: 0.82,
    inertiaFactor: 0.85,
    minDistance: 2,
    maxDistance: 10000,
    mouseSensitivity: 0.0035,
    trackpadSensitivity: 0.0018,
    collisionRadius: 5,
    springStiffness: 24,
  },
};
