export interface AgentContext {
  repositoryId: string;
  scanId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
