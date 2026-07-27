import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraRig, CameraMode } from './CameraRig';
import { useRepositoryScene } from '@/repository-scene/SceneManager';
import { useUniverseManager } from '@/universe/UniverseManager';
import { useEntityManager } from '@/entities/EntityManager';
import { useSolarSystemManager } from '@/systems/SolarSystem/SolarSystemManager';
import { useGalaxyManager } from '@/galaxy/GalaxyManager';
import { OrbitMechanics } from '@/systems/SolarSystem/OrbitMechanics';
import { MappedVisualProperties } from '@/mapping/MappingEngine';
import { MovementController } from '@/engine/navigation/MovementController';

/**
 * UnifiedCameraSystem — The SINGLE authority over camera position.
 *
 * Replaces the 3 competing controllers (NavigationCamera, PremiumCameraController,
 * SceneOrbitControls) with one consolidated system.
 *
 * Architecture:
 *   CameraRig store (Zustand) = single source of truth for position/target
 *   MovementController = reads input, writes to CameraRig store
 *   This component = reads CameraRig store, applies to Three.js camera with smoothing
 *
 * Mode pipeline:
 *   orbit   → OrbitController handles pointer drag + wheel zoom
 *   fly     → FlightController handles WASD + mouse look
 *   explore → FlightController (slower, more damped)
 *   focus   → Auto-transition to entity, then orbit around it
 *   firstPerson → FlightController (tight, fast)
 *   presentation → Slow cinematic auto-pan (future)
 */
