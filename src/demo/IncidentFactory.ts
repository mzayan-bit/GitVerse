export interface DemoIncident {
  id: string;
  title: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  status: 'RESOLVED' | 'INVESTIGATING' | 'MONITORING';
  affectedService: string;
  durationMinutes: number;
}

export class IncidentFactory {
  public static getIncidentsForOrg(orgId: string): DemoIncident[] {
    return [
      {
        id: `${orgId}-inc-1`,
        title: 'High p99 Latency Spike on Edge Gateway',
        severity: 'SEV-2',
        status: 'RESOLVED',
        affectedService: 'zuul-gateway',
        durationMinutes: 14,
      },
      {
        id: `${orgId}-inc-2`,
        title: 'Memory Pressure in Redis Cluster',
        severity: 'SEV-3',
        status: 'MONITORING',
        affectedService: 'cache-layer',
        durationMinutes: 28,
      },
    ];
  }
}
