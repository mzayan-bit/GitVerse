'use client';

import { Canvas as R3FCanvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import type { RendererConfig, CameraConfig } from '@/types/rendering';
import {
  DEFAULT_RENDERER_CONFIG,
  DEFAULT_CAMERA_CONFIG,
} from '@/constants/rendering';

interface SceneCanvasProps {
  children: React.ReactNode;
  /** Override renderer defaults */
  renderer?: Partial<RendererConfig>;
  /** Override camera defaults */
  camera?: Partial<CameraConfig>;
  /** Additional className for the canvas container */
  className?: string;
  /** Additional inline style for the canvas container */
  style?: React.CSSProperties;
}

/**
 * Pre-configured Three.js Canvas wrapper.
 * Handles DPR, color management, and provides a consistent rendering surface.
 */
function SceneCanvas({
  children,
  renderer,
  camera,
  className,
  style,
}: SceneCanvasProps) {
  const rendererConfig: RendererConfig = {
    ...DEFAULT_RENDERER_CONFIG,
    ...renderer,
  };
  const cameraConfig: CameraConfig = { ...DEFAULT_CAMERA_CONFIG, ...camera };

  return (
    <R3FCanvas
      dpr={rendererConfig.dpr}
      gl={{
        antialias: rendererConfig.antialias,
        powerPreference: rendererConfig.powerPreference,
        alpha: true,
      }}
      camera={{
        fov: cameraConfig.fov,
        near: cameraConfig.near,
        far: cameraConfig.far,
        position: cameraConfig.position,
      }}
      flat={rendererConfig.flat}
      linear={rendererConfig.linear}
      shadows={rendererConfig.shadows}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {children}
      <Preload all />
    </R3FCanvas>
  );
}

export { SceneCanvas };
export type { SceneCanvasProps };
