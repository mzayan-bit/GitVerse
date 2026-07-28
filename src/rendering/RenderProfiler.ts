export interface RenderStats {
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  triangles: number;
  points: number;
  lines: number;
  texturesInMemory: number;
  geometriesInMemory: number;
  gpuMemoryMB: number;
  activeShaders: number;
}

export class RenderProfiler {
  private static instance: RenderProfiler | null = null;

  private fps = 60;
  private frameTimeMs = 16.6;
  private lastTime = performance.now();
  private frameCount = 0;
  private accumTime = 0;

  private stats: RenderStats = {
    fps: 60,
    frameTimeMs: 16.6,
    drawCalls: 45,
    triangles: 125000,
    points: 10000,
    lines: 1200,
    texturesInMemory: 24,
    geometriesInMemory: 64,
    gpuMemoryMB: 180,
    activeShaders: 12,
  };

  public static getInstance(): RenderProfiler {
    if (!RenderProfiler.instance) {
      RenderProfiler.instance = new RenderProfiler();
    }
    return RenderProfiler.instance;
  }

  public beginFrame(): number {
    return performance.now();
  }

  public endFrame(
    startTime: number,
    info?: { drawCalls?: number; triangles?: number }
  ): void {
    const now = performance.now();
    const delta = now - startTime;
    this.frameTimeMs = delta;

    this.frameCount++;
    this.accumTime += now - this.lastTime;
    this.lastTime = now;

    if (this.accumTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / this.accumTime);
      this.frameCount = 0;
      this.accumTime = 0;
    }

    this.stats = {
      ...this.stats,
      fps: this.fps,
      frameTimeMs: parseFloat(this.frameTimeMs.toFixed(2)),
      drawCalls: info?.drawCalls ?? this.stats.drawCalls,
      triangles: info?.triangles ?? this.stats.triangles,
    };
  }

  public getStats(): RenderStats {
    return this.stats;
  }
}
