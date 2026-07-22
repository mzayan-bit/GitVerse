export interface ServiceModel {
  id: string;
  namespaceId: string;
  name: string;
  repositoryId?: string; // Links to GitVerse repository
  type: 'microservice' | 'monolith' | 'function' | 'daemon';
  status: 'running' | 'degraded' | 'stopped';
  metadata?: Record<string, unknown>;
}
