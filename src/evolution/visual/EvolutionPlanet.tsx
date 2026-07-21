'use client';

// ============================================================================
// Evolution Planet — Morphs based on evolution state
// ============================================================================

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEvolutionManager } from '../engine/EvolutionManager';
import { EvolutionInterpolator } from './EvolutionInterpolator';

/**
 * A planet that visually evolves based on the current timeline position.
 * - Radius changes with repo size
 * - Atmosphere intensity with activity level
 * - Surface color shifts with dominant language
 */
export function EvolutionPlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const { currentEntry, timeline } = useEvolutionManager();

  const radius = useMemo(() => {
    if (!currentEntry) return 2;
    return EvolutionInterpolator.filesToRadius(currentEntry.cumulativeFiles);
  }, [currentEntry]);

  const atmosphereColor = useMemo(() => {
    if (!currentEntry) return '#4f46e5';
    // Color based on how active this commit is
    const changeCount =
      currentEntry.filesAdded.length +
      currentEntry.filesRemoved.length +
      currentEntry.filesModified.length;

    if (changeCount > 20) return '#ef4444'; // Hot red for big changes
    if (changeCount > 10) return '#f97316'; // Orange for medium
    if (changeCount > 5) return '#eab308'; // Yellow for some
    return '#3b82f6'; // Cool blue for small/idle
  }, [currentEntry]);

  const progress = useMemo(() => {
    if (!timeline || timeline.entries.length === 0) return 0;
    const idx = currentEntry?.index ?? 0;
    return idx / Math.max(1, timeline.entries.length - 1);
  }, [timeline, currentEntry]);

  // Animate rotation and glow
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
    if (glowRef.current) {
      const pulse = Math.sin(Date.now() * 0.002) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(radius * 1.15 * pulse);
    }
  });

  if (!currentEntry) return null;

  return (
    <group>
      {/* Core planet */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[radius, 4]} />
        <meshStandardMaterial
          color={atmosphereColor}
          roughness={0.7}
          metalness={0.2}
          emissive={atmosphereColor}
          emissiveIntensity={0.15 + progress * 0.2}
        />
      </mesh>

      {/* Atmosphere shell */}
      <mesh ref={atmosphereRef} scale={radius * 1.08}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} scale={radius * 1.15}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
