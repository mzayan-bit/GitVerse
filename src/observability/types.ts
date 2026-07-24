export type EventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface BaseEvent {
  id: string;
  timestamp: number;
  sourceId: string; // The entity ID this event belongs to (planet, service, database)
  provider: string; // e.g. "opentelemetry", "prometheus"
  metadata?: Record<string, unknown>;
}

export interface MetricEvent extends BaseEvent {
  type: 'metric';
  metricName: string;
  value: number;
  unit: string;
}

export interface LogEvent extends BaseEvent {
  type: 'log';
  severity: EventSeverity;
  message: string;
  traceId?: string;
}

export interface TraceEvent extends BaseEvent {
  type: 'trace';
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  durationMs: number;
  status: 'ok' | 'error';
  serviceName: string;
  operationName: string;
}

export interface IncidentEvent extends BaseEvent {
  type: 'incident';
  severity: EventSeverity;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
}

export interface DeploymentEvent extends BaseEvent {
  type: 'deployment';
  serviceName: string;
  version: string;
  status: 'pending' | 'running' | 'success' | 'failed';
}

export type LiveEvent =
  MetricEvent | LogEvent | TraceEvent | IncidentEvent | DeploymentEvent;

export type EventCallback = (event: LiveEvent) => void;
