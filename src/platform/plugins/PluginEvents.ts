export type PluginEventListener = (payload: unknown) => void;

export class PluginEvents {
  private static instance: PluginEvents | null = null;
  private listeners: Map<string, PluginEventListener[]> = new Map();

  public static getInstance(): PluginEvents {
    if (!PluginEvents.instance) {
      PluginEvents.instance = new PluginEvents();
    }
    return PluginEvents.instance;
  }

  public on(event: string, listener: PluginEventListener): void {
    let list = this.listeners.get(event);
    if (!list) {
      list = [];
      this.listeners.set(event, list);
    }
    list.push(listener);
  }

  public off(event: string, listener: PluginEventListener): void {
    const list = this.listeners.get(event);
    if (list) {
      this.listeners.set(
        event,
        list.filter((l) => l !== listener)
      );
    }
  }

  public emit(event: string, payload: unknown): void {
    const list = this.listeners.get(event) || [];
    list.forEach((fn) => {
      try {
        fn(payload);
      } catch (err) {
        console.error(`Error emitting event ${event}:`, err);
      }
    });
  }
}
