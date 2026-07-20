import { AgentContext } from './AgentContext';

export interface Task {
  id: string;
  agentId: string;
  context: AgentContext;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  retryCount: number;
  maxRetries: number;
  createdAt: number;
}
