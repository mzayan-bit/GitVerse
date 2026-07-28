import { SeedManager } from './SeedManager';

export interface MoonData {
  id: string;
  name: string; // Branch name
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: string;
}

export interface SatelliteData {
  id: string;
  name: string; // Deployment name
  orbitRadius: number;
  orbitSpeed: number;
  type: 'active' | 'staging' | 'failed' | 'production';
  color: string;
}

export interface PlanetData {
  id: string;
  repoName: string;
  orgName: string;
  teamName: string;
  position: [number, number, number];
  baseRadius: number;
  color: string;
  atmosphereColor: string;
  glowColor: string;
  hasRings: boolean;
  ringColor?: string;
  healthScore: number; // 0.0 (unhealthy) to 1.0 (pristine)
  weatherType: 'clear' | 'stormy' | 'aurora' | 'dusty' | 'toxic';
  moons: MoonData[]; // Branches
  satellites: SatelliteData[]; // Deployments
  complexityLevel: number;
}

export class PlanetFactory {
  /**
   * Generates a deterministic Planet from repository metadata & graph info.
   */
  public static createPlanetFromRepo(
    repo: {
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
    },
    position: [number, number, number],
    seedManager: SeedManager
  ): PlanetData {
    const repoSeed = seedManager.fork(repo.id);

    const health = repo.healthScore ?? repoSeed.nextRange(0.6, 0.98);
    const complexity = repo.complexityScore ?? repoSeed.nextRange(1, 10);
    const starCount = repo.starCount ?? repoSeed.nextInt(5, 500);
    const branchCount = repo.branchesCount ?? repoSeed.nextInt(1, 8);
    const deployCount = repo.deploymentsCount ?? repoSeed.nextInt(0, 5);

    // Planet Radius based on stars & complexity
    const baseRadius = Math.max(
      12,
      Math.min(65, 10 + Math.sqrt(starCount) * 1.5 + complexity * 2)
    );

    // Colors driven by Health & Language
    const color = PlanetFactory.getLanguageColor(
      repo.language || 'typescript',
      repoSeed
    );
    const atmosphereColor = PlanetFactory.getAtmosphereColor(health, repoSeed);
    const glowColor =
      health > 0.8 ? '#00f0ff' : health > 0.5 ? '#ffab00' : '#ff4d4d';

    // Weather type based on health
    const weatherType =
      health > 0.85
        ? 'aurora'
        : health > 0.65
          ? 'clear'
          : health > 0.4
            ? 'dusty'
            : 'stormy';

    const hasRings = repoSeed.nextBool(0.35) || complexity > 7;
    const ringColor = hasRings
      ? repoSeed.nextChoice(['#7df4ff', '#e9b3ff', '#ffd296', '#849495'])
      : undefined;

    // Generate Moons (Branches)
    const moons: MoonData[] = [];
    for (let i = 0; i < branchCount; i++) {
      const moonSeed = repoSeed.fork(`moon:${i}`);
      moons.push({
        id: `${repo.id}-branch-${i}`,
        name: i === 0 ? 'main' : `branch/feature-${i}`,
        radius: moonSeed.nextRange(2.5, 5.5),
        orbitRadius: baseRadius * 1.8 + i * 9 + moonSeed.nextRange(1, 4),
        orbitSpeed: moonSeed.nextRange(0.4, 1.2),
        color: moonSeed.nextChoice([
          '#c7c4d8',
          '#849495',
          '#b9cacb',
          '#dbfcff',
        ]),
      });
    }

    // Generate Satellites (Deployments)
    const satellites: SatelliteData[] = [];
    for (let j = 0; j < deployCount; j++) {
      const satSeed = repoSeed.fork(`sat:${j}`);
      const type = satSeed.nextChoice([
        'production',
        'staging',
        'active',
        'failed',
      ]);
      satellites.push({
        id: `${repo.id}-deploy-${j}`,
        name: `deploy-v1.${j}`,
        orbitRadius: baseRadius * 1.3 + j * 6 + satSeed.nextRange(1, 3),
        orbitSpeed: satSeed.nextRange(1.0, 2.5),
        type,
        color:
          type === 'production'
            ? '#00f0ff'
            : type === 'failed'
              ? '#ff4d4d'
              : '#e9b3ff',
      });
    }

    return {
      id: repo.id,
      repoName: repo.name,
      orgName: repo.orgName || 'DefaultOrg',
      teamName: repo.teamName || 'CoreTeam',
      position,
      baseRadius,
      color,
      atmosphereColor,
      glowColor,
      hasRings,
      ringColor,
      healthScore: health,
      weatherType,
      moons,
      satellites,
      complexityLevel: complexity,
    };
  }

  private static getLanguageColor(language: string, seed: SeedManager): string {
    const langLower = language.toLowerCase();
    if (langLower.includes('script') || langLower.includes('js'))
      return '#f7df1e';
    if (langLower.includes('python')) return '#3572A5';
    if (langLower.includes('rust')) return '#dea584';
    if (langLower.includes('go')) return '#00ADD8';
    if (langLower.includes('java')) return '#b07219';
    if (langLower.includes('c++') || langLower.includes('cpp'))
      return '#f34b7d';
    return seed.nextChoice([
      '#00f0ff',
      '#e9b3ff',
      '#ffd296',
      '#adc6ff',
      '#7df4ff',
    ]);
  }

  private static getAtmosphereColor(health: number, seed: SeedManager): string {
    if (health > 0.8) return seed.nextChoice(['#7df4ff', '#00f0ff', '#a5f3fc']);
    if (health > 0.5) return seed.nextChoice(['#ffd296', '#fde047', '#fed7aa']);
    return seed.nextChoice(['#ff8888', '#f87171', '#ef4444']);
  }
}
