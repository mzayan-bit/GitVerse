export interface SeededGraphNode {
  id: string;
  name: string;
  type: 'repository' | 'service' | 'database';
}

export interface SeededGraphEdge {
  source: string;
  target: string;
  label: string;
}

export class KnowledgeGraphSeeder {
  public static seedGraphForOrg(orgId: string): {
    nodes: SeededGraphNode[];
    edges: SeededGraphEdge[];
  } {
    return {
      nodes: [
        { id: `${orgId}-gateway`, name: `${orgId}-gateway`, type: 'service' },
        { id: `${orgId}-auth`, name: `${orgId}-auth-svc`, type: 'service' },
        { id: `${orgId}-db`, name: `${orgId}-primary-db`, type: 'database' },
        {
          id: `${orgId}-cache`,
          name: `${orgId}-redis-cluster`,
          type: 'database',
        },
      ],
      edges: [
        { source: `${orgId}-gateway`, target: `${orgId}-auth`, label: 'gRPC' },
        { source: `${orgId}-auth`, target: `${orgId}-db`, label: 'SQL' },
        {
          source: `${orgId}-auth`,
          target: `${orgId}-cache`,
          label: 'Redis Protocol',
        },
      ],
    };
  }
}
