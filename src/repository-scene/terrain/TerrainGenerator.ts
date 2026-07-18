// ============================================================================
// Terrain Generator — Maps FileTree → CityLayout
// ============================================================================

import { FileNode } from '../SceneLoader';
import { CityLayout, District, CityBlock, BuildingSlot } from './TerrainTypes';

// Language → district color mapping
const LANGUAGE_DISTRICT_COLORS: Record<string, string> = {
  ts: '#3b82f6',
  tsx: '#60a5fa',
  js: '#f59e0b',
  jsx: '#fbbf24',
  py: '#10b981',
  rs: '#f97316',
  go: '#06b6d4',
  md: '#a78bfa',
  json: '#06b6d4',
  yaml: '#8b5cf6',
  yml: '#8b5cf6',
  css: '#ec4899',
  html: '#ef4444',
  sh: '#64748b',
  toml: '#f97316',
  lock: '#475569',
  txt: '#94a3b8',
};

function getDistrictColor(_dirName: string, files: FileNode[]): string {
  // Find dominant file extension in this directory tree
  const extCounts = new Map<string, number>();
  const countExtensions = (node: FileNode) => {
    if (node.type === 'file' && node.extension) {
      extCounts.set(node.extension, (extCounts.get(node.extension) || 0) + 1);
    }
    for (const child of node.children) {
      countExtensions(child);
    }
  };
  for (const f of files) countExtensions(f);

  let maxExt = '';
  let maxCount = 0;
  for (const [ext, count] of extCounts) {
    if (count > maxCount) {
      maxExt = ext;
      maxCount = count;
    }
  }
  return LANGUAGE_DISTRICT_COLORS[maxExt] || '#64748b';
}

export class TerrainGenerator {
  private static readonly CELL_SIZE = 4;
  private static readonly MAX_BUILDING_HEIGHT = 60;
  private static readonly MIN_BUILDING_HEIGHT = 2;

  /**
   * Converts a file tree into a 3D city layout.
   */
  public static generate(fileTree: FileNode, repoId: string): CityLayout {
    const districts: District[] = [];
    const allBuildings: BuildingSlot[] = [];

    // Top-level directories become districts
    const topDirs = fileTree.children.filter((c) => c.type === 'directory');
    const topFiles = fileTree.children.filter((c) => c.type === 'file');

    // Find max file size for height normalization
    let maxFileSize = 1;
    const findMax = (node: FileNode) => {
      if (node.type === 'file' && node.sizeBytes > maxFileSize) {
        maxFileSize = node.sizeBytes;
      }
      for (const child of node.children) findMax(child);
    };
    findMax(fileTree);

    // Lay out districts in a circle
    const numDistricts = topDirs.length + (topFiles.length > 0 ? 1 : 0);
    const districtRadius = Math.max(50, numDistricts * 15);

    topDirs.forEach((dir, idx) => {
      const angle = (idx / numDistricts) * Math.PI * 2;
      const dx = Math.cos(angle) * districtRadius;
      const dz = Math.sin(angle) * districtRadius;

      const district = TerrainGenerator.buildDistrict(
        dir,
        [dx, 0, dz],
        maxFileSize,
        idx
      );
      districts.push(district);
      allBuildings.push(...TerrainGenerator.collectBuildings(district));
    });

    // Root-level files → a "root" district at center
    if (topFiles.length > 0) {
      const rootBlock = TerrainGenerator.buildCityBlock(
        { ...fileTree, children: topFiles, name: 'root' },
        [0, 0, 0],
        maxFileSize,
        0
      );

      const rootDistrict: District = {
        id: `${repoId}-district-root`,
        name: 'Root',
        path: '',
        position: [0, 0, 0],
        radius: rootBlock.radius,
        blocks: [rootBlock],
        color: getDistrictColor('root', topFiles),
      };
      districts.push(rootDistrict);
      allBuildings.push(...rootBlock.buildings);
    }

    const groundRadius = districtRadius + 80;

    return {
      repositoryId: repoId,
      repositoryName: fileTree.name,
      districts,
      allBuildings,
      groundRadius,
      center: [0, 0, 0],
    };
  }

