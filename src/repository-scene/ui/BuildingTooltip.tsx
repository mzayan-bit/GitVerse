'use client';

import { useRepositoryScene } from '../SceneManager';
import { CityLayout } from '../terrain/TerrainTypes';

interface BuildingTooltipProps {
  layout: CityLayout;
}

/**
 * Floating tooltip that appears when hovering over a building.
 */
export function BuildingTooltip({ layout }: BuildingTooltipProps) {
  const { mode, hoveredBuildingId } = useRepositoryScene();

  if (mode !== 'exploring' || !hoveredBuildingId) return null;

  const building = layout.allBuildings.find((b) => b.id === hoveredBuildingId);
  if (!building) return null;

  return (
    <div className="fixed top-20 right-6 z-50 pointer-events-none font-sans">
      <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl min-w-[200px]">
        <div className="text-sm font-medium text-white/90 mb-1">
          {building.fileName}
        </div>
        <div className="text-[10px] text-white/40 font-mono mb-2">
          {building.filePath}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/50">
          <span>{(building.sizeBytes / 1024).toFixed(1)} KB</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/60 font-mono">
            .{building.extension}
          </span>
        </div>
      </div>
    </div>
  );
}
