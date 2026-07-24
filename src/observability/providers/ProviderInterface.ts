export interface ProviderConfig {
  endpoint: string;
  apiKey?: string;
  pollingIntervalMs?: number;
  [key: string]: unknown;
}

export interface IObservabilityProvider {
  /**
   * Unique name of the provider (e.g. 'opentelemetry')
   */
  readonly name: string;

  /**
   * Initializes connection or polling loops
   */
  connect(config: ProviderConfig): Promise<void>;

  /**
   * Disconnects and cleans up resources
   */
  disconnect(): Promise<void>;

  /**
   * Checks if the provider is currently healthy and reachable
   */
  checkHealth(): Promise<boolean>;
}
