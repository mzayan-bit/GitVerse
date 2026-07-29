export interface SpanTrace {
  id: string;
  name: string;
  durationMs: number;
  status: 'OK' | 'ERROR';
  attributes: Record<string, string | number>;
}

export class OpenTelemetryTracer {
  private static instance: OpenTelemetryTracer | null = null;
  private traces: SpanTrace[] = [];

  public static getInstance(): OpenTelemetryTracer {
    if (!OpenTelemetryTracer.instance) {
      OpenTelemetryTracer.instance = new OpenTelemetryTracer();
    }
    return OpenTelemetryTracer.instance;
  }

  public traceSpan<T>(
    name: string,
    fn: () => T,
    attributes: Record<string, string | number> = {}
  ): T {
    const t0 = performance.now();
    let status: 'OK' | 'ERROR' = 'OK';
    try {
      return fn();
    } catch (e) {
      status = 'ERROR';
      throw e;
    } finally {
      const durationMs = parseFloat((performance.now() - t0).toFixed(2));
      this.traces.push({
        id: `span-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name,
        durationMs,
        status,
        attributes,
      });
    }
  }

  public getTraces(): SpanTrace[] {
    return this.traces;
  }
}
