export interface LogEntry {
  pluginId: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
}

export class ExtensionLogger {
  private static instance: ExtensionLogger | null = null;
  private logs: LogEntry[] = [];

  public static getInstance(): ExtensionLogger {
    if (!ExtensionLogger.instance) {
      ExtensionLogger.instance = new ExtensionLogger();
    }
    return ExtensionLogger.instance;
  }

  public log(
    pluginId: string,
    level: 'info' | 'warn' | 'error',
    message: string
  ): void {
    this.logs.push({
      pluginId,
      level,
      message,
      timestamp: Date.now(),
    });
  }

  public getLogsForPlugin(pluginId: string): LogEntry[] {
    return this.logs.filter((l) => l.pluginId === pluginId);
  }

  public getAllLogs(): LogEntry[] {
    return this.logs;
  }

  public clear(): void {
    this.logs = [];
  }
}
