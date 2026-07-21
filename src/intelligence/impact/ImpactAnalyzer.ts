import { ImpactGraph } from './ImpactGraph';
import { ImpactReport, SimulationContext, ImpactPath } from './ImpactTypes';
import { TraversalEngine } from './TraversalEngine';

// ============================================================================
// Impact Analyzer
// Core entrypoint for analyzing the impact of a simulation context.
// ============================================================================

export class ImpactAnalyzer {
  private traversal = new TraversalEngine();

  public analyze(graph: ImpactGraph, context: SimulationContext): ImpactReport {
    graph.resetImpactState();

    const allCriticalPaths: ImpactPath[] = [];
    const affectedRepoSet = new Set<string>();
    const affectedContributorSet = new Set<string>();

    for (const scenario of context.scenarios) {
      // Find downstream paths depending on the affected entity
      const downstreamPaths = this.traversal.findDownstreamImpact(
        graph,
        scenario.targetId
      );

      allCriticalPaths.push(...downstreamPaths);

      // Mark directly impacted nodes
      const targetRiskNode = graph.getRiskNode(scenario.targetId);
      if (targetRiskNode) {
        targetRiskNode.isDirectlyImpacted = true;
        affectedRepoSet.add(targetRiskNode.graphNode.id);
        if (targetRiskNode.graphNode.type === 'CONTRIBUTOR') {
          affectedContributorSet.add(targetRiskNode.graphNode.label);
        }
      }

      // Propagate indirect impact and collect sets
      for (const path of downstreamPaths) {
        let currentPropagatedImpact = 100; // Max impact at source

        // Exclude the first node (which is the source itself)
        for (let i = 1; i < path.nodes.length; i++) {
          const nodeId = path.nodes[i];
          const edge = path.edges[i - 1];
          const riskNode = graph.getRiskNode(nodeId);

          if (riskNode) {
            // Decay impact by edge weight
            currentPropagatedImpact *= edge.weight;

            // Keep the maximum impact if multiple paths reach this node
            riskNode.indirectImpactScore = Math.max(
              riskNode.indirectImpactScore,
              currentPropagatedImpact
            );

            if (riskNode.graphNode.type === 'REPOSITORY') {
              affectedRepoSet.add(nodeId);
            } else if (riskNode.graphNode.type === 'CONTRIBUTOR') {
              affectedContributorSet.add(riskNode.graphNode.label);
            }
          }
        }
      }
    }

    // Sort paths by highest cumulative risk
    allCriticalPaths.sort((a, b) => b.cumulativeRisk - a.cumulativeRisk);

    const globalRiskDelta = this.calculateGlobalRiskDelta(
      graph,
      affectedRepoSet
    );

    return {
      contextId: context.id,
      affectedRepositories: Array.from(affectedRepoSet),
      affectedContributors: Array.from(affectedContributorSet),
      criticalPaths: allCriticalPaths,
      globalRiskDelta,
      summary: `Simulation affects ${affectedRepoSet.size} repositories and ${affectedContributorSet.size} contributors.`,
    };
  }

  private calculateGlobalRiskDelta(
    graph: ImpactGraph,
    affectedRepoSet: Set<string>
  ): number {
    if (graph.riskNodes.size === 0) return 0;

    // Simplistic delta: percentage of total nodes affected weighted by their criticality
    let totalCriticality = 0;
    let affectedCriticality = 0;

    graph.riskNodes.forEach((node, id) => {
      const crit = node.riskScores.criticalityScore || 1; // Base 1 if unset
      totalCriticality += crit;
      if (affectedRepoSet.has(id)) {
        affectedCriticality += crit;
      }
    });

    if (totalCriticality === 0) return 0;
    return (affectedCriticality / totalCriticality) * 100; // Returns 0-100%
  }
}
