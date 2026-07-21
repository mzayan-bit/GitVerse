'use client';

// ============================================================================
// Evolution Visualizer — R3F component for the evolving repository city
// ============================================================================
// Renders the current evolution snapshot as a city layout.
// New buildings fade in, removed buildings fade out, everything interpolates.
// ============================================================================

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEvolutionManager } from '../engine/EvolutionManager';
import { EvolutionPlanet } from './EvolutionPlanet';

// Simple seeded color for file extensions
const EXT_COLORS: Record<string, string> = {
  ts: '#3178c6',
  tsx: '#3178c6',
  js: '#f7df1e',
  jsx: '#f7df1e',
  py: '#3572a5',
  rs: '#dea584',
  go: '#00add8',
  java: '#b07219',
  css: '#563d7c',
  html: '#e34c26',
  md: '#083fa1',
  json: '#292929',
  yaml: '#cb171e',
  sh: '#89e051',
};

function getColorForFile(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  return EXT_COLORS[ext] || '#6b7280';
}

/**
 * Renders the evolving city based on the current timeline entry.
 * Each file in the snapshot becomes a building.
 */
export function EvolutionVisualizer() {
  const { currentEntry, timeline, isPlaying, playbackSpeed } =
    useEvolutionManager();

  const groupRef = useRef<THREE.Group>(null);
  const playbackTimerRef = useRef(0);

  // Auto-advance playback
  useFrame((_, delta) => {
    if (!isPlaying || !timeline) return;

    playbackTimerRef.current += delta * playbackSpeed;

    // Advance every 0.5 seconds (adjusted by speed)
    if (playbackTimerRef.current >= 0.5) {
      playbackTimerRef.current = 0;
      useEvolutionManager.getState().stepForward();

      // Stop at end
      const state = useEvolutionManager.getState();
      if (
        state.timeline &&
        state.currentIndex >= state.timeline.entries.length - 1
      ) {
        useEvolutionManager.getState().pause();
      }
    }
  });

  // Build the file positions from the current cumulative state
  const buildings = useMemo(() => {
    if (!currentEntry || !timeline) return [];

    // Collect all files that exist at this point
    // We reconstruct by replaying filesAdded/filesRemoved up to currentIndex
    const fileSet = new Set<string>();

    for (let i = 0; i <= currentEntry.index; i++) {
      const entry = timeline.entries[i];
      for (const f of entry.filesAdded) fileSet.add(f);
      for (const f of entry.filesRemoved) fileSet.delete(f);
    }

    // Layout files in a grid
    const files = Array.from(fileSet);
    const cols = Math.max(1, Math.ceil(Math.sqrt(files.length)));
    const spacing = 3;

    return files.map((path, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const x = (col - cols / 2) * spacing;
      const z = (row - cols / 2) * spacing;

      // Height based on file path depth (deeper = taller)
      const depth = path.split('/').length;
      const height = 1 + depth * 0.8;

      const color = getColorForFile(path);

      // Check if this file was just added in the current entry
      const isNew = currentEntry.filesAdded.includes(path);

      return { path, x, z, height, color, isNew };
    });
  }, [currentEntry, timeline]);

  if (!currentEntry) return null;

  return (
    <group ref={groupRef}>
      {/* Evolution planet at center */}
      <group position={[0, 15, 0]}>
        <EvolutionPlanet />
      </group>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#0a0a0f"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper
        args={[200, 40, '#1a1a2e', '#1a1a2e']}
        position={[0, -0.49, 0]}
      />

      {/* File buildings */}
      {buildings.map((b) => (
        <group key={b.path} position={[b.x, b.height / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, b.height, 2]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.4}
              metalness={0.6}
              emissive={b.color}
              emissiveIntensity={b.isNew ? 0.5 : 0.1}
              transparent
              opacity={b.isNew ? 0.85 : 1}
            />
          </mesh>

          {/* Glow cap on new buildings */}
          {b.isNew && (
            <mesh position={[0, b.height / 2 + 0.2, 0]}>
              <boxGeometry args={[2.2, 0.1, 2.2]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      ))}

      {/* Lighting for the evolution scene */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[50, 100, 50]} intensity={0.5} castShadow />
      <pointLight
        position={[0, 30, 0]}
        color="#6366f1"
        intensity={0.3}
        distance={100}
      />
    </group>
  );
}