export function UnifiedCameraSystem() {
  const { camera } = useThree();

  // External scene state
  const repoSceneMode = useRepositoryScene((s) => s.mode);
  const { isBuilt, cameraState: universeCameraState } = useUniverseManager();
  const { entities } = useEntityManager();
  const focusedPlanetId = useSolarSystemManager((s) => s.focusedPlanetId);
  const systemConfig = useSolarSystemManager((s) => s.systemConfig);
  const simulationSpeed = useSolarSystemManager((s) => s.simulationSpeed);
  const {
    cameraMode: galaxyCameraMode,
    focusedSystemId,
    galaxyConfig,
  } = useGalaxyManager();

  // Smooth interpolation refs (mutable per-frame, no re-renders)
  const smoothPos = useRef(new THREE.Vector3(0, 400, 800));
  const smoothTarget = useRef(new THREE.Vector3(0, 0, 0));
  const timeRef = useRef(0);
  const hasInitialized = useRef(false);

  // Initialize MovementController once
  useEffect(() => {
    const controller = MovementController.getInstance();
    controller.init();
    return () => {
      controller.destroy();
    };
  }, []);

  // Warp camera when universe is first built
  useEffect(() => {
    if (isBuilt && !hasInitialized.current) {
      const startPos = new THREE.Vector3(0, 400, 800);
      const startTarget = new THREE.Vector3(0, 0, 0);

      camera.position.copy(startPos);
      camera.lookAt(startTarget);
      smoothPos.current.copy(startPos);
      smoothTarget.current.copy(startTarget);

      useCameraRig.setState({
        position: startPos.clone(),
        target: startTarget.clone(),
        goalPosition: startPos.clone(),
        goalTarget: startTarget.clone(),
      });

      hasInitialized.current = true;
    }
  }, [isBuilt, camera]);

  useFrame((_, rawDelta) => {
    // Clamp delta to avoid huge jumps on tab-switch
    const delta = Math.min(rawDelta, 0.05);

    // ── Yield when repository scene is active ────────────────────────
    if (repoSceneMode !== 'idle') return;

    // ── Run MovementController physics (reads input, writes to CameraRig store)
    const controller = MovementController.getInstance();
    controller.update(delta);

    const state = useCameraRig.getState();
    const mode: CameraMode = state.mode;

    // ── Handle universe entity focus ─────────────────────────────────
    if (isBuilt) {
      if (
        universeCameraState.mode === 'focus' &&
        universeCameraState.targetId
      ) {
        const entity = entities[universeCameraState.targetId];
        if (entity && entity.transform?.position) {
          const [ex, ey, ez] = entity.transform.position;
          const entityPos = new THREE.Vector3(ex, ey, ez);

          let offsetDist = 50;
          if (entity.type === 'planet') {
            const r = entity.metadata?.visuals
              ? (entity.metadata.visuals as MappedVisualProperties).size
              : 2.0;
            offsetDist = r * 8 * 3;
          } else if (entity.type === 'solar_system') {
            offsetDist = 300;
          } else if (entity.type === 'galaxy') {
            offsetDist = 2000;
          }

          const goalPos = entityPos
            .clone()
            .add(new THREE.Vector3(offsetDist, offsetDist * 0.8, offsetDist));

          useCameraRig.setState({
            goalPosition: goalPos,
            goalTarget: entityPos.clone(),
            mode: 'focus',
          });
        }
      }
    }

    // ── Handle procedural demo navigation (galaxy/solar/planet follow) ──
    if (!isBuilt) {
      timeRef.current += delta * simulationSpeed;
      const basePosition = new THREE.Vector3(0, 0, 0);

      if (focusedSystemId && galaxyConfig) {
        const sysNode = galaxyConfig.systems.find(
          (s) => s.id === focusedSystemId
        );
        if (sysNode) {
          basePosition.set(
            sysNode.position[0],
            sysNode.position[1],
            sysNode.position[2]
          );
        }
      }

      if (galaxyCameraMode === 'galaxy-free') {
        useCameraRig.setState({
          goalTarget: new THREE.Vector3(0, 0, 0),
          goalPosition: new THREE.Vector3(0, 4000, 8000),
        });
      } else if (
        galaxyCameraMode === 'galaxy-follow' ||
        galaxyCameraMode === 'solar-system-free'
      ) {
        useCameraRig.setState({
          goalTarget: basePosition.clone(),
          goalPosition: basePosition.clone().add(new THREE.Vector3(0, 80, 250)),
        });
      } else if (
        galaxyCameraMode === 'planet-follow' &&
        focusedPlanetId &&
        systemConfig
      ) {
        const node = systemConfig.planets.find((p) => p.id === focusedPlanetId);
        if (node) {
          const planetPos = OrbitMechanics.getPositionAtTime(
            node.orbit,
            timeRef.current
          );
          const absolutePlanetPos = planetPos.clone().add(basePosition);
          const offset = new THREE.Vector3(
            node.planet.terrain.baseRadius * 3,
            node.planet.terrain.baseRadius * 2,
            node.planet.terrain.baseRadius * 3
          );
          useCameraRig.setState({
            goalTarget: absolutePlanetPos.clone(),
            goalPosition: absolutePlanetPos.clone().add(offset),
          });
        }
      }
    }

    // ── Apply momentum for fly/explore/firstPerson modes ─────────────
    if (mode === 'fly' || mode === 'explore' || mode === 'firstPerson') {
      const momentum = state.momentum;
      if (momentum.lengthSq() > 0.001) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        const right = new THREE.Vector3()
          .crossVectors(forward, camera.up)
          .normalize();
        const up = camera.up.clone();

        const worldImpulse = new THREE.Vector3()
          .addScaledVector(right, momentum.x * delta)
          .addScaledVector(up, momentum.y * delta)
          .addScaledVector(forward, momentum.z * delta);

        state.goalPosition.add(worldImpulse);
        state.goalTarget.add(worldImpulse);

        momentum.multiplyScalar(state.damping);
        if (momentum.lengthSq() < 0.01) {
          momentum.set(0, 0, 0);
        }
      }
    }

    // ── Smooth exponential interpolation ──────────────────────────────
    const posAlpha = 1 - Math.pow(0.001, delta * 3.0);
    const targetAlpha = 1 - Math.pow(0.001, delta * 4.0);

    smoothPos.current.lerp(state.goalPosition, posAlpha);
    smoothTarget.current.lerp(state.goalTarget, targetAlpha);

    // ── Apply to Three.js camera ─────────────────────────────────────
    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothTarget.current);

    // ── Write back to store (for UI like HUD/bookmarks) ──────────────
    state.position.copy(smoothPos.current);
    state.target.copy(smoothTarget.current);

    // ── Transition tracking ──────────────────────────────────────────
    if (state.isTransitioning) {
      const dist = smoothPos.current.distanceTo(state.goalPosition);
      if (dist < 0.5) {
        useCameraRig.setState({
          isTransitioning: false,
          transitionProgress: 1,
        });
      }
    }
  });

  return null;
}
