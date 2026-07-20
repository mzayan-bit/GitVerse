import { ToolCall } from '../providers/AITypes';

export class ResponseValidator {
  /**
   * Validates that a tool call matches expected schemas before execution.
   * This is a critical guardrail so the AI doesn't break the visual engine.
   */
  public static validateToolCall(call: ToolCall): boolean {
    if (call.type !== 'function') return false;

    try {
      const args = JSON.parse(call.function.arguments);

      switch (call.function.name) {
        case 'executeVisualAction':
          if (!args.action) return false;
          const validActions = [
            'focus',
            'highlight',
            'zoom',
            'navigate',
            'animate',
          ];
          return validActions.includes(args.action);
        default:
          return false;
      }
    } catch (e) {
      // JSON parse failed
      return false;
    }
  }
}
