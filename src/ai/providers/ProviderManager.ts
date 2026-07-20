import { AIProvider } from './AIProvider';
import { Message, GenerationOptions, GenerationResult } from './AITypes';

export class ProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private primaryProvider: string = 'openai';

  public registerProvider(provider: AIProvider, isPrimary = false) {
    this.providers.set(provider.name, provider);
    if (isPrimary) {
      this.primaryProvider = provider.name;
    }
  }

  public async generate(
    messages: Message[],
    options?: GenerationOptions
  ): Promise<GenerationResult> {
    const provider = this.getProvider(options?.model);
    try {
      return await provider.generate(messages, options);
    } catch (error) {
      console.error(`Provider ${provider.name} failed`, error);
      // Fallback logic could be implemented here
      throw error;
    }
  }

  public async stream(
    messages: Message[],
    onChunk: (chunk: string) => void,
    options?: GenerationOptions
  ): Promise<GenerationResult> {
    const provider = this.getProvider(options?.model);
    try {
      return await provider.stream(messages, onChunk, options);
    } catch (error) {
      console.error(`Provider ${provider.name} stream failed`, error);
      throw error;
    }
  }

  private getProvider(modelHint?: string): AIProvider {
    // Determine provider based on model hint, or fallback to primary
    let target = this.primaryProvider;
    if (modelHint) {
      if (modelHint.includes('gpt')) target = 'openai';
      if (modelHint.includes('claude')) target = 'anthropic';
      if (modelHint.includes('gemini')) target = 'gemini';
    }

    const provider = this.providers.get(target);
    if (!provider) {
      throw new Error(`No AI provider found for target: ${target}`);
    }
    return provider;
  }
}
