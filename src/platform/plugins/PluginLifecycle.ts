export type LifecycleHookName =
  'BeforeInstall' | 'AfterInstall' | 'BeforeUnload' | 'AfterUnload';

export type LifecycleHookHandler = () => Promise<void> | void;

export class PluginLifecycle {
  private hooks: Map<LifecycleHookName, LifecycleHookHandler[]> = new Map();

  public registerHook(
    name: LifecycleHookName,
    handler: LifecycleHookHandler
  ): void {
    let list = this.hooks.get(name);
    if (!list) {
      list = [];
      this.hooks.set(name, list);
    }
    list.push(handler);
  }

  public async triggerHook(name: LifecycleHookName): Promise<void> {
    const list = this.hooks.get(name) || [];
    for (const handler of list) {
      try {
        await handler();
      } catch (err) {
        console.error(`Error in lifecycle hook ${name}:`, err);
      }
    }
  }
}
