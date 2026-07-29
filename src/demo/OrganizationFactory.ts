export interface DemoOrgMeta {
  id: string;
  name: string;
  tagline: string;
  logoColor: string;
  seed: string;
  category: string;
  repoCount: number;
  teamCount: number;
  contributorCount: number;
  healthScore: number;
}

export class OrganizationFactory {
  public static DEMO_ORGS: DemoOrgMeta[] = [
    {
      id: 'netflix',
      name: 'Netflix',
      tagline: 'Global Video Streaming & Edge Microservices Architecture',
      logoColor: '#e50914',
      seed: 'netflix-histeria-2026',
      category: 'Entertainment',
      repoCount: 42,
      teamCount: 8,
      contributorCount: 350,
      healthScore: 0.92,
    },
    {
      id: 'spotify',
      name: 'Spotify',
      tagline:
        'Audio Processing, Recommendation Systems & Distributed Playbacks',
      logoColor: '#1ed760',
      seed: 'spotify-soundwave-99',
      category: 'Audio & Music',
      repoCount: 36,
      teamCount: 6,
      contributorCount: 280,
      healthScore: 0.88,
    },
    {
      id: 'uber',
      name: 'Uber',
      tagline: 'Geospatial H3 Routing, Dispatch Engine & Real-Time Logistics',
      logoColor: '#ffffff',
      seed: 'uber-dispatch-h3-v2',
      category: 'Logistics',
      repoCount: 50,
      teamCount: 10,
      contributorCount: 450,
      healthScore: 0.85,
    },
    {
      id: 'openai',
      name: 'OpenAI',
      tagline:
        'Large Language Model Training Clusters & Multi-Region Inference',
      logoColor: '#10a37f',
      seed: 'openai-gpt5-cluster',
      category: 'AI Research',
      repoCount: 28,
      teamCount: 5,
      contributorCount: 190,
      healthScore: 0.95,
    },
    {
      id: 'stripe',
      name: 'Stripe',
      tagline:
        'High-Availability Financial Ledger & Multi-Currency Payment Mesh',
      logoColor: '#635bff',
      seed: 'stripe-ledger-mesh',
      category: 'Fintech',
      repoCount: 38,
      teamCount: 7,
      contributorCount: 310,
      healthScore: 0.97,
    },
    {
      id: 'vercel',
      name: 'Vercel',
      tagline: 'Global Edge Network, Turbopack Bundler & Next.js Ecosystem',
      logoColor: '#000000',
      seed: 'vercel-edge-turbopack',
      category: 'Cloud Platform',
      repoCount: 24,
      teamCount: 4,
      contributorCount: 160,
      healthScore: 0.94,
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare',
      tagline: 'Distributed Anycast Edge Network & Zero Trust Security Matrix',
      logoColor: '#f38020',
      seed: 'cloudflare-anycast-edge',
      category: 'Infrastructure',
      repoCount: 45,
      teamCount: 9,
      contributorCount: 380,
      healthScore: 0.91,
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      tagline: 'Azure Hyperscale Cloud, TypeScript & Enterprise Solutions',
      logoColor: '#00a4ef',
      seed: 'microsoft-azure-ts-core',
      category: 'Enterprise Tech',
      repoCount: 65,
      teamCount: 12,
      contributorCount: 820,
      healthScore: 0.89,
    },
    {
      id: 'google',
      name: 'Google',
      tagline: 'Monorepo Infrastructure, Search Indexing & Borg Compute Engine',
      logoColor: '#4285f4',
      seed: 'google-borg-monorepo',
      category: 'Hyperscale Search',
      repoCount: 80,
      teamCount: 15,
      contributorCount: 1200,
      healthScore: 0.93,
    },
    {
      id: 'gitverse-labs',
      name: 'GitVerse Labs',
      tagline: 'Core Platform R&D, 3D Spatial Canvas & Next-Gen IDE Engine',
      logoColor: '#8b5cf6',
      seed: 'gitverse-flagship-labs',
      category: 'Platform Core',
      repoCount: 18,
      teamCount: 3,
      contributorCount: 45,
      healthScore: 0.98,
    },
  ];

  public static getOrg(id: string): DemoOrgMeta {
    return this.DEMO_ORGS.find((o) => o.id === id) || this.DEMO_ORGS[0];
  }
}
