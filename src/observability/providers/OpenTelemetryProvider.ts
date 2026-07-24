import { IObservabilityProvider, ProviderConfig } from './ProviderInterface';
import { RealtimeGateway } from '../core/RealtimeGateway';
import { TraceEvent } from '../types';

export class OpenTelemetryProvider implements IObservabilityProvider {
  public readonly name = 'opentelemetry';
  private isConnected = false;
  private ws: WebSocket | null = null;

  public async connect(config: ProviderConfig): Promise<void> {
    if (this.isConnected) return;

    // In a real implementation, this connects to an OTel Collector GRPC/WebSocket endpoint.
    // For this demonstration, we simulate streaming trace data.
    this.isConnected = true;
    console.log(`[OpenTelemetry] Connected to ${config.endpoint}`);

    this.simulateStream();
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public async checkHealth(): Promise<boolean> {
    return this.isConnected;
  }

  private simulateStream(): void {
    if (!this.isConnected) return;

    // Simulate incoming OTel spans
    setInterval(() => {
      if (!this.isConnected) return;
      const event: TraceEvent = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'trace',
        provider: this.name,
        sourceId: 'service-auth', // Corresponds to a planet
        traceId: crypto.randomUUID(),
        spanId: crypto.randomUUID().substring(0, 8),
        durationMs: Math.random() * 200,
        status: Math.random() > 0.95 ? 'error' : 'ok',
        serviceName: 'AuthService',
        operationName: '/api/v1/login',
      };

      RealtimeGateway.getInstance().ingest(event);
    }, 2000); // 1 trace every 2 seconds for demo
  }
}
