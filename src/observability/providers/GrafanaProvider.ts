import { IObservabilityProvider, ProviderConfig } from './ProviderInterface';
import { RealtimeGateway } from '../core/RealtimeGateway';
import { LogEvent, IncidentEvent } from '../types';

export class GrafanaProvider implements IObservabilityProvider {
  public readonly name = 'grafana';
  private isConnected = false;

  public async connect(config: ProviderConfig): Promise<void> {
    this.isConnected = true;
    console.log(`[Grafana] Connected to ${config.endpoint}`);

    // Simulating Loki logs and Grafana Alerts
    this.simulateAlerts();
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  public async checkHealth(): Promise<boolean> {
    return this.isConnected;
  }

  private simulateAlerts(): void {
    setInterval(() => {
      if (!this.isConnected) return;

      const isIncident = Math.random() > 0.8;
      if (isIncident) {
        const incident: IncidentEvent = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'incident',
          provider: this.name,
          sourceId: 'database-primary',
          severity: 'error',
          title: 'High Query Latency',
          description: 'P99 latency exceeded 2s on auth_db',
          status: 'open',
        };
        RealtimeGateway.getInstance().ingest(incident);
      } else {
        const log: LogEvent = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'log',
          provider: this.name,
          sourceId: 'service-payment',
          severity: 'info',
          message: 'Payment processed successfully',
        };
        RealtimeGateway.getInstance().ingest(log);
      }
    }, 4000);
  }
}
