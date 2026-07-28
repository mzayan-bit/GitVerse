import { ClassifiedIntent } from './IntentClassifier';

export interface PlannedResponse {
  responseText: string;
  actionType: 'NAVIGATE' | 'HIGHLIGHT' | 'OPEN_PANEL' | 'EXPLAIN' | 'NONE';
  targetPosition?: [number, number, number];
  highlightIds?: string[];
  panelToOpen?: string;
  suggestedPrompts?: string[];
}

export class ResponsePlanner {
  public static planResponse(
    classification: ClassifiedIntent,
    prompt: string
  ): PlannedResponse {
    switch (classification.intent) {
      case 'NAVIGATE':
        return {
          responseText: `Navigating camera to "${classification.extractedTarget || 'authentication service'}" in the 3D universe...`,
          actionType: 'NAVIGATE',
          targetPosition: [250, 80, 450],
          suggestedPrompts: [
            'Explain this repository',
            'Show recent deployments',
            'Perform architecture review',
          ],
        };
      case 'EXPLAIN':
        return {
          responseText: `Analyzing repository metadata and architecture for "${classification.extractedTarget || 'selected service'}". Opening Universe Inspector...`,
          actionType: 'OPEN_PANEL',
          panelToOpen: 'inspector',
          suggestedPrompts: [
            'Why is production slow?',
            'Find circular dependencies',
            'Show everything using Redis',
          ],
        };
      case 'SEARCH':
        return {
          responseText: `Highlighting all services and repositories matching "${classification.extractedKeyword || 'Redis'}" across the engineering graph.`,
          actionType: 'HIGHLIGHT',
          highlightIds: ['node-redis-1', 'node-redis-2', 'node-cache-svc'],
          suggestedPrompts: [
            'Why is production slow?',
            'Perform architecture review',
          ],
        };
      case 'CIRCULAR_DEPENDENCIES':
        return {
          responseText: `Detected 1 potential circular dependency cycle: [auth-service -> user-service -> token-service -> auth-service]. Highlighting affected nodes.`,
          actionType: 'HIGHLIGHT',
          highlightIds: ['auth-service', 'user-service', 'token-service'],
          suggestedPrompts: [
            'How to resolve this circular dependency?',
            'Perform architecture review',
          ],
        };
      case 'TECHNICAL_DEBT':
        return {
          responseText: `Identified 3 technical debt bottlenecks: 1 high-complexity monolith (legacy-monolith), 2 low health score repos (< 50% health).`,
          actionType: 'HIGHLIGHT',
          highlightIds: [
            'legacy-monolith',
            'payments-v1',
            'notification-queue',
          ],
          suggestedPrompts: [
            'Show improvement suggestions',
            'Compare payments-v1 and payments-v2',
          ],
        };
      case 'ARCHITECTURE_REVIEW':
        return {
          responseText: `Completed full architecture review. Overall System Health: 84/100. 2 layer violations detected between API Gateway and DB layer directly.`,
          actionType: 'OPEN_PANEL',
          panelToOpen: 'inspector',
          suggestedPrompts: [
            'Show technical debt',
            'Find circular dependencies',
          ],
        };
      default:
        return {
          responseText: `I analyzed "${prompt}". How else can I assist with your 3D engineering universe?`,
          actionType: 'NONE',
          suggestedPrompts: [
            'Take me to authentication',
            'Explain this repository',
            'Show everything using Redis',
          ],
        };
    }
  }
}
