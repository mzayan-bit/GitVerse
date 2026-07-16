export enum RelationshipType {
  SHARED_CONTRIBUTOR = 'SHARED_CONTRIBUTOR',
  SHARED_LANGUAGE = 'SHARED_LANGUAGE',
  SHARED_TOPIC = 'SHARED_TOPIC',
  FORK_OF = 'FORK_OF',
  DEPENDENCY = 'DEPENDENCY',
  SIMILAR_ACTIVITY = 'SIMILAR_ACTIVITY',
  SAME_OWNER = 'SAME_OWNER',
}

export interface RelationshipMetadata {
  weight: number;
  description: string;
  context?: Record<string, unknown>;
}
