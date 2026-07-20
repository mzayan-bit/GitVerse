import { EngineeringContext } from '../context/ContextTypes';
import { ContextCompressor } from '../context/ContextCompressor';
import { Message, AIFunction } from '../providers/AITypes';

export class PromptManager {
  /**
   * Generates the root system prompt, injecting the compressed engineering context.
   */
  public static buildSystemPrompt(
    context: EngineeringContext,
    maxTokens: number = 2000
  ): Message {
    const compressedContext = ContextCompressor.compress(context, maxTokens);

    const content = `
You are the GitVerse Engineering Copilot. 
You exist within a 3D visualization of the codebase.
Your goal is to answer developer questions while orchestrating the visualization to physically point out what you are talking about.

### Engineering Context:
${compressedContext}

### Instructions:
- Answer questions accurately based on the context.
- Use the provided visual action functions to manipulate the environment when discussing specific files, folders, or relationships.
- DO NOT hallucinate files that are not in the context.
    `.trim();

    return {
      role: 'system',
      content,
    };
  }

  /**
   * Defines the capabilities the AI has over the visualization engine.
   */
  public static getVisualFunctions(): AIFunction[] {
    return [
      {
        name: 'executeVisualAction',
        description:
          'Executes a visual command in the 3D GitVerse visualization.',
        parameters: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['focus', 'highlight', 'zoom', 'navigate', 'animate'],
              description: 'The type of action to perform.',
            },
            target: {
              type: 'string',
              description:
                'The path, repository ID, or specific entity ID to target.',
            },
          },
          required: ['action', 'target'],
        },
      },
    ];
  }
}
