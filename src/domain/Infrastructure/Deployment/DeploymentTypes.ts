export interface DeploymentModel {
  id: string;
  serviceId: string;
  version: string;
  timestamp: number;
  status: 'success' | 'failed' | 'in-progress' | 'rolled-back';
  triggeredBy?: string;
}
