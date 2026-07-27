export interface AnimationTask {
  id: string;
  priority: number; // Higher number = higher priority
  update: (delta: number) => boolean; // Returns true when completed
  onComplete?: () => void;
}

export class AnimationQueue {
  private tasks: AnimationTask[] = [];

  public add(task: AnimationTask): void {
    // Replace task with same ID if exists
    this.remove(task.id);
    this.tasks.push(task);
    this.tasks.sort((a, b) => b.priority - a.priority);
  }

  public remove(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  public update(delta: number): void {
    const remaining: AnimationTask[] = [];

    for (const task of this.tasks) {
      const isDone = task.update(delta);
      if (isDone) {
        if (task.onComplete) task.onComplete();
      } else {
        remaining.push(task);
      }
    }

    this.tasks = remaining;
  }

  public clear(): void {
    this.tasks = [];
  }
}
