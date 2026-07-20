import { VisualAction } from './ActionTypes';

export class ActionQueue {
  private queue: VisualAction[] = [];
  private isProcessing = false;
  private processor: (action: VisualAction) => Promise<void>;

  constructor(processor: (action: VisualAction) => Promise<void>) {
    this.processor = processor;
  }

  public enqueue(action: VisualAction) {
    this.queue.push(action);
    this.processNext();
  }

  public clear() {
    this.queue = [];
  }

  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const action = this.queue.shift()!;
    try {
      await this.processor(action);
    } catch (e) {
      console.error(`Failed to execute visual action ${action.id}`, e);
    } finally {
      this.isProcessing = false;
      setTimeout(() => this.processNext(), 100); // 100ms pacing between actions
    }
  }
}
