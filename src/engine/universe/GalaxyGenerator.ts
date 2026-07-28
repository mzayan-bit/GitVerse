import { SeedManager } from './SeedManager';
import { NoiseGenerator } from './NoiseGenerator';
import { StarSystemData, StarSystemGenerator } from './StarSystemGenerator';
import {
  ConstellationEdge,
  ConstellationBuilder,
} from './ConstellationBuilder';

export type GalaxyType =
  'Spiral' | 'BarredSpiral' | 'Elliptical' | 'Irregular' | 'Ring';

export interface GalaxyData {
  orgId: string;
  orgName: string;
  type: GalaxyType;
  seed: number;
  centerPosition: [number, number, number];
  radius: number;
  armCount: number;
  coreColor: string;
  armColor: string;
  starSystems: StarSystemData[];
  constellations: ConstellationEdge[];
}

export class GalaxyGenerator {
  /**
   * Generates a deterministic Galaxy for an Organization graph structure
   */
  public static generateGalaxyForOrg(
    org: {
      id: string;
      name: string;
      teams: Array<{
        id: string;
        name: string;
        repos: Array<{
          id: string;
          name: string;
          orgName?: string;
          teamName?: string;
          healthScore?: number;
          branchesCount?: number;
          deploymentsCount?: number;
          starCount?: number;
          language?: string;
          complexityScore?: number;
          dependenciesCount?: number;
        }>;
      }>;
      dependencies?: Array<{
        sourceId: string;
        targetId: string;
        type?: string;
      }>;
    },
    centerPosition: [number, number, number] = [0, 0, 0],
    customSeed?: string | number
  ): GalaxyData {
    const seedManager = new SeedManager(customSeed ?? `org:${org.id}`);
    const noiseGen = new NoiseGenerator(seedManager.getSeed());

    const galaxyType: GalaxyType = seedManager.nextChoice([
      'Spiral',
      'BarredSpiral',
      'Elliptical',
      'Ring',
    ]);

    const armCount =
      galaxyType === 'Elliptical' ? 0 : seedManager.nextInt(2, 6);
    const radius = Math.max(
      1200,
      org.teams.reduce((acc, t) => acc + t.repos.length * 180, 800)
    );

    const coreColor = seedManager.nextChoice([
      '#00f0ff',
      '#dbfcff',
      '#e9b3ff',
      '#ffd296',
    ]);
    const armColor = seedManager.nextChoice([
      '#7df4ff',
      '#bf5af2',
      '#3b82f6',
      '#ffab00',
    ]);

    // Graph-Aware Layout: Position Teams/Solar Systems along logarithmic spiral arms
    const starSystems: StarSystemData[] = [];
    const systemNodesForConstellation: Array<{
      id: string;
      position: [number, number, number];
    }> = [];

    const totalTeams = Math.max(1, org.teams.length);

    org.teams.forEach((team, teamIdx) => {
      let sysPos: [number, number, number];

      if (galaxyType === 'Spiral' || galaxyType === 'BarredSpiral') {
        // Logarithmic spiral arm placement: r = a * e^(b * theta)
        const armIndex = teamIdx % Math.max(1, armCount);
        const baseAngle = (armIndex * (2 * Math.PI)) / Math.max(1, armCount);
        const progress = (teamIdx + 1) / (totalTeams + 1);

        const distFromCenter = 250 + progress * (radius * 0.75);
        const spiralAngle = baseAngle + progress * Math.PI * 1.8;

        const noiseOffset = noiseGen.fBm2D(progress * 4, armIndex * 2, 3) * 120;

        const x =
          centerPosition[0] +
          Math.cos(spiralAngle) * distFromCenter +
          noiseOffset;
        const z =
          centerPosition[2] +
          Math.sin(spiralAngle) * distFromCenter +
          noiseOffset;
        const y =
          centerPosition[1] +
          (noiseGen.noise2D(x * 0.001, z * 0.001) - 0.5) * 180;

        sysPos = [x, y, z];
      } else if (galaxyType === 'Ring') {
        const angle = (teamIdx / totalTeams) * Math.PI * 2;
        const r = radius * 0.65 + seedManager.nextRange(-80, 80);
        sysPos = [
          centerPosition[0] + Math.cos(angle) * r,
          centerPosition[1] + seedManager.nextRange(-40, 40),
          centerPosition[2] + Math.sin(angle) * r,
        ];
      } else {
        // Elliptical distribution
        const theta = seedManager.nextRange(0, Math.PI * 2);
        const phi = seedManager.nextRange(-Math.PI * 0.4, Math.PI * 0.4);
        const r = seedManager.nextRange(200, radius * 0.7);

        sysPos = [
          centerPosition[0] + r * Math.cos(phi) * Math.cos(theta),
          centerPosition[1] + r * Math.sin(phi) * 0.4,
          centerPosition[2] + r * Math.cos(phi) * Math.sin(theta),
        ];
      }

      const starSys = StarSystemGenerator.generateStarSystem(
        team,
        sysPos,
        seedManager
      );
      starSystems.push(starSys);
      systemNodesForConstellation.push({ id: team.id, position: sysPos });

      // Also register individual planets for constellations
      starSys.planets.forEach((p) => {
        systemNodesForConstellation.push({
          id: p.planet.id,
          position: p.planet.position,
        });
      });
    });

    // Build constellations from dependencies graph
    const constellations = ConstellationBuilder.buildConstellations(
      systemNodesForConstellation,
      org.dependencies || []
    );

    return {
      orgId: org.id,
      orgName: org.name,
      type: galaxyType,
      seed: seedManager.getSeed(),
      centerPosition,
      radius,
      armCount,
      coreColor,
      armColor,
      starSystems,
      constellations,
    };
  }
}
