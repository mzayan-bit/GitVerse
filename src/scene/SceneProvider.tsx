'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Camera, Scene, WebGLRenderer } from 'three';
import { SceneContext } from './SceneContext';
import type { SceneState } from '@/types/rendering';

interface SceneProviderProps {
  children: ReactNode;
}

/**
 * Provides scene state to the React tree via context.
 * Wrap this around the section of your app that needs access.
 */
function SceneProvider({ children }: SceneProviderProps) {
  const [state, setState] = useState<SceneState>({
    isReady: false,
    isLoading: true,
    error: null,
    scene: null,
    camera: null,
    renderer: null,
  });

  const setReady = useCallback(
    (ready: boolean) => setState((s) => ({ ...s, isReady: ready })),
    []
  );
  const setLoading = useCallback(
    (loading: boolean) => setState((s) => ({ ...s, isLoading: loading })),
    []
  );
  const setError = useCallback(
    (error: string | null) => setState((s) => ({ ...s, error })),
    []
  );
  const setScene = useCallback(
    (scene: Scene | null) => setState((s) => ({ ...s, scene })),
    []
  );
  const setCamera = useCallback(
    (camera: Camera | null) => setState((s) => ({ ...s, camera })),
    []
  );
  const setRenderer = useCallback(
    (renderer: WebGLRenderer | null) => setState((s) => ({ ...s, renderer })),
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      setReady,
      setLoading,
      setError,
      setScene,
      setCamera,
      setRenderer,
    }),
    [state, setReady, setLoading, setError, setScene, setCamera, setRenderer]
  );

  return (
    <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
  );
}

export { SceneProvider };
