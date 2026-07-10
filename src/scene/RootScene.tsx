'use client';

import { SceneManager } from '@/three/SceneManager';
import { RendererSetup } from '@/three/Renderer';
import type { RendererConfig } from '@/types/rendering';

interface RootSceneProps {
  children?: React.ReactNode;
  /** Override renderer defaults */
  renderer?: Partial<RendererConfig>;
}

/**
 * The root scene that should be placed directly inside `<SceneCanvas>`.
 *
 * Responsibilities:
 *  - Wires SceneManager (syncs scene ref to store)
 *  - Applies renderer configuration
 *  - Serves as the mount point for all future scene children
 *    (environment, planets, effects, etc.)
 */
function RootScene({ children, renderer }: RootSceneProps) {
  return (
    <>
      <SceneManager />
      <RendererSetup config={renderer} />
      {children}
    </>
  );
}

export { RootScene };
export type { RootSceneProps };
