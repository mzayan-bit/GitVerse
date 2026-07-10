'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useSceneStore } from '@/store/scene-store';

/**
 * Captures the Three.js scene reference and syncs it to the store.
 * Marks the scene as "ready" once mounted.
 * Must be a child of `<Canvas>`.
 */
function SceneManager() {
  const scene = useThree((s) => s.scene);
  const setScene = useSceneStore((s) => s.setScene);
  const setReady = useSceneStore((s) => s.setReady);
  const setLoading = useSceneStore((s) => s.setLoading);

  useEffect(() => {
    setScene(scene);
    setLoading(false);
    setReady(true);

    return () => {
      setScene(null);
      setReady(false);
    };
  }, [scene, setScene, setReady, setLoading]);

  return null;
}

export { SceneManager };