  private static buildDistrict(
    dirNode: FileNode,
    position: [number, number, number],
    maxFileSize: number,
    index: number
  ): District {
    const blocks: CityBlock[] = [];
    const directFiles = dirNode.children.filter((c) => c.type === 'file');
    const subDirs = dirNode.children.filter((c) => c.type === 'directory');

    // Direct files → main block at district center
    if (directFiles.length > 0) {
      const mainBlock = TerrainGenerator.buildCityBlock(
        { ...dirNode, children: directFiles },
        [position[0], position[1], position[2]],
        maxFileSize,
        0
      );
      blocks.push(mainBlock);
    }

    // Sub-directories → satellite blocks around the district
    subDirs.forEach((subDir, subIdx) => {
      const subAngle = (subIdx / Math.max(subDirs.length, 1)) * Math.PI * 2;
      const subDist = 20 + subIdx * 3;
      const subPos: [number, number, number] = [
        position[0] + Math.cos(subAngle) * subDist,
        position[1],
        position[2] + Math.sin(subAngle) * subDist,
      ];

      const subBlock = TerrainGenerator.buildCityBlock(
        subDir,
        subPos,
        maxFileSize,
        subIdx
      );
      blocks.push(subBlock);
    });

    const radius =
      blocks.length > 0
        ? Math.max(
            ...blocks.map((b) => {
              const bDist = Math.sqrt(
                (b.position[0] - position[0]) ** 2 +
                  (b.position[2] - position[2]) ** 2
              );
              return bDist + b.radius;
            })
          )
        : 20;

    return {
      id: `district-${dirNode.path || dirNode.name}-${index}`,
      name: dirNode.name,
      path: dirNode.path,
      position,
      radius,
      blocks,
      color: getDistrictColor(dirNode.name, dirNode.children),
    };
  }

  private static buildCityBlock(
    dirNode: FileNode,
    position: [number, number, number],
    maxFileSize: number,
    index: number
  ): CityBlock {
    const files = dirNode.children.filter((c) => c.type === 'file');
    const buildings: BuildingSlot[] = [];

    // Grid layout for files
    const cols = Math.max(1, Math.ceil(Math.sqrt(files.length)));

    files.forEach((file, fileIdx) => {
      const col = fileIdx % cols;
      const row = Math.floor(fileIdx / cols);

      const bx = position[0] + (col - cols / 2) * TerrainGenerator.CELL_SIZE;
      const bz = position[2] + (row - cols / 2) * TerrainGenerator.CELL_SIZE;

      // Height based on file size (normalized)
      const sizeRatio = Math.min(file.sizeBytes / maxFileSize, 1.0);
      const height =
        TerrainGenerator.MIN_BUILDING_HEIGHT +
        Math.sqrt(sizeRatio) *
          (TerrainGenerator.MAX_BUILDING_HEIGHT -
            TerrainGenerator.MIN_BUILDING_HEIGHT);

      const width = TerrainGenerator.CELL_SIZE * 0.7;
      const depth = TerrainGenerator.CELL_SIZE * 0.7;

      buildings.push({
        id: file.id,
        fileName: file.name,
        filePath: file.path,
        extension: file.extension,
        sizeBytes: file.sizeBytes,
        position: [bx, height / 2, bz],
        width,
        depth,
        height,
      });
    });

    const blockRadius =
      buildings.length > 0
        ? (cols * TerrainGenerator.CELL_SIZE) / 2 + TerrainGenerator.CELL_SIZE
        : 5;

    return {
      id: `block-${dirNode.path || dirNode.name}-${index}`,
      directoryName: dirNode.name,
      directoryPath: dirNode.path,
      position,
      radius: blockRadius,
      buildings,
      childBlocks: [],
      depth: dirNode.depth,
    };
  }

  private static collectBuildings(district: District): BuildingSlot[] {
    const result: BuildingSlot[] = [];
    for (const block of district.blocks) {
      result.push(...block.buildings);
    }
    return result;
  }
}
