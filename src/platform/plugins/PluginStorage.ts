export class PluginStorage {
  private prefix: string;

  constructor(pluginId: string) {
    this.prefix = `gitverse:plugin:${pluginId}:`;
  }

  public getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.prefix + key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }

  public removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  public clear(): void {
    if (typeof window === 'undefined') return;
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(this.prefix)) {
        localStorage.removeItem(k);
      }
    });
  }
}
