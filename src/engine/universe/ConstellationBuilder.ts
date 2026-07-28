export interface ConstellationEdge {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
  type: 'dependency' | 'dataflow' | 'team_bridge';
  color: string;
  intensity: number;
}

export class ConstellationBuilder {
  /**
   * Generates constellation connection lines between dependent solar systems/planets
   */
  public static buildConstellations(
    nodes: Array<{ id: string; position: [number, number, number] }>,
    dependencies: Array<{ sourceId: string; targetId: string; type?: string }>
  ): ConstellationEdge[] {
    const nodeMap = new Map(nodes.map((n) => [n.id, n.position]));
    const edges: ConstellationEdge[] = [];

    dependencies.forEach((dep, idx) => {
      const sourcePos = nodeMap.get(dep.sourceId);
      const targetPos = nodeMap.get(dep.targetId);

      if (sourcePos && targetPos) {
        const edgeType =
          (dep.type as ConstellationEdge['type']) || 'dependency';
        const color =
          edgeType === 'dependency'
            ? '#00f0ff'
            : edgeType === 'dataflow'
              ? '#e9b3ff'
              : '#ffd296';

        edges.push({
          id: `constellation-${dep.sourceId}-${dep.targetId}-${idx}`,
          sourceId: dep.sourceId,
          targetId: dep.targetId,
          sourcePos,
          targetPos,
          type: edgeType,
          color,
          intensity: edgeType === 'dependency' ? 1.0 : 0.7,
        });
      }
    });

    return edges;
  }
}
