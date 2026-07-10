// Canvas
export { SceneCanvas } from './Canvas';
export type { SceneCanvasProps } from './Canvas';

// Scene Manager
export { SceneManager } from './SceneManager';

// Camera
export { CameraController, SceneOrbitControls } from './Camera';
export type { CameraControllerProps, SceneOrbitControlsProps } from './Camera';

// Renderer
export { RendererSetup } from './Renderer';
export type { RendererSetupProps } from './Renderer';

// Stars
export { StarManager } from './Stars';

// Performance
export { PerformanceManager } from './Performance';
export type { PerformanceManagerProps } from './Performance';

// Hooks
export {
  usePerformanceData,
  usePerformanceTier,
  useSceneReady,
  useSceneLoading,
  useDebugMode,
} from './Hooks';
