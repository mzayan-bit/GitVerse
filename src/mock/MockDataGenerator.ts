import {
  RepositoryDomainModel,
  Contributor,
  LanguageInfo,
  HealthScore,
} from '../domain/RepositoryModels';
import { LanguageColors } from '../mapping/MappingRules';

/**
 * A simple deterministic PRNG (Pseudo-Random Number Generator) based on Mulberry32.
 */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

const COMMON_TOPICS = [
  'react',
  'threejs',
  'webgl',
  'backend',
  'api',
  'cli',
  'database',
  'machine-learning',
  'data-science',
  'design-system',
  'framework',
];
const REPO_PREFIXES = [
  'core',
  'api',
  'ui',
  'docs',
  'service',
  'client',
  'server',
  'utils',
  'config',
  'data',
];
const REPO_SUFFIXES = [
  'engine',
  'manager',
  'hub',
  'toolkit',
  'cli',
  'web',
  'worker',
  'pipeline',
  'sdk',
];

export class MockDataGenerator {
  private prng: () => number;

  constructor(seed: string) {
    this.prng = mulberry32(hashString(seed));
  }

  private random(): number {
    return this.prng();
  }

  private randomRange(min: number, max: number): number {
    return min + this.random() * (max - min);
  }

  private randomElement<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }

  private generateContributors(count: number): Contributor[] {
    const contributors: Contributor[] = [];
    for (let i = 0; i < count; i++) {
      contributors.push({
        username: `dev_${Math.floor(this.random() * 10000)}`,
        commits: Math.floor(this.randomRange(1, 500)),
      });
    }
    return contributors.sort((a, b) => b.commits - a.commits);
  }

  private generateLanguages(): LanguageInfo[] {
    const langs = Object.keys(LanguageColors).filter((k) => k !== 'Unknown');
    const primary = this.randomElement(langs);
    const secondary = this.randomElement(langs);

    if (primary === secondary || this.random() > 0.5) {
      return [
        { name: primary, color: LanguageColors[primary], percentage: 100 },
      ];
    }

    const primaryPercent = Math.floor(this.randomRange(60, 95));
    return [
      {
        name: primary,
        color: LanguageColors[primary],
        percentage: primaryPercent,
      },
      {
        name: secondary,
        color: LanguageColors[secondary],
        percentage: 100 - primaryPercent,
      },
    ];
  }

  public generateRepository(
    owner: string,
    index: number
  ): RepositoryDomainModel {
    const id = `${owner}-repo-${index}`;
    const name = `${this.randomElement(REPO_PREFIXES)}-${this.randomElement(REPO_SUFFIXES)}`;
    const stars = Math.floor(this.randomRange(0, 150000)); // Up to 150k

    // Derived stats correlated loosely with stars
    const forks = Math.floor(stars * this.randomRange(0.05, 0.3));
    const issues = Math.floor(stars * this.randomRange(0.01, 0.1));
    const commits = Math.floor(this.randomRange(10, 20000));

    const languages = this.generateLanguages();
    const primaryLang = languages[0].name;

    const topicCount = Math.floor(this.randomRange(1, 5));
    const topics = Array.from({ length: topicCount }, () =>
      this.randomElement(COMMON_TOPICS)
    );

    const contributorCount = Math.floor(this.randomRange(1, 20));

    const healthScore: HealthScore = {
      overall: Math.floor(this.randomRange(40, 100)),
      activity: Math.floor(this.randomRange(0, 100)),
      community: Math.floor(this.randomRange(0, 100)),
      maintenance: Math.floor(this.randomRange(0, 100)),
    };

    return {
      id,
      owner,
      name,
      description: `A highly scalable, performant ${name} built for the modern web.`,
      size: this.randomRange(100, 1000000),
      stars,
      forks,
      issues,
      commits,
      pullRequests: Math.floor(issues * 0.5),
      releases: Math.floor(this.randomRange(0, 100)),
      primaryLanguage: primaryLang,
      languages,
      topics,
      techStack: [primaryLang, ...topics],
      contributors: this.generateContributors(contributorCount),
      healthScore,
      complexityScore: Math.floor(this.randomRange(10, 90)),
      createdAt: new Date(
        Date.now() - this.randomRange(100000000, 100000000000)
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - this.randomRange(1000, 10000000)
      ).toISOString(),
      isArchived: this.random() > 0.95, // 5% chance
      visibility: 'public',
    };
  }
}
