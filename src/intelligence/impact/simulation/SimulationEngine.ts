import { ImpactEngine } from '../ImpactEngine';
import { ImpactGraph } from '../ImpactGraph';
import {
  ImpactReport,
  SimulationContext,
  SimulationScenario,
  SimulationScenarioType,
} from '../ImpactTypes';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Simulation Engine
// High-level API to build scenarios and run simulations on the impact graph.
// ============================================================================

export class SimulationEngine {
  private impactEngine = new ImpactEngine();

  /**
   * Run a simulation based on a configured context.
   */
  public runSimulation(
    graph: ImpactGraph,
    context: SimulationContext
  ): ImpactReport {
    return this.impactEngine.simulateImpact(graph.baseGraph, context);
  }

  /**
   * Helper to quickly build a SimulationContext
   */
  public buildContext(
    name: string,
    scenarios: Omit<SimulationScenario, 'id'>[]
  ): SimulationContext {
    return {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
      scenarios: scenarios.map((s) => ({ ...s, id: uuidv4() })),
    };
  }

  // --- Convenience Methods for Common Scenarios ---

  public simulateRepositoryDeletion(
    graph: ImpactGraph,
    repoId: string
  ): ImpactReport {
    const context = this.buildContext(`Delete Repository: ${repoId}`, [
      { type: 'REPOSITORY_DELETED', targetId: repoId },
    ]);
    return this.runSimulation(graph, context);
  }

  public simulateVersionUpgrade(
    graph: ImpactGraph,
    dependencyRepoId: string
  ): ImpactReport {
    const context = this.buildContext(`Upgrade Version: ${dependencyRepoId}`, [
      { type: 'VERSION_UPGRADE', targetId: dependencyRepoId },
    ]);
    return this.runSimulation(graph, context);
  }

  public simulateApiModification(
    graph: ImpactGraph,
    serviceRepoId: string
  ): ImpactReport {
    const context = this.buildContext(`Modify API: ${serviceRepoId}`, [
      { type: 'API_MODIFICATION', targetId: serviceRepoId },
    ]);
    return this.runSimulation(graph, context);
  }

  public simulateContributorLoss(
    graph: ImpactGraph,
    authorLogin: string
  ): ImpactReport {
    const context = this.buildContext(`Contributor Loss: ${authorLogin}`, [
      { type: 'CONTRIBUTOR_LOSS', targetId: authorLogin },
    ]);
    return this.runSimulation(graph, context);
  }
}
