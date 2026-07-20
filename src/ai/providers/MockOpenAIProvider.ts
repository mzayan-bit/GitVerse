import { AIProvider } from './AIProvider';
import {
  Message,
  GenerationOptions,
  GenerationResult,
  ToolCall,
} from './AITypes';

export class MockOpenAIProvider implements AIProvider {
  name = 'openai';

  public async generate(
    messages: Message[],
    options?: GenerationOptions
  ): Promise<GenerationResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple mock logic for functional testing without an API key
    let responseContent = 'This is a mocked response from OpenAI.';
    const toolCalls: ToolCall[] = [];

    // If options contain functions and the user asks about an action, simulate a tool call
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
    if (lastUserMessage && options?.functions && options.functions.length > 0) {
      if (lastUserMessage.content.toLowerCase().includes('highlight')) {
        toolCalls.push({
          id: 'call_mock123',
          type: 'function',
          function: {
            name: 'executeVisualAction',
            arguments: JSON.stringify({
              action: 'highlight',
              target: 'src/index.ts',
            }),
          },
        });
        responseContent = ''; // Often content is empty when tool calling
      }
    }

    return {
      content: responseContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: {
        promptTokens: 120,
        completionTokens: 40,
        totalTokens: 160,
      },
    };
  }

  public async stream(
    messages: Message[],
    onChunk: (chunk: string) => void,
    options?: GenerationOptions
  ): Promise<GenerationResult> {
    void options;
    const response = 'This is a streamed mocked response from OpenAI.';
    const words = response.split(' ');

    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      onChunk(word + ' ');
    }

    return {
      content: response,
      usage: {
        promptTokens: 120,
        completionTokens: 40,
        totalTokens: 160,
      },
    };
  }
}
