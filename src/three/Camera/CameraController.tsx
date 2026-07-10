/* eslint-disable react-hooks/immutability */
'use client';

import { PerspectiveCamera } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { CameraConfig } from '@/types/rendering';
import { DEFAULT_CAMERA_CONFIG } from '@/constants/rendering';
import { useSceneStore } from '@/store/scene-store';

interface CameraControllerProps {
  config?: Partial<CameraConfig>;
}

/**
 * Syncs the active R3F camera with the scene store and applies config.
 * Must be a child of `<Canvas>`.
 */
function CameraController({ config }: CameraControllerProps) {
  const camera = useThree((s) => s.camera);
  const setCamera = useSceneStore((s) => s.setCamera);

  const merged: CameraConfig = { ...DEFAULT_CAMERA_CONFIG, ...config };

  useEffect(() => {
    camera.position.set(...merged.position);

    if (camera instanceof PerspectiveCamera) {
      camera.fov = merged.fov;
      camera.near = merged.near;
      camera.far = merged.far;
      camera.updateProjectionMatrix();
    }

    setCamera(camera);

    return () => {
      setCamera(null);
    };
  }, [camera, setCamera, merged.fov, merged.near, merged.far, merged.position]);

  return null;
}

export { CameraController };
export type { CameraControllerProps };
