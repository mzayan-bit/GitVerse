export interface StateSnapshot<T> {
  timestamp: number;
  data: T;
}

export class StatePersistence<T> {
  private undoStack: StateSnapshot<T>[] = [];
  private redoStack: StateSnapshot<T>[] = [];
  private maxHistory = 50;

  public saveState(data: T): void {
    this.undoStack.push({ timestamp: Date.now(), data });
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Clear redo on new action
  }

  public undo(): StateSnapshot<T> | null {
    if (this.undoStack.length <= 1) return null;
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    return this.undoStack[this.undoStack.length - 1];
  }

  public redo(): StateSnapshot<T> | null {
    if (this.redoStack.length === 0) return null;
    const next = this.redoStack.pop()!;
    this.undoStack.push(next);
    return next;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 1;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
