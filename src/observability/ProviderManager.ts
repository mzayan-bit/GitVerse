import { IObservabilityProvider, ProviderConfig } from './ProviderInterface';

export class ProviderManager {
  private static instance: ProviderManager;
  private providers: Map<string, IObservabilityProvider> = new Map();

  private constructor() {}

  public static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  /**
   * Registers and connects a new observability provider.
   */
  public async register(
    provider: IObservabilityProvider,
    config: ProviderConfig
  ): Promise<void> {
    if (this.providers.has(provider.name)) {
      console.warn(`Provider ${provider.name} is already registered.`);
      return;
    }

    try {
      await provider.connect(config);
      this.providers.set(provider.name, provider);
      console.log(`Successfully registered provider: ${provider.name}`);
    } catch (e) {
      console.error(`Failed to register provider ${provider.name}`, e);
      throw e;
    }
  }

  public async unregister(providerName: string): Promise<void> {
    const provider = this.providers.get(providerName);
    if (provider) {
      await provider.disconnect();
      this.providers.delete(providerName);
    }
  }

  public getProvider(name: string): IObservabilityProvider | undefined {
    return this.providers.get(name);
  }

  public getAllProviders(): IObservabilityProvider[] {
    return Array.from(this.providers.values());
  }

  public async checkAllHealth(): Promise<Record<string, boolean>> {
    const statuses: Record<string, boolean> = {};
    for (const [name, provider] of this.providers.entries()) {
      statuses[name] = await provider.checkHealth();
    }
    return statuses;
  }
}
