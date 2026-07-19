'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BuildingConfig } from './BuildingTypes';
import { useRepositoryScene } from '../SceneManager';

interface BuildingMeshProps {
  config: BuildingConfig;
}

/**
 * Global cache for building geometries and textures.
 * Crucial for preventing massive memory leaks and FPS drops with 5000+ files.
 */
const GLOBAL_BOX_GEO = new THREE.BoxGeometry(1, 1, 1);
const GLOBAL_CYLINDER_GEO = new THREE.CylinderGeometry(0.05, 0.05, 4, 4);
const GLOBAL_RING_GEO = new THREE.RingGeometry(1, 1.2, 16);

const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Renders a single procedural building with windows, emissive accents, and hover effects.
 */
export function BuildingMesh({ config }: BuildingMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { hoveredBuildingId } = useRepositoryScene();

  const isHovered = hoveredBuildingId === config.id;

  // Subtle breathing animation on hover
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = isHovered ? 1.05 : 1.0;
    const current = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(current, targetScale, delta * 8);
    groupRef.current.scale.setScalar(newScale);
  });

  const { style } = config;

  // Window texture (memoized globally per archetype to save memory on 5000+ files)
  const windowTexture = useMemo(() => {
    const cacheKey = `${style.archetype}_${style.baseColor}_${style.windowCols}_${style.windowRows}_${style.emissiveColor}`;
    if (textureCache.has(cacheKey)) {
      return textureCache.get(cacheKey)!;
    }

    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Building face
    ctx.fillStyle = style.baseColor;
    ctx.fillRect(0, 0, size, size);

    // Windows
    const wCols = style.windowCols;
    const wRows = style.windowRows;
    const wWidth = size / (wCols * 2 + 1);
    const wHeight = size / (wRows * 2 + 1);

    for (let r = 0; r < wRows; r++) {
      for (let c = 0; c < wCols; c++) {
        const wx = wWidth + c * wWidth * 2;
        const wy = wHeight + r * wHeight * 2;
        // Deterministic lit windows based on archetype
        const lit =
          ((r * wCols + c) * 7 + style.archetype.charCodeAt(0)) % 3 !== 0;
        ctx.fillStyle = lit ? style.emissiveColor : 'rgba(0,0,0,0.3)';
        ctx.fillRect(wx, wy, wWidth * 0.8, wHeight * 0.8);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    textureCache.set(cacheKey, tex);
    return tex;
  }, [
    style.archetype,
    style.baseColor,
    style.windowCols,
    style.windowRows,
    style.emissiveColor,
  ]);

  return (
    <group
      ref={groupRef}
      position={config.position}
      onClick={(e) => {
        e.stopPropagation();
        useRepositoryScene.getState().selectBuilding({
          id: config.id,
          fileName: config.fileName,
          filePath: config.filePath,
          extension: config.extension,
          sizeBytes: config.sizeBytes,
        });
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        useRepositoryScene.getState().setHoveredBuilding(config.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        useRepositoryScene.getState().setHoveredBuilding(null);
      }}
    >
      {/* Main building body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        scale={[config.width, config.height, config.depth]}
      >
        <primitive object={GLOBAL_BOX_GEO} attach="geometry" />
        <meshStandardMaterial
          map={windowTexture}
          color={isHovered ? style.accentColor : style.baseColor}
          emissive={style.emissiveColor}
          emissiveIntensity={
            isHovered ? style.emissiveIntensity * 3 : style.emissiveIntensity
          }
          metalness={style.metalness}
          roughness={style.roughness}
        />
      </mesh>

      {/* Roof detail */}
      {style.hasRoofDetail && (
        <mesh
          position={[0, config.height / 2 + 0.5, 0]}
          castShadow
          scale={[config.width * 0.6, 1, config.depth * 0.6]}
        >
          <primitive object={GLOBAL_BOX_GEO} attach="geometry" />
          <meshStandardMaterial
            color={style.accentColor}
            emissive={style.emissiveColor}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* Antenna */}
      {style.hasAntenna && (
        <mesh position={[0, config.height / 2 + 2, 0]}>
          <primitive object={GLOBAL_CYLINDER_GEO} attach="geometry" />
          <meshStandardMaterial
            color="#ffffff"
            emissive={style.emissiveColor}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Hover selection glow (ring at base) */}
      {isHovered && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -config.height / 2 + 0.1, 0]}
          scale={[
            Math.max(config.width, config.depth) * 0.6,
            Math.max(config.width, config.depth) * 0.6,
            1,
          ]}
        >
          <primitive object={GLOBAL_RING_GEO} attach="geometry" />
          <meshBasicMaterial
            color={style.accentColor}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}
