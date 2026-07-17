import { RepositoryDomainModel } from '@/domain/RepositoryModels';

export type CameraTargetMode = 'free' | 'focus' | 'orbit';

export interface CameraState {
  mode: CameraTargetMode;
  targetId: string | null; // Entity ID to focus/orbit
  position: [number, number, number];
  targetPosition: [number, number, number];
}

export interface UniverseHierarchy {
  galaxies: {
    id: string; // usually org name or user login
    name: string;
    type: 'organization' | 'user';
    systemIds: string[]; // IDs of solar systems within this galaxy
  }[];
  solarSystems: {
    id: string; // e.g. "org-TypeScript"
    name: string; // e.g. "TypeScript Repositories"
    galaxyId: string;
    planetIds: string[]; // IDs of planets within this system
  }[];
  planets: {
    id: string; // repo ID
    name: string;
    solarSystemId: string;
    repository: RepositoryDomainModel;
  }[];
}

export interface UniverseStatistics {
  totalOrganizations: number;
  totalRepositories: number;
  totalLanguages: number;
  totalStars: number;
  totalForks: number;
}
