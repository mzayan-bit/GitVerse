import { PluginManifest } from './PluginManifest';
import { PluginContext } from './PluginAPI';
import { PluginSandbox } from './PluginSandbox';
import { PluginLifecycle } from './PluginLifecycle';
import { PluginRegistry, RegisteredPlugin } from './PluginRegistry';

export class PluginLoader {
  /**
   * Load and validate a plugin from its manifest
   */
  public static async loadPlugin(
    manifest: PluginManifest
  ): Promise<RegisteredPlugin> {
    const registry = PluginRegistry.getInstance();

    if (registry.get(manifest.id)) {
      throw new Error(`Plugin ${manifest.id} is already loaded.`);
    }

    const context = new PluginContext(manifest);
    const sandbox = new PluginSandbox(manifest);
    const lifecycle = new PluginLifecycle();

    await lifecycle.triggerHook('BeforeInstall');

    const registeredPlugin: RegisteredPlugin = {
      manifest,
      context,
      sandbox,
      lifecycle,
      enabled: true,
      installedAt: Date.now(),
    };

    registry.register(registeredPlugin);

    await lifecycle.triggerHook('AfterInstall');

    return registeredPlugin;
  }

  /**
   * Unload plugin safely
   */
  public static async unloadPlugin(id: string): Promise<boolean> {
    const registry = PluginRegistry.getInstance();
    const plugin = registry.get(id);

    if (!plugin) return false;

    await plugin.lifecycle.triggerHook('BeforeUnload');

    plugin.sandbox.deactivate();
    registry.unregister(id);

    await plugin.lifecycle.triggerHook('AfterUnload');

    return true;
  }
}
