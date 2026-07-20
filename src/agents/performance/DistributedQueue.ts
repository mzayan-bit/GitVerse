import { Task } from '../framework/Task';

export interface QueueStrategy {
  enqueue(task: Task): Promise<void>;
  dequeue(): Promise<Task | null>;
  ack(taskId: string): Promise<void>;
  nack(taskId: string): Promise<void>;
}

export class DistributedQueue {
  private strategy: QueueStrategy;

  constructor(strategy: QueueStrategy) {
    this.strategy = strategy;
  }

  public async push(task: Task): Promise<void> {
    await this.strategy.enqueue(task);
  }

  public async pop(): Promise<Task | null> {
    return await this.strategy.dequeue();
  }

  public async complete(taskId: string): Promise<void> {
    await this.strategy.ack(taskId);
  }

  public async fail(taskId: string): Promise<void> {
    await this.strategy.nack(taskId);
  }
}
