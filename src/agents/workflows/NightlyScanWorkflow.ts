import { StateGraph } from '@langchain/langgraph';
import { AgentManager } from '../framework/AgentManager';
import { AgentContext } from '../framework/AgentContext';
import { Finding } from '../findings/FindingsModel';

interface ScanState {
  context: AgentContext;
  findings: Finding[];
  completedAgents: string[];
}

export class NightlyScanWorkflow {
  private manager: AgentManager;

  constructor(manager: AgentManager) {
    this.manager = manager;
  }

  public createWorkflow() {
    // Define the graph for LangGraph
    const graph = new StateGraph<ScanState>({
      channels: {
        context: {
          value: (a?: AgentContext, b?: AgentContext) => b ?? a!,
        },
        findings: {
          value: (a: Finding[] = [], b: Finding[] = []) => a.concat(b),
        },
        completedAgents: {
          value: (a: string[] = [], b: string[] = []) => a.concat(b),
        },
      },
    });

    // Node: Security & Architecture (Core)
    graph.addNode('coreScan', async (state: ScanState) => {
      const security = await this.manager.runAgent(
        'securityagent',
        state.context
      );
      const architecture = await this.manager.runAgent(
        'architectureagent',
        state.context
      );
      return {
        findings: [...security, ...architecture],
        completedAgents: ['securityagent', 'architectureagent'],
      };
    });

    // Node: Technical Debt & Dependencies
    graph.addNode('debtScan', async (state: ScanState) => {
      const debt = await this.manager.runAgent(
        'technicaldebtagent',
        state.context
      );
      const deps = await this.manager.runAgent(
        'dependencyagent',
        state.context
      );
      return {
        findings: [...debt, ...deps],
        completedAgents: ['technicaldebtagent', 'dependencyagent'],
      };
    });

    // Edge wiring
    graph.addEdge('__start__', 'coreScan');
    graph.addEdge('coreScan', 'debtScan');
    graph.addEdge('debtScan', '__end__');

    return graph.compile();
  }
}
