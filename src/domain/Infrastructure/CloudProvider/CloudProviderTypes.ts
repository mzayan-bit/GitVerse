export enum CloudProviderType {
  AWS = 'aws',
  AZURE = 'azure',
  GCP = 'gcp',
  KUBERNETES = 'kubernetes',
  DOCKER_COMPOSE = 'docker-compose',
  LOCAL = 'local',
}

export interface CloudProviderConfig {
  id: string;
  type: CloudProviderType;
  name: string;
  region?: string;
  metadata?: Record<string, unknown>;
}
