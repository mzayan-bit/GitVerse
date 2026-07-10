'use client';

import { createContext, useContext } from 'react';
import type { SceneState, SceneActions } from '@/types/rendering';

type SceneContextValue = SceneState & SceneActions;

const SceneContext = createContext<SceneContextValue | null>(null);

/**
 * Hook to consume the SceneContext.
 * Throws if called outside a SceneProvider.
 */
function useSceneContext(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) {
    throw new Error('useSceneContext must be used within a <SceneProvider>');
  }
  return ctx;
}

export { SceneContext, useSceneContext };
export type { SceneContextValue };
