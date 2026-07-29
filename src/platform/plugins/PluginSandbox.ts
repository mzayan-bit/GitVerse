import { PluginManifest } from './PluginManifest';

export class PluginSandbox {
  private manifest: PluginManifest;
  private isActive = true;

  constructor(manifest: PluginManifest) {
    this.manifest = manifest;
  }

  public execute<T>(fn: () => T, fallbackValue?: T): T | undefined {
    if (!this.isActive) {
      console.warn(`Plugin ${this.manifest.id} is inactive.`);
      return fallbackValue;
    }

    try {
      return fn();
    } catch (error) {
      console.error(
        `[Sandbox Error] Plugin ${this.manifest.id} threw an error:`,
        error
      );
      return fallbackValue;
    }
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
}
