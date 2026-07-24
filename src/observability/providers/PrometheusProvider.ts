import { IObservabilityProvider, ProviderConfig } from './ProviderInterface';
import { RealtimeGateway } from '../core/RealtimeGateway';
import { MetricEvent } from '../types';

export class PrometheusProvider implements IObservabilityProvider {
  public readonly name = 'prometheus';
  private pollingTimer: NodeJS.Timeout | null = null;
  private isConnected = false;

  public async connect(config: ProviderConfig): Promise<void> {
    this.isConnected = true;
    console.log(`[Prometheus] Connected to ${config.endpoint}`);

    // Prometheus is typically pull-based (polling), or we stream from Prometheus remote read.
    const interval = config.pollingIntervalMs || 5000;

    this.pollingTimer = setInterval(() => {
      this.fetchMetrics();
    }, interval);
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  public async checkHealth(): Promise<boolean> {
    return this.isConnected;
  }

  private fetchMetrics(): void {
    if (!this.isConnected) return;

    // Simulate fetched metrics
    const event: MetricEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'metric',
      provider: this.name,
      sourceId: 'cluster-prod', // Target entity
      metricName: 'cpu_usage_percent',
      value: Math.random() * 100, // 0-100%
      unit: '%',
    };

    RealtimeGateway.getInstance().ingest(event);
  }
}
