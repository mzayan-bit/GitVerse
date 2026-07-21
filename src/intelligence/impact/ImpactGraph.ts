import { RepositoryGraph } from '../KnowledgeGraph/RepositoryGraph';
import { RiskNode, RiskScores } from './ImpactTypes';

// ============================================================================
// Impact Graph
// Extends the standard Knowledge Graph with risk context and traversal optimizations.
// ============================================================================

export class ImpactGraph {
  public baseGraph: RepositoryGraph;
  public riskNodes: Map<string, RiskNode> = new Map();

  constructor(baseGraph: RepositoryGraph) {
    this.baseGraph = baseGraph;
    this.initializeRiskNodes();
  }

  private initializeRiskNodes(): void {
    this.baseGraph.nodes.forEach((node, id) => {
      this.riskNodes.set(id, {
        graphNode: node,
        isDirectlyImpacted: false,
        indirectImpactScore: 0,
        riskScores: this.getDefaultRiskScores(),
      });
    });
  }

  public getRiskNode(id: string): RiskNode | undefined {
    return this.riskNodes.get(id);
  }

  public updateRiskNode(id: string, updates: Partial<RiskNode>): void {
    const existing = this.riskNodes.get(id);
    if (existing) {
      this.riskNodes.set(id, { ...existing, ...updates });
    }
  }

  public resetImpactState(): void {
    this.riskNodes.forEach((node) => {
      node.isDirectlyImpacted = false;
      node.indirectImpactScore = 0;
      // We don't reset riskScores here, as those are static calculated risks.
      // We only reset the simulation impact state.
    });
  }

  private getDefaultRiskScores(): RiskScores {
    return {
      repositoryRisk: 0,
      dependencyRisk: 0,
      releaseRisk: 0,
      breakingChangeRisk: 0,
      busFactor: 0,
      ownershipRisk: 0,
      criticalityScore: 0,
      blastRadius: 0,
      explanations: {
        repositoryRisk: [],
        dependencyRisk: [],
        releaseRisk: [],
        breakingChangeRisk: [],
        busFactor: [],
        ownershipRisk: [],
        criticalityScore: [],
        blastRadius: [],
      },
    };
  }
}
