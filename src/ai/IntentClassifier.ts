export type AIIntent =
  | 'NAVIGATE'
  | 'EXPLAIN'
  | 'SEARCH'
  | 'ARCHITECTURE_REVIEW'
  | 'CIRCULAR_DEPENDENCIES'
  | 'TECHNICAL_DEBT'
  | 'COMPARE'
  | 'DEPLOYMENTS'
  | 'UNKNOWN';

export interface ClassifiedIntent {
  intent: AIIntent;
  confidence: number;
  extractedTarget?: string;
  extractedKeyword?: string;
}

export class IntentClassifier {
  public static classify(prompt: string): ClassifiedIntent {
    const p = prompt.toLowerCase().trim();

    if (
      p.includes('take me to') ||
      p.includes('go to') ||
      p.includes('fly to') ||
      p.includes('navigate to') ||
      p.includes('zoom to')
    ) {
      const target = p
        .replace(/(take me to|go to|fly to|navigate to|zoom to)/g, '')
        .trim();
      return { intent: 'NAVIGATE', confidence: 0.95, extractedTarget: target };
    }

    if (
      p.includes('explain') ||
      p.includes('what is') ||
      p.includes('tell me about') ||
      p.includes('summarize')
    ) {
      const target = p
        .replace(/(explain|what is|tell me about|summarize)/g, '')
        .trim();
      return { intent: 'EXPLAIN', confidence: 0.9, extractedTarget: target };
    }

    if (
      p.includes('show everything using') ||
      p.includes('find all') ||
      p.includes('search') ||
      p.includes('show all')
    ) {
      const kw = p
        .replace(/(show everything using|find all|search|show all)/g, '')
        .trim();
      return { intent: 'SEARCH', confidence: 0.9, extractedKeyword: kw };
    }

    if (
      p.includes('circular') ||
      p.includes('cycle') ||
      p.includes('loop dependency')
    ) {
      return { intent: 'CIRCULAR_DEPENDENCIES', confidence: 0.95 };
    }

    if (
      p.includes('technical debt') ||
      p.includes('debt') ||
      p.includes('slow') ||
      p.includes('why is production slow') ||
      p.includes('bottleneck')
    ) {
      return { intent: 'TECHNICAL_DEBT', confidence: 0.92 };
    }

    if (p.includes('compare') || p.includes('versus') || p.includes('diff')) {
      return { intent: 'COMPARE', confidence: 0.88 };
    }

    if (
      p.includes('deployment') ||
      p.includes('deploy') ||
      p.includes('releases')
    ) {
      return { intent: 'DEPLOYMENTS', confidence: 0.9 };
    }

    if (
      p.includes('architecture') ||
      p.includes('review') ||
      p.includes('audit')
    ) {
      return { intent: 'ARCHITECTURE_REVIEW', confidence: 0.95 };
    }

    return { intent: 'UNKNOWN', confidence: 0.5 };
  }
}
