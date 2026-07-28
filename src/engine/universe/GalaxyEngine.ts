import { SeedManager } from './SeedManager';
import { GalaxyData, GalaxyGenerator } from './GalaxyGenerator';
import { SectorManager } from './SectorManager';
import { UniverseSerializer, UniverseSaveState } from './UniverseSerializer';

export class GalaxyEngine {
  private static instance: GalaxyEngine | null = null;

  private seedManager: SeedManager;
  private sectorManager: SectorManager;
  private galaxies: Map<string, GalaxyData> = new Map();
  private activeSeed: string | number = 'gitverse-cosmos-prime';

  private preferences = {
    stellarDensity: 1.0,
    armCount: 4,
    graphLayoutEnabled: true,
    bloomIntensity: 0.8,
    particleDensity: 1.0,
  };

  private constructor(seed: string | number = 'gitverse-cosmos-prime') {
    this.activeSeed = seed;
    this.seedManager = new SeedManager(seed);
    this.sectorManager = new SectorManager(1200, 4500);
  }

  public static getInstance(): GalaxyEngine {
    if (!GalaxyEngine.instance) {
      GalaxyEngine.instance = new GalaxyEngine();
    }
    return GalaxyEngine.instance;
  }

  /**
   * Regenerate entire procedural cosmos with new seed
   */
  public reseedUniverse(newSeed: string | number): void {
    this.activeSeed = newSeed;
    this.seedManager = new SeedManager(newSeed);
    this.galaxies.clear();
    this.sectorManager.clear();
  }

  /**
   * Generate or retrieve a Galaxy for an Organization
   */
  public generateOrganizationGalaxy(
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
    position: [number, number, number] = [0, 0, 0]
  ): GalaxyData {
    let galaxy = this.galaxies.get(org.id);
    if (!galaxy) {
      const orgSeed = this.seedManager.fork(`galaxy:${org.id}`).getSeed();
      galaxy = GalaxyGenerator.generateGalaxyForOrg(org, position, orgSeed);
      this.galaxies.set(org.id, galaxy);

      // Register with sector manager for spatial queries
      galaxy.starSystems.forEach((sys) => {
        this.sectorManager.registerObject({
          id: sys.id,
          position: sys.position,
          radius: 400,
          data: sys,
        });

        sys.planets.forEach((p) => {
          this.sectorManager.registerObject({
            id: p.planet.id,
            position: p.planet.position,
            radius: p.planet.baseRadius,
            data: p.planet,
          });
        });
      });
    }

    return galaxy;
  }

  public getGalaxy(orgId: string): GalaxyData | undefined {
    return this.galaxies.get(orgId);
  }

  public getAllGalaxies(): GalaxyData[] {
    return Array.from(this.galaxies.values());
  }

  public getSectorManager(): SectorManager {
    return this.sectorManager;
  }

  public getPreferences() {
    return this.preferences;
  }

  public updatePreferences(newPrefs: Partial<typeof this.preferences>) {
    this.preferences = { ...this.preferences, ...newPrefs };
  }

  public saveCurrentState(): boolean {
    const saveState: UniverseSaveState = {
      version: '1.0.0',
      timestamp: Date.now(),
      seed: this.activeSeed,
      galaxies: this.getAllGalaxies(),
      userPreferences: this.preferences,
    };
    return UniverseSerializer.saveUniverse(saveState);
  }

  public loadSavedState(): boolean {
    const state = UniverseSerializer.loadUniverse();
    if (!state) return false;
    this.activeSeed = state.seed;
    this.seedManager = new SeedManager(state.seed);
    this.preferences = { ...this.preferences, ...state.userPreferences };
    this.galaxies.clear();
    state.galaxies.forEach((g) => this.galaxies.set(g.orgId, g));
    return true;
  }
}
