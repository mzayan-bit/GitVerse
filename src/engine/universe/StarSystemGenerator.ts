import { SeedManager } from './SeedManager';
import { PlanetData, PlanetFactory } from './PlanetFactory';
import { OrbitPath, OrbitGenerator } from './OrbitGenerator';

export type StarType =
  'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' | 'Binary' | 'BlackHole' | 'Pulsar';

export interface StarData {
  id: string;
  name: string;
  type: StarType;
  color: string;
  radius: number;
  luminosity: number;
  temperature: number;
  coronaColor: string;
  isBinary?: boolean;
  companionColor?: string;
}

export interface StarSystemData {
  id: string;
  teamName: string;
  position: [number, number, number];
  star: StarData;
  planets: {
    planet: PlanetData;
    orbit: OrbitPath;
  }[];
}

export class StarSystemGenerator {
  public static generateStarSystem(
    team: {
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
    },
    position: [number, number, number],
    seedManager: SeedManager
  ): StarSystemData {
    const sysSeed = seedManager.fork(team.id);

    // Pick Star Type
    const starType: StarType = sysSeed.nextChoice([
      'O',
      'B',
      'A',
      'F',
      'G',
      'K',
      'M',
      'Binary',
      'BlackHole',
      'Pulsar',
    ]);

    const star = StarSystemGenerator.createStar(
      team.id,
      team.name,
      starType,
      sysSeed
    );

    const planets: { planet: PlanetData; orbit: OrbitPath }[] = [];

    team.repos.forEach((repo, idx) => {
      const orbit = OrbitGenerator.generateOrbit(
        idx,
        repo.dependenciesCount || 0,
        sysSeed
      );
      const initialPosOnOrbit = OrbitGenerator.getPositionOnOrbit(orbit, 0);
      const absPlanetPos: [number, number, number] = [
        position[0] + initialPosOnOrbit[0],
        position[1] + initialPosOnOrbit[1],
        position[2] + initialPosOnOrbit[2],
      ];

      const planet = PlanetFactory.createPlanetFromRepo(
        { ...repo, teamName: team.name },
        absPlanetPos,
        sysSeed
      );

      planets.push({ planet, orbit });
    });

    return {
      id: team.id,
      teamName: team.name,
      position,
      star,
      planets,
    };
  }

  private static createStar(
    id: string,
    teamName: string,
    type: StarType,
    _seed: SeedManager
  ): StarData {
    switch (type) {
      case 'O':
        return {
          id: `${id}-star`,
          name: `${teamName} Prime (O-Type)`,
          type,
          color: '#00f0ff',
          radius: 55,
          luminosity: 2.5,
          temperature: 30000,
          coronaColor: '#7df4ff',
        };
      case 'B':
        return {
          id: `${id}-star`,
          name: `${teamName} (B-Type)`,
          type,
          color: '#7df4ff',
          radius: 45,
          luminosity: 2.0,
          temperature: 20000,
          coronaColor: '#dbfcff',
        };
      case 'A':
        return {
          id: `${id}-star`,
          name: `${teamName} (A-Type)`,
          type,
          color: '#ffffff',
          radius: 38,
          luminosity: 1.6,
          temperature: 9500,
          coronaColor: '#e1e2eb',
        };
      case 'F':
        return {
          id: `${id}-star`,
          name: `${teamName} (F-Type)`,
          type,
          color: '#fff4ea',
          radius: 32,
          luminosity: 1.3,
          temperature: 7000,
          coronaColor: '#ffd296',
        };
      case 'G':
        return {
          id: `${id}-star`,
          name: `${teamName} Sol (G-Type)`,
          type,
          color: '#ffd296',
          radius: 28,
          luminosity: 1.0,
          temperature: 5800,
          coronaColor: '#ffab00',
        };
      case 'K':
        return {
          id: `${id}-star`,
          name: `${teamName} (K-Type)`,
          type,
          color: '#ffb950',
          radius: 24,
          luminosity: 0.8,
          temperature: 4500,
          coronaColor: '#ff8888',
        };
      case 'M':
        return {
          id: `${id}-star`,
          name: `${teamName} Red Dwarf (M-Type)`,
          type,
          color: '#ff4d4d',
          radius: 20,
          luminosity: 0.5,
          temperature: 3200,
          coronaColor: '#93000a',
        };
      case 'Binary':
        return {
          id: `${id}-star`,
          name: `${teamName} Binary System`,
          type,
          color: '#00f0ff',
          radius: 35,
          luminosity: 2.2,
          temperature: 18000,
          coronaColor: '#e9b3ff',
          isBinary: true,
          companionColor: '#ffb950',
        };
      case 'BlackHole':
        return {
          id: `${id}-star`,
          name: `${teamName} Singularity`,
          type,
          color: '#090f13',
          radius: 40,
          luminosity: 3.5,
          temperature: 0,
          coronaColor: '#00f0ff',
        };
      case 'Pulsar':
        return {
          id: `${id}-star`,
          name: `${teamName} Pulsar`,
          type,
          color: '#e9b3ff',
          radius: 18,
          luminosity: 3.0,
          temperature: 100000,
          coronaColor: '#7d01b1',
        };
    }
  }
}
