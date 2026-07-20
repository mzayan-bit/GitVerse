import { Message, GenerationOptions, GenerationResult } from './AITypes';

export interface AIProvider {
  /**
   * The name of the provider (e.g., 'openai', 'anthropic').
   */
  name: string;

  /**
   * Generates a complete response for the given conversation history.
   */
  generate(
    messages: Message[],
    options?: GenerationOptions
  ): Promise<GenerationResult>;

  /**
   * Streams a response for the given conversation history.
   */
  stream(
    messages: Message[],
    onChunk: (chunk: string) => void,
    options?: GenerationOptions
  ): Promise<GenerationResult>;
}
