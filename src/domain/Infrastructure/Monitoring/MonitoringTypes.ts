export interface MonitoringMetric {
  id: string;
  entityId: string; // Links to Service, Database, Cluster, etc.
  type: 'cpu' | 'memory' | 'latency' | 'error_rate' | 'throughput';
  value: number;
  unit: string;
  timestamp: number;
}
