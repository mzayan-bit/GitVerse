import { Task } from './Task';
import { AgentManager } from './AgentManager';

export class TaskQueue {
  private queue: Task[] = [];
  private isProcessing = false;
  private manager: AgentManager;

  constructor(manager: AgentManager) {
    this.manager = manager;
  }

  public enqueue(task: Task) {
    this.queue.push(task);
    this.processNext();
  }

  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const task = this.queue.shift()!;
    task.status = 'RUNNING';

    try {
      await this.manager.runAgent(task.agentId, task.context);
      task.status = 'COMPLETED';
    } catch (e) {
      task.retryCount++;
      if (task.retryCount < task.maxRetries) {
        task.status = 'PENDING';
        this.queue.push(task);
      } else {
        task.status = 'FAILED';
      }
    } finally {
      this.isProcessing = false;
      setTimeout(() => this.processNext(), 100);
    }
  }
}
