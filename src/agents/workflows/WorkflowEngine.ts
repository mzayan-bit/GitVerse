import { NightlyScanWorkflow } from './NightlyScanWorkflow';
import { AgentManager } from '../framework/AgentManager';
import { AgentContext } from '../framework/AgentContext';
import { Finding } from '../findings/FindingsModel';

export class WorkflowEngine {
  private manager: AgentManager;

  constructor(manager: AgentManager) {
    this.manager = manager;
  }

  public async executeNightlyScan(context: AgentContext): Promise<Finding[]> {
    const workflow = new NightlyScanWorkflow(this.manager);
    const app = workflow.createWorkflow();

    const initialState = {
      context,
      findings: [],
      completedAgents: [],
    };

    const finalState = (await app.invoke(initialState)) as unknown as {
      findings: Finding[];
    };
    return finalState.findings;
  }
}
