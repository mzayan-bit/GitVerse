export interface DemoRepo {
  id: string;
  name: string;
  language: string;
  healthScore: number;
  complexityIndex: number;
  openIssues: number;
  stars: number;
  team: string;
  description: string;
}

export class RepositoryFactory {
  public static generateReposForOrg(orgId: string): DemoRepo[] {
    switch (orgId) {
      case 'netflix':
        return [
          {
            id: 'netflix-zuul',
            name: 'zuul-gateway',
            language: 'Java',
            healthScore: 0.94,
            complexityIndex: 6,
            openIssues: 12,
            stars: 14200,
            team: 'Edge Gateway',
            description:
              'API Gateway service providing dynamic routing & security filtering.',
          },
          {
            id: 'netflix-eureka',
            name: 'eureka-discovery',
            language: 'Java',
            healthScore: 0.88,
            complexityIndex: 5,
            openIssues: 8,
            stars: 11800,
            team: 'Service Mesh',
            description:
              'REST based service registry for load balancing & failover.',
          },
          {
            id: 'netflix-hystrix',
            name: 'hystrix-resilience',
            language: 'Java',
            healthScore: 0.72,
            complexityIndex: 8,
            openIssues: 24,
            stars: 22500,
            team: 'Resilience',
            description:
              'Latency and fault tolerance library designed to isolate access points.',
          },
          {
            id: 'netflix-mantis',
            name: 'mantis-realtime',
            language: 'Kotlin',
            healthScore: 0.91,
            complexityIndex: 7,
            openIssues: 5,
            stars: 3400,
            team: 'Data Stream',
            description: 'Stream processing platform for operational insight.',
          },
        ];
      case 'openai':
        return [
          {
            id: 'openai-triton',
            name: 'triton-compiler',
            language: 'Python',
            healthScore: 0.96,
            complexityIndex: 9,
            openIssues: 18,
            stars: 18900,
            team: 'Compiler Core',
            description:
              'Language and compiler for writing highly efficient custom Deep Learning primitives.',
          },
          {
            id: 'openai-gym',
            name: 'gymnasium-env',
            language: 'Python',
            healthScore: 0.92,
            complexityIndex: 4,
            openIssues: 3,
            stars: 32000,
            team: 'RL Research',
            description:
              'Standard API for reinforcement learning environments.',
          },
          {
            id: 'openai-whisper',
            name: 'whisper-speech',
            language: 'Python',
            healthScore: 0.98,
            complexityIndex: 5,
            openIssues: 14,
            stars: 65000,
            team: 'Speech Research',
            description:
              'Robust Speech Recognition via Large-Scale Weak Supervision.',
          },
        ];
      default:
        return [
          {
            id: `${orgId}-core`,
            name: `${orgId}-core-service`,
            language: 'TypeScript',
            healthScore: 0.95,
            complexityIndex: 4,
            openIssues: 4,
            stars: 8500,
            team: 'Core Team',
            description:
              'Primary business logic and high performance API layer.',
          },
          {
            id: `${orgId}-api`,
            name: `${orgId}-api-gateway`,
            language: 'Go',
            healthScore: 0.9,
            complexityIndex: 5,
            openIssues: 7,
            stars: 5200,
            team: 'Infrastructure',
            description: 'Edge routing and authentication gateway.',
          },
        ];
    }
  }
}
