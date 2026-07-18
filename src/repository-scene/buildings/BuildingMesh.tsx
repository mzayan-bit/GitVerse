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

  // Window texture
  const windowTexture = useMemo(() => {
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
        // Some windows are lit, some dark
        const lit = ((r * wCols + c) * 7 + config.id.charCodeAt(0)) % 3 !== 0;
        ctx.fillStyle = lit ? style.emissiveColor : 'rgba(0,0,0,0.3)';
        ctx.fillRect(wx, wy, wWidth * 0.8, wHeight * 0.8);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, [style, config.id]);

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
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[config.width, config.height, config.depth]} />
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
        <mesh position={[0, config.height / 2 + 0.5, 0]} castShadow>
          <boxGeometry args={[config.width * 0.6, 1, config.depth * 0.6]} />
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
          <cylinderGeometry args={[0.05, 0.05, 4, 4]} />
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
        >
          <ringGeometry
            args={[
              Math.max(config.width, config.depth) * 0.6,
              Math.max(config.width, config.depth) * 0.8,
              16,
            ]}
          />
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
