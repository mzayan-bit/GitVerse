import { IntentClassifier, ClassifiedIntent } from './IntentClassifier';

export interface InterpretedPrompt {
  rawPrompt: string;
  classification: ClassifiedIntent;
  keywords: string[];
}

export class PromptInterpreter {
  public static interpret(prompt: string): InterpretedPrompt {
    const classification = IntentClassifier.classify(prompt);
    const words = prompt.split(/\s+/).filter((w) => w.length > 2);

    return {
      rawPrompt: prompt,
      classification,
      keywords: words,
    };
  }
}
