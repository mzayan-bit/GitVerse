'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SceneCanvas } from '@/three';
import { RootScene } from '@/scene';
import {
  CameraController,
  StarManager,
  NebulaManager,
  DynamicEffectsManager,
} from '@/three';
import { PerformanceManager } from '@/three';
import { EnvironmentSetup, Lighting, SceneFog } from '@/effects';
import { CinematicPostProcessing } from '@/rendering/effects/CinematicPostProcessing';
import { ThemeController } from '@/rendering/themes/ThemeController';
import { UniverseAnimationController } from '@/engine/motion/universe/UniverseAnimationController';
import { SolarSystem } from '@/systems/SolarSystem';
import { Galaxy } from '@/galaxy/Galaxy';
import { useGalaxyManager } from '@/galaxy/GalaxyManager';
import { UniverseRenderer, useUniverseManager } from '@/universe';
import { RepositorySceneRenderer } from '@/repository-scene/RepositorySceneRenderer';
import { UnifiedCameraSystem } from '@/navigation/camera/UnifiedCameraSystem';
import { InteractionEffects } from '@/navigation/interaction/InteractionEffects';
import { AdaptivePerformanceManager } from '@/rendering/optimization/AdaptivePerformanceManager';
import { ProceduralSpaceEnvironment } from '@/rendering/environment';
import { UniverseStreamingEngine } from '@/rendering/optimization/UniverseStreamingEngine';

function ActiveSolarSystemWrapper() {
  const { focusedSystemId, galaxyConfig } = useGalaxyManager();

  if (!focusedSystemId || !galaxyConfig) return null;

  const sysNode = galaxyConfig.systems.find((s) => s.id === focusedSystemId);
  if (!sysNode) return null;

  return (
    <group position={sysNode.position}>
      <SolarSystem />
    </group>
  );
}

function ProceduralBackground() {
  const { isBuilt } = useUniverseManager();

  if (isBuilt) return null;

  return (
    <group>
      <Galaxy />
      <ActiveSolarSystemWrapper />
    </group>
  );
}

/**
 * The main 3D visualization canvas.
 * This file is dynamically imported with SSR disabled in the page component.
 */
export default function GitVerseCanvas() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-black">
      <ErrorBoundary
        fallback={
          <div className="flex h-full items-center justify-center text-white">
            Rendering Error
          </div>
        }
      >
        <SceneCanvas>
          <Suspense fallback={null}>
            <RootScene>
              {/* Camera — Single unified controller (replaces 3 competing systems) */}
              <CameraController />
              <UnifiedCameraSystem />

              {/* Performance */}
              <PerformanceManager />
              <AdaptivePerformanceManager />

              {/* Theme Engine & Motion Systems */}
              <ThemeController />
              <UniverseAnimationController />

              {/* Environment & Lighting */}
              <EnvironmentSetup />
              <Lighting />
              <SceneFog />

              {/* Procedural Space Environment & World Systems */}
              <ProceduralSpaceEnvironment />

              {/* Universe */}
              <StarManager />
              <NebulaManager />
              <DynamicEffectsManager />

              {/* Procedural Universe Streaming & LOD Engine */}
              <UniverseStreamingEngine />

              {/* Galaxy Engine (Procedural Demo) */}
              <ProceduralBackground />

              {/* Live GitHub Universe Engine */}
              <UniverseRenderer />

              {/* Repository Surface Engine */}
              <RepositorySceneRenderer />

              {/* Interaction Effects */}
              <InteractionEffects />

              {/* Post-Processing Pipeline */}
              <CinematicPostProcessing />
            </RootScene>
          </Suspense>
        </SceneCanvas>
      </ErrorBoundary>
    </div>
  );
}
