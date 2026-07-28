import { PromptInterpreter } from './PromptInterpreter';
import { ResponsePlanner, PlannedResponse } from './ResponsePlanner';
import { ActionDispatcher } from './ActionDispatcher';
import { ConversationMemory, ConversationMessage } from './ConversationMemory';
import { ContextManager } from './ContextManager';

export class CopilotEngine {
  private static instance: CopilotEngine | null = null;

  public static getInstance(): CopilotEngine {
    if (!CopilotEngine.instance) {
      CopilotEngine.instance = new CopilotEngine();
    }
    return CopilotEngine.instance;
  }

  /**
   * Process a natural language prompt from user
   */
  public async processPrompt(userPrompt: string): Promise<ConversationMessage> {
    const memory = ConversationMemory.getInstance();

    // 1. Add user prompt to conversation memory
    memory.addMessage({
      sender: 'user',
      text: userPrompt,
    });

    // 2. Interpret prompt & classify intent
    const interpretation = PromptInterpreter.interpret(userPrompt);

    // 3. Plan response & spatial actions
    const plan: PlannedResponse = ResponsePlanner.planResponse(
      interpretation.classification,
      userPrompt
    );

    // 4. Dispatch spatial / visual actions
    if (plan.actionType === 'NAVIGATE' && plan.targetPosition) {
      ActionDispatcher.dispatchNavigation(plan.targetPosition, [0, 0, 0]);
    } else if (plan.actionType === 'HIGHLIGHT' && plan.highlightIds) {
      ActionDispatcher.dispatchHighlightNodes(plan.highlightIds);
    } else if (plan.actionType === 'OPEN_PANEL' && plan.panelToOpen) {
      if (plan.panelToOpen === 'inspector')
        ActionDispatcher.openInspectorPanel();
      else if (plan.panelToOpen === 'graph') ActionDispatcher.openGraphPanel();
    }

    // 5. Save assistant response to memory
    const assistantMsg = memory.addMessage({
      sender: 'assistant',
      text: plan.responseText,
      intent: interpretation.classification.intent,
      actionTaken: plan.actionType,
      highlightedNodes: plan.highlightIds,
      suggestedPrompts: plan.suggestedPrompts,
    });

    // 6. Update context
    ContextManager.getInstance().updateContext({
      activePanel: plan.panelToOpen,
    });

    return assistantMsg;
  }
}
