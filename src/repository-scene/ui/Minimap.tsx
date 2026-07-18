'use client';

import { useMemo } from 'react';
import { useRepositoryScene } from '../SceneManager';
import { CityLayout } from '../terrain/TerrainTypes';

interface MinimapProps {
  layout: CityLayout;
}

/**
 * A 2D birds-eye minimap of the city layout.
 * Shows district positions as colored dots and highlights current path.
 */
export function Minimap({ layout }: MinimapProps) {
  const { mode, currentPath } = useRepositoryScene();

  const mapData = useMemo(() => {
    if (!layout) return null;

    const scale = 100 / (layout.groundRadius * 2);
    const offset = 50; // center of the minimap

    const districts = layout.districts.map((d) => ({
      id: d.id,
      name: d.name,
      x: d.position[0] * scale + offset,
      y: d.position[2] * scale + offset,
      radius: Math.max(3, d.radius * scale),
      color: d.color,
      isActive:
        currentPath.fullPath === d.path ||
        currentPath.fullPath.startsWith(d.path + '/'),
    }));

    return { districts };
  }, [layout, currentPath]);

  if (mode !== 'exploring' || !mapData) return null;

  return (
    <div className="absolute bottom-6 right-6 z-40 pointer-events-auto font-sans">
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl">
        <div className="text-[9px] uppercase tracking-widest text-white/40 font-semibold mb-2">
          Minimap
        </div>
        <svg
          width={100}
          height={100}
          viewBox="0 0 100 100"
          className="rounded-lg bg-black/30"
        >
          {/* Grid */}
          <line
            x1={50}
            y1={0}
            x2={50}
            y2={100}
            stroke="rgba(255,255,255,0.05)"
          />
          <line
            x1={0}
            y1={50}
            x2={100}
            y2={50}
            stroke="rgba(255,255,255,0.05)"
          />

          {/* Districts */}
          {mapData.districts.map((d) => (
            <circle
              key={d.id}
              cx={d.x}
              cy={d.y}
              r={d.radius}
              fill={d.color}
              opacity={d.isActive ? 0.8 : 0.25}
              stroke={d.isActive ? '#ffffff' : 'none'}
              strokeWidth={d.isActive ? 1 : 0}
            />
          ))}

          {/* Center marker */}
          <circle cx={50} cy={50} r={1.5} fill="#ffffff" opacity={0.5} />
        </svg>
      </div>
    </div>
  );
}
