export class Telemetry {
  public static logInfo(event: string, metadata?: Record<string, unknown>) {
    console.log(`[INFO] ${event}`, metadata || {});
  }

  public static logWarning(event: string, metadata?: Record<string, unknown>) {
    console.warn(`[WARN] ${event}`, metadata || {});
  }

  public static logError(
    event: string,
    error: unknown,
    metadata?: Record<string, unknown>
  ) {
    console.error(`[ERROR] ${event}`, { error, ...metadata });
  }

  public static trace<T>(
    spanName: string,
    action: () => Promise<T>
  ): Promise<T> {
    const start = Date.now();
    return action().finally(() => {
      const duration = Date.now() - start;
      this.logInfo(`Span Completed: ${spanName}`, { durationMs: duration });
    });
  }
}
