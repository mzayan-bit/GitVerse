import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGraphManager } from '@/intelligence/KnowledgeGraph/GraphManager';
import { useEntityManager } from '@/entities/EntityManager';
import { RelationshipType } from '@/intelligence/KnowledgeGraph/RelationshipTypes';

const TYPE_COLORS: Record<RelationshipType, THREE.Color> = {
  [RelationshipType.SHARED_CONTRIBUTOR]: new THREE.Color('#4fd1c5'),
  [RelationshipType.SHARED_LANGUAGE]: new THREE.Color('#ecc94b'),
  [RelationshipType.SHARED_TOPIC]: new THREE.Color('#f687b3'),
  [RelationshipType.FORK_OF]: new THREE.Color('#9f7aea'),
  [RelationshipType.DEPENDENCY]: new THREE.Color('#f56565'),
  [RelationshipType.SIMILAR_ACTIVITY]: new THREE.Color('#4299e1'),
  [RelationshipType.SAME_OWNER]: new THREE.Color('#a0aec0'),
};

export function GraphEdges() {
  const { graph } = useGraphManager();
  const { entities } = useEntityManager();
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, colors } = useMemo(() => {
    if (!graph || graph.edges.length === 0)
      return { positions: new Float32Array(0), colors: new Float32Array(0) };

    const posArray: number[] = [];
    const colorArray: number[] = [];

    for (const edge of graph.edges) {
      const sourceEntity = entities[edge.sourceId];
      const targetEntity = entities[edge.targetId];

      if (
        sourceEntity?.transform?.position &&
        targetEntity?.transform?.position
      ) {
        // Source pos
        posArray.push(...sourceEntity.transform.position);
        // Target pos
        posArray.push(...targetEntity.transform.position);

        const color = TYPE_COLORS[edge.type] || new THREE.Color('#ffffff');

        // Add color for source vertex
        colorArray.push(color.r, color.g, color.b);
        // Add color for target vertex
        colorArray.push(color.r, color.g, color.b);
      }
    }

    return {
      positions: new Float32Array(posArray),
      colors: new Float32Array(colorArray),
    };
  }, [graph, entities]);

  useFrame(({ clock }) => {
    if (linesRef.current) {
      // Subtle pulse effect on opacity or material if needed
      const t = clock.getElapsedTime();
      (linesRef.current.material as THREE.LineBasicMaterial).opacity =
        0.15 + Math.sin(t * 2) * 0.05;
    }
  });

  if (positions.length === 0) return null;

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
