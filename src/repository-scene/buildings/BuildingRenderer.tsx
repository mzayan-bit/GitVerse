'use client';

import { useMemo } from 'react';
import { CityLayout } from '../terrain/TerrainTypes';
import { BuildingFactory } from './BuildingFactory';
import { BuildingMesh } from './BuildingMesh';
import { BuildingConfig } from './BuildingTypes';

interface BuildingRendererProps {
  layout: CityLayout;
  currentPath: string;
}

/**
 * Renders all buildings in the city layout.
 * Filters to show only the current directory's buildings when navigated deep.
 */
export function BuildingRenderer({
  layout,
  currentPath,
}: BuildingRendererProps) {
  const buildingConfigs = useMemo(() => {
    const configs: BuildingConfig[] = [];

    // If we have a current path, only show buildings in that district/block
    const relevantBuildings = currentPath
      ? layout.allBuildings.filter(
          (b) =>
            b.filePath.startsWith(currentPath + '/') ||
            b.filePath === currentPath
        )
      : layout.allBuildings;

    for (const slot of relevantBuildings) {
      configs.push(BuildingFactory.createConfig(slot));
    }

    return configs;
  }, [layout, currentPath]);

  return (
    <group>
      {buildingConfigs.map((config) => (
        <BuildingMesh key={config.id} config={config} />
      ))}
    </group>
  );
}
