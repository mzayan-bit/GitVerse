'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SceneCanvas } from '@/three';
import { RootScene } from '@/scene';
import {
  CameraController,
  SceneOrbitControls,
  StarManager,
  NebulaManager,
  DynamicEffectsManager,
} from '@/three';
import { NavigationCamera } from '@/three/Camera/NavigationCamera';
import { PerformanceManager } from '@/three';
import {
  PostProcessing,
  EnvironmentSetup,
  Lighting,
  SceneFog,
} from '@/effects';
import { SolarSystem } from '@/systems/SolarSystem';

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
              {/* Camera & Controls */}
              <CameraController />
              <SceneOrbitControls />
              <NavigationCamera />

              {/* Performance */}
              <PerformanceManager />

              {/* Environment & Lighting */}
              <EnvironmentSetup />
              <Lighting />
              <SceneFog />

              {/* Universe */}
              <StarManager />
              <NebulaManager />
              <DynamicEffectsManager />

              {/* Solar System */}
              <SolarSystem />

              {/* Post-Processing Pipeline */}
              <PostProcessing />

              {/* Empty space for future Universe/Planets */}
            </RootScene>
          </Suspense>
        </SceneCanvas>
      </ErrorBoundary>
    </div>
  );
}
