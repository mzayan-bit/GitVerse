import { AgentContext } from './AgentContext';
import { Finding } from '../findings/FindingsModel';

export interface Agent {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  /**
   * Executes the agent's logic for a given context and returns a list of findings.
   */
  execute(context: AgentContext): Promise<Finding[]>;
}
