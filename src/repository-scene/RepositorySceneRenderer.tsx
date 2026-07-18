'use client';

import { useMemo } from 'react';
import { useRepositoryScene } from './SceneManager';
import { SceneLoader } from './SceneLoader';
import { TerrainGenerator } from './terrain/TerrainGenerator';
import { GroundPlane } from './terrain/GroundPlane';
import { BuildingRenderer } from './buildings/BuildingRenderer';
import { RepositoryCamera } from './RepositoryCamera';
import { SceneTransition } from './SceneTransition';
import { Html } from '@react-three/drei';
import { RepositoryExplorerHUD } from './ui/RepositoryExplorerHUD';
import { BuildingTooltip } from './ui/BuildingTooltip';
import { Minimap } from './ui/Minimap';

/**
 * The main 3D renderer for the repository exploration scene.
 * Generates terrain and buildings from the active repository,
 * and manages camera + transitions.
 *
 * This component lives INSIDE the R3F Canvas.
 */
export function RepositorySceneRenderer() {
  const { mode, activeRepository, currentPath } = useRepositoryScene();

  // Generate the file tree and city layout once for the active repository
  const cityLayout = useMemo(() => {
    if (!activeRepository) return null;

    const fileTree = SceneLoader.generateFileTree(activeRepository);
    return TerrainGenerator.generate(fileTree, activeRepository.id);
  }, [activeRepository]);

  return (
    <group>
      {/* Always render the transition handler */}
      <SceneTransition />

      {/* Only render the city when exploring or entering */}
      {(mode === 'exploring' || mode === 'entering') && cityLayout && (
        <group>
          {/* Ground plane with grid and district markers */}
          <GroundPlane layout={cityLayout} />

          {/* All buildings */}
          <BuildingRenderer
            layout={cityLayout}
            currentPath={currentPath.fullPath}
          />

          {/* Repository-specific camera */}
          <RepositoryCamera layout={cityLayout} />

          {/* Ambient lighting for the city */}
          <ambientLight intensity={0.15} />
          <directionalLight
            position={[100, 200, 100]}
            intensity={0.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight
            position={[0, 50, 0]}
            color="#3b82f6"
            intensity={0.4}
            distance={300}
          />

          {/* UI Overlays */}
          {mode === 'exploring' && (
            <Html fullscreen style={{ pointerEvents: 'none' }}>
              <RepositoryExplorerHUD />
              <BuildingTooltip layout={cityLayout} />
              <Minimap layout={cityLayout} />
            </Html>
          )}
        </group>
      )}
    </group>
  );
}
