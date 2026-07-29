import { PluginManifest } from './PluginManifest';
import { PluginContext } from './PluginAPI';
import { PluginSandbox } from './PluginSandbox';
import { PluginLifecycle } from './PluginLifecycle';

export interface RegisteredPlugin {
  manifest: PluginManifest;
  context: PluginContext;
  sandbox: PluginSandbox;
  lifecycle: PluginLifecycle;
  enabled: boolean;
  installedAt: number;
}

export class PluginRegistry {
  private static instance: PluginRegistry | null = null;
  private plugins: Map<string, RegisteredPlugin> = new Map();

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  public register(plugin: RegisteredPlugin): void {
    this.plugins.set(plugin.manifest.id, plugin);
  }

  public unregister(id: string): boolean {
    return this.plugins.delete(id);
  }

  public get(id: string): RegisteredPlugin | undefined {
    return this.plugins.get(id);
  }

  public getAll(): RegisteredPlugin[] {
    return Array.from(this.plugins.values());
  }

  public getEnabled(): RegisteredPlugin[] {
    return this.getAll().filter((p) => p.enabled);
  }
}
