export interface ClusterModel {
  id: string;
  providerId: string;
  name: string;
  version?: string;
  nodeCount?: number;
  status: 'active' | 'provisioning' | 'failed' | 'offline';
  metadata?: Record<string, unknown>;
}
