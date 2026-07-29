export interface MCPProviderConnector {
  id: string;
  name: string;
  category:
    | 'VCS'
    | 'Issue Tracking'
    | 'Communication'
    | 'Documentation'
    | 'Design'
    | 'Infrastructure'
    | 'Observability';
  icon: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'CONFIGURING';
  description: string;
  capabilities: string[];
}

export class MCPProviderRegistry {
  private static instance: MCPProviderRegistry | null = null;
  private connectors: Map<string, MCPProviderConnector> = new Map();

  private constructor() {
    this.initDefaultConnectors();
  }

  public static getInstance(): MCPProviderRegistry {
    if (!MCPProviderRegistry.instance) {
      MCPProviderRegistry.instance = new MCPProviderRegistry();
    }
    return MCPProviderRegistry.instance;
  }

  private initDefaultConnectors(): void {
    const list: MCPProviderConnector[] = [
      {
        id: 'github',
        name: 'GitHub',
        category: 'VCS',
        icon: 'Github',
        status: 'CONNECTED',
        description:
          'Imports repository graphs, pull requests, actions, and branch moons.',
        capabilities: ['repos', 'pull_requests', 'actions', 'deployments'],
      },
      {
        id: 'gitlab',
        name: 'GitLab',
        category: 'VCS',
        icon: 'Gitlab',
        status: 'CONNECTED',
        description:
          'Imports GitLab projects, CI/CD pipelines, and merge requests.',
        capabilities: ['projects', 'pipelines', 'merge_requests'],
      },
      {
        id: 'bitbucket',
        name: 'Bitbucket',
        category: 'VCS',
        icon: 'Folder',
        status: 'DISCONNECTED',
        description:
          'Connects Atlassian Bitbucket workspaces and deployment pipelines.',
        capabilities: ['repos', 'pipelines'],
      },
      {
        id: 'jira',
        name: 'Jira Software',
        category: 'Issue Tracking',
        icon: 'CheckSquare',
        status: 'CONNECTED',
        description:
          'Links Jira epics, sprints, and issues to repository commit timelines.',
        capabilities: ['issues', 'sprints', 'epics'],
      },
      {
        id: 'linear',
        name: 'Linear',
        category: 'Issue Tracking',
        icon: 'Sparkles',
        status: 'CONNECTED',
        description:
          'Synchronizes Linear issue status with 3D repository health scores.',
        capabilities: ['issues', 'cycles', 'projects'],
      },
      {
        id: 'slack',
        name: 'Slack',
        category: 'Communication',
        icon: 'MessageSquare',
        status: 'CONNECTED',
        description:
          'Posts 3D universe deployment alerts and incident notifications to Slack.',
        capabilities: ['webhooks', 'bot_notifications'],
      },
      {
        id: 'discord',
        name: 'Discord',
        category: 'Communication',
        icon: 'MessageCircle',
        status: 'DISCONNECTED',
        description:
          'Integrates community repository updates and build notifications.',
        capabilities: ['bot_notifications'],
      },
      {
        id: 'notion',
        name: 'Notion',
        category: 'Documentation',
        icon: 'FileText',
        status: 'CONNECTED',
        description:
          'Links engineering architecture specs and RFC docs to 3D planets.',
        capabilities: ['pages', 'databases'],
      },
      {
        id: 'confluence',
        name: 'Confluence',
        category: 'Documentation',
        icon: 'BookOpen',
        status: 'DISCONNECTED',
        description:
          'Syncs enterprise wiki documentation with 3D knowledge graph nodes.',
        capabilities: ['spaces', 'pages'],
      },
      {
        id: 'google-drive',
        name: 'Google Drive',
        category: 'Documentation',
        icon: 'HardDrive',
        status: 'DISCONNECTED',
        description:
          'Attaches architecture design assets and spreadsheets to repositories.',
        capabilities: ['files', 'sharing'],
      },
      {
        id: 'figma',
        name: 'Figma',
        category: 'Design',
        icon: 'Figma',
        status: 'CONNECTED',
        description:
          'Previews UI design tokens and component mockups directly on planets.',
        capabilities: ['components', 'tokens'],
      },
      {
        id: 'docker',
        name: 'Docker Engine',
        category: 'Infrastructure',
        icon: 'Box',
        status: 'CONNECTED',
        description:
          'Visualizes container image layers and local Docker daemon state.',
        capabilities: ['images', 'containers'],
      },
      {
        id: 'kubernetes',
        name: 'Kubernetes Cluster',
        category: 'Infrastructure',
        icon: 'Layers',
        status: 'CONNECTED',
        description: 'Renders live k8s pod topologies and deployment rollouts.',
        capabilities: ['pods', 'services', 'ingress'],
      },
      {
        id: 'prometheus',
        name: 'Prometheus',
        category: 'Observability',
        icon: 'Activity',
        status: 'CONNECTED',
        description:
          'Streams live metric telemetry (CPU, Memory, Request Rates).',
        capabilities: ['promql', 'alerts'],
      },
      {
        id: 'grafana',
        name: 'Grafana',
        category: 'Observability',
        icon: 'BarChart2',
        status: 'CONNECTED',
        description:
          'Embeds Grafana dashboard panels inside 3D planet inspection cards.',
        capabilities: ['dashboards', 'panels'],
      },
      {
        id: 'opentelemetry',
        name: 'OpenTelemetry',
        category: 'Observability',
        icon: 'Radio',
        status: 'CONNECTED',
        description:
          'Traces distributed request spans across micro-service solar systems.',
        capabilities: ['traces', 'spans', 'metrics'],
      },
    ];

    list.forEach((c) => this.connectors.set(c.id, c));
  }

  public getAll(): MCPProviderConnector[] {
    return Array.from(this.connectors.values());
  }

  public get(id: string): MCPProviderConnector | undefined {
    return this.connectors.get(id);
  }

  public toggleStatus(id: string): void {
    const conn = this.connectors.get(id);
    if (conn) {
      conn.status = conn.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
    }
  }
}
