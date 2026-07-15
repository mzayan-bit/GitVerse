export type EntityType =
  | 'galaxy'
  | 'solar_system'
  | 'planet'
  | 'moon'
  | 'satellite'
  | 'repository'
  | 'contributor';

export interface EntityTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface BaseEntity {
  id: string;
  type: EntityType;
  name: string;
  seed: string;
  transform: EntityTransform;
  metadata?: Record<string, unknown>; // Domain data attached here
}
