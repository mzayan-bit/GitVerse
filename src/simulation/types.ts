export type SimulationStatus =
  'idle' | 'running' | 'paused' | 'completed' | 'failed';

export interface SimulationState {
  id: string;
  name: string;
  status: SimulationStatus;
  startTime?: number;
  endTime?: number;
  events: SimulationEvent[];
  snapshots: string[]; // IDs of state snapshots
}

export interface SimulationEvent {
  id: string;
  timestamp: number;
  type:
    | 'failure_injected'
    | 'recovery_action'
    | 'system_degraded'
    | 'system_recovered';
  targetId: string;
  details: Record<string, unknown>;
}

export interface ChaosScenario {
  id: string;
  name: string;
  description: string;
  failures: ChaosFailureDefinition[];
}

export interface ChaosFailureDefinition {
  type:
    | 'database_outage'
    | 'region_loss'
    | 'latency_spike'
    | 'node_failure'
    | 'dependency_failure';
  targetId: string; // The node/service/region in the knowledge graph
  config: Record<string, unknown>;
  startTimeOffsetMs: number;
  durationMs?: number; // undefined means infinite until manual recovery
}

export interface PredictionReport {
  id: string;
  scenarioId: string;
  affectedNodes: string[];
  criticalPathImpacted: boolean;
  expectedDowntimeMs: number;
  confidenceScore: number; // 0.0 to 1.0
  recoveryOrder: string[]; // List of node IDs to recover
  blastRadius: {
    direct: string[];
    indirect: string[];
  };
  reasoning: string;
}
