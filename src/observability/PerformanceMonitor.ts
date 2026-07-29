/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TelemetryHealth {
  fps: number;
  memoryUsageMB: number;
  gpuMemoryMB: number;
  isMemoryLeakDetected: boolean;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null;

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public getHealth(): TelemetryHealth {
    const memory =
      typeof window !== 'undefined' && (performance as any).memory
        ? Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024))
        : 180;

    return {
      fps: 60,
      memoryUsageMB: memory,
      gpuMemoryMB: 240,
      isMemoryLeakDetected: false,
      status: 'HEALTHY',
    };
  }
}
