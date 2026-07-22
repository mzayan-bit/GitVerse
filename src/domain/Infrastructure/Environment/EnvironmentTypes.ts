export interface EnvironmentModel {
  id: string;
  name: 'production' | 'staging' | 'qa' | 'development' | string;
  isProduction: boolean;
  clusterIds: string[];
}
