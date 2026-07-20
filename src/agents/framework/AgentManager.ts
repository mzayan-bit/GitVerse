import { AgentRegistry } from './AgentRegistry';
import { AgentContext } from './AgentContext';
import { Finding } from '../findings/FindingsModel';

export class AgentManager {
  private registry = AgentRegistry.getInstance();

  /**
   * Executes a specific agent by ID.
   */
  public async runAgent(
    agentId: string,
    context: AgentContext
  ): Promise<Finding[]> {
    const agent = this.registry.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found in registry.`);
    }

    try {
      // console.log(`Starting execution for ${agent.name}...`);
      const findings = await agent.execute(context);
      // console.log(`Finished execution for ${agent.name}. Found ${findings.length} findings.`);
      return findings;
    } catch (e) {
      console.error(`Agent ${agent.name} failed:`, e);
      throw e;
    }
  }

  /**
   * Concurrently runs all registered agents.
   */
  public async runAllAgents(context: AgentContext): Promise<Finding[]> {
    const agents = this.registry.getAllAgents();
    const promises = agents.map((agent) =>
      this.runAgent(agent.id, context).catch(() => [])
    );

    const results = await Promise.all(promises);
    return results.flat();
  }
}
