import { VisualAction, ActionCallback, VisualActionType } from './ActionTypes';
import { ActionQueue } from './ActionQueue';

export class ActionEngine {
  private queue: ActionQueue;
  private subscribers: ActionCallback[] = [];

  constructor() {
    this.queue = new ActionQueue(async (action) => this.executeAction(action));
  }

  public subscribe(callback: ActionCallback) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: ActionCallback) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }

  /**
   * Called by the AI Response Validator when the AI wants to execute a visual command.
   */
  public dispatchCommand(
    type: VisualActionType,
    target: string,
    metadata?: Record<string, unknown>
  ) {
    const action: VisualAction = {
      id: Math.random().toString(36).substring(7),
      type,
      target,
      metadata,
      timestamp: Date.now(),
    };

    this.queue.enqueue(action);
  }

  private async executeAction(action: VisualAction) {
    // Notify all listeners (e.g. the WebGL rendering engine controllers)
    for (const subscriber of this.subscribers) {
      try {
        subscriber(action);
      } catch (e) {
        console.error('Error in visual action subscriber', e);
      }
    }

    // Simulate animation time block
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
}
