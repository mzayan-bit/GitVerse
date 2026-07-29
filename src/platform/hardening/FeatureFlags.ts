export interface FeatureFlagsConfig {
  enableWebGPU: boolean;
  enableVoiceCommands: boolean;
  enablePluginSandbox: boolean;
  enableRayTracing: boolean;
  developerMode: boolean;
  safeMode: boolean;
}

export class FeatureFlags {
  private static instance: FeatureFlags | null = null;

  private flags: FeatureFlagsConfig = {
    enableWebGPU: false,
    enableVoiceCommands: true,
    enablePluginSandbox: true,
    enableRayTracing: false,
    developerMode: false,
    safeMode: false,
  };

  public static getInstance(): FeatureFlags {
    if (!FeatureFlags.instance) {
      FeatureFlags.instance = new FeatureFlags();
    }
    return FeatureFlags.instance;
  }

  public isEnabled(flag: keyof FeatureFlagsConfig): boolean {
    return this.flags[flag];
  }

  public setFlag(flag: keyof FeatureFlagsConfig, enabled: boolean): void {
    this.flags[flag] = enabled;
  }

  public getAll(): FeatureFlagsConfig {
    return { ...this.flags };
  }
}
