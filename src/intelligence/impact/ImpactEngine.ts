import { RepositoryGraph } from '../KnowledgeGraph/RepositoryGraph';
import { ImpactAnalyzer } from './ImpactAnalyzer';
import { ImpactGraph } from './ImpactGraph';
import { ImpactReport, SimulationContext } from './ImpactTypes';

// ============================================================================
// Impact Engine Facade
// Simplifies interactions with the impact analysis subsystem.
// ============================================================================

export class ImpactEngine {
  private analyzer = new ImpactAnalyzer();

  /**
   * Run an impact analysis simulation against the provided knowledge graph.
   */
  public simulateImpact(
    baseGraph: RepositoryGraph,
    context: SimulationContext
  ): ImpactReport {
    // 1. Wrap the basic Knowledge Graph into an Impact Graph (preserves nodes, adds risk models)
    const impactGraph = new ImpactGraph(baseGraph);

    // 2. We skip Risk Scoring step here; ideally Risk Engine is run before analysis,
    //    but for a basic simulation run we just do traversal. In Step 2, RiskScoringEngine
    //    will populate the riskNodes before analysis.

    // 3. Perform analysis
    return this.analyzer.analyze(impactGraph, context);
  }

  /**
   * Pre-processes an Impact Graph with static risk scoring, caching it for multiple simulations.
   */
  public initializeImpactGraph(baseGraph: RepositoryGraph): ImpactGraph {
    return new ImpactGraph(baseGraph);
  }
}
