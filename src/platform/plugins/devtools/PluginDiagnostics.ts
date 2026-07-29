export interface PluginPerformanceStats {
  pluginId: string;
  executionTimeMs: number;
  memoryUsageBytes: number;
  errorCount: number;
}

export class PluginDiagnostics {
  private static instance: PluginDiagnostics | null = null;
  private statsMap: Map<string, PluginPerformanceStats> = new Map();

  public static getInstance(): PluginDiagnostics {
    if (!PluginDiagnostics.instance) {
      PluginDiagnostics.instance = new PluginDiagnostics();
    }
    return PluginDiagnostics.instance;
  }

  public recordExecution(pluginId: string, durationMs: number): void {
    let stat = this.statsMap.get(pluginId);
    if (!stat) {
      stat = {
        pluginId,
        executionTimeMs: 0,
        memoryUsageBytes: 0,
        errorCount: 0,
      };
      this.statsMap.set(pluginId, stat);
    }
    stat.executionTimeMs = parseFloat(
      (stat.executionTimeMs * 0.8 + durationMs * 0.2).toFixed(2)
    );
  }

  public recordError(pluginId: string): void {
    let stat = this.statsMap.get(pluginId);
    if (!stat) {
      stat = {
        pluginId,
        executionTimeMs: 0,
        memoryUsageBytes: 0,
        errorCount: 0,
      };
      this.statsMap.set(pluginId, stat);
    }
    stat.errorCount++;
  }

  public getStats(pluginId: string): PluginPerformanceStats | undefined {
    return this.statsMap.get(pluginId);
  }

  public getAllStats(): PluginPerformanceStats[] {
    return Array.from(this.statsMap.values());
  }
}
