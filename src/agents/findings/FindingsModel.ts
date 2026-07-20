export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface VisualActionPayload {
  action: string;
  target: string;
}

export interface Finding {
  id: string;
  agentId: string;
  repositoryId: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number; // 0 to 1
  evidence: string[]; // Paths, snippets, or URLs
  suggestedActions: string[];
  visualAction?: VisualActionPayload;
  timestamp: string;
}
