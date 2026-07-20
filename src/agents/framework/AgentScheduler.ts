import { TaskQueue } from './TaskQueue';
import { Task } from './Task';
import { AgentContext } from './AgentContext';

export class AgentScheduler {
  private queue: TaskQueue;
  private intervals: NodeJS.Timeout[] = [];

  constructor(queue: TaskQueue) {
    this.queue = queue;
  }

  /**
   * Schedules an agent to run repeatedly at a specific interval in milliseconds.
   */
  public schedule(agentId: string, repositoryId: string, intervalMs: number) {
    const timer = setInterval(() => {
      const context: AgentContext = {
        repositoryId,
        scanId: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
      };

      const task: Task = {
        id: Math.random().toString(36).substring(7),
        agentId,
        context,
        status: 'PENDING',
        retryCount: 0,
        maxRetries: 3,
        createdAt: Date.now(),
      };

      this.queue.enqueue(task);
    }, intervalMs);

    this.intervals.push(timer);
  }

  public stopAll() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }
}
