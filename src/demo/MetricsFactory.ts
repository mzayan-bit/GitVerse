export interface DemoMetrics {
  rps: number;
  p99LatencyMs: number;
  errorRate: number;
  cpuUsagePct: number;
  memoryUsageGB: number;
}

export class MetricsFactory {
  public static getMetricsForOrg(orgId: string): DemoMetrics {
    const isHeavy =
      orgId === 'netflix' || orgId === 'google' || orgId === 'uber';
    return {
      rps: isHeavy ? 450000 : 85000,
      p99LatencyMs: isHeavy ? 18.5 : 8.2,
      errorRate: 0.0012,
      cpuUsagePct: 64.5,
      memoryUsageGB: isHeavy ? 1280 : 320,
    };
  }
}
