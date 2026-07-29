export interface DemoActivityEvent {
  id: string;
  type: 'COMMIT' | 'DEPLOYMENT' | 'INCIDENT' | 'PR_MERGED';
  title: string;
  timestamp: string;
  actor: string;
}

export class ActivityTimeline {
  public static getTimeline(orgId: string): DemoActivityEvent[] {
    return [
      {
        id: 'e1',
        type: 'DEPLOYMENT',
        title: `${orgId} v2.14.0 promoted to Production Canary`,
        timestamp: '5m ago',
        actor: 'CI/CD Pipeline',
      },
      {
        id: 'e2',
        type: 'COMMIT',
        title: 'Merged PR #842: Add OpenTelemetry span context',
        timestamp: '18m ago',
        actor: 'Sarah Chen',
      },
      {
        id: 'e3',
        type: 'INCIDENT',
        title: 'SEV-2 Resolved: Gateway latency restored to <12ms',
        timestamp: '1h ago',
        actor: 'Alex Rivera',
      },
    ];
  }
}
