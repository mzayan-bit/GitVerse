// ============================================================================
// Scene Loader — Deterministic File Tree Generator
// ============================================================================
// Since we don't yet have GitHub Contents API, this generates a deterministic
// mock file tree based on repository metadata. The same repo always produces
// the same tree layout. Future prompts can swap in real API data.
// ============================================================================

import { RepositoryDomainModel } from '@/domain/RepositoryModels';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension: string;
  sizeBytes: number;
  children: FileNode[];
  depth: number;
}

// Simple seeded random for deterministic generation
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

// File templates per language
const LANGUAGE_TEMPLATES: Record<string, { dirs: string[]; files: string[] }> =
  {
    TypeScript: {
      dirs: [
        'src',
        'src/components',
        'src/lib',
        'src/hooks',
        'src/types',
        'src/utils',
        'src/api',
        'public',
        'tests',
      ],
      files: [
        'package.json',
        'tsconfig.json',
        'README.md',
        '.gitignore',
        '.eslintrc.json',
        'src/index.ts',
        'src/App.tsx',
        'src/main.tsx',
        'src/components/Button.tsx',
        'src/components/Card.tsx',
        'src/components/Layout.tsx',
        'src/components/Header.tsx',
        'src/components/Footer.tsx',
        'src/components/Modal.tsx',
        'src/lib/api.ts',
        'src/lib/utils.ts',
        'src/lib/constants.ts',
        'src/hooks/useAuth.ts',
        'src/hooks/useTheme.ts',
        'src/types/index.ts',
        'src/types/api.ts',
        'src/utils/helpers.ts',
        'src/utils/format.ts',
        'src/api/client.ts',
        'src/api/endpoints.ts',
        'tests/setup.ts',
        'tests/App.test.tsx',
      ],
    },
    JavaScript: {
      dirs: [
        'src',
        'src/components',
        'src/utils',
        'src/services',
        'public',
        'tests',
      ],
      files: [
        'package.json',
        'README.md',
        '.gitignore',
        '.babelrc',
        'src/index.js',
        'src/App.js',
        'src/components/Header.js',
        'src/components/Footer.js',
        'src/components/Sidebar.js',
        'src/utils/helpers.js',
        'src/utils/api.js',
        'src/services/auth.js',
        'src/services/data.js',
        'tests/app.test.js',
      ],
    },
    Python: {
      dirs: [
        'src',
        'src/models',
        'src/api',
        'src/utils',
        'src/services',
        'tests',
        'docs',
        'scripts',
      ],
      files: [
        'requirements.txt',
        'setup.py',
        'README.md',
        '.gitignore',
        'Dockerfile',
        'src/__init__.py',
        'src/main.py',
        'src/config.py',
        'src/models/__init__.py',
        'src/models/user.py',
        'src/models/data.py',
        'src/api/__init__.py',
        'src/api/routes.py',
        'src/api/auth.py',
        'src/utils/__init__.py',
        'src/utils/helpers.py',
        'src/services/__init__.py',
        'src/services/processor.py',
        'tests/test_main.py',
        'tests/test_api.py',
        'docs/README.md',
        'scripts/deploy.sh',
      ],
    },
    Rust: {
      dirs: [
        'src',
        'src/models',
        'src/handlers',
        'src/utils',
        'tests',
        'benches',
      ],
      files: [
        'Cargo.toml',
        'Cargo.lock',
        'README.md',
        '.gitignore',
        'src/main.rs',
        'src/lib.rs',
        'src/config.rs',
        'src/models/mod.rs',
        'src/models/user.rs',
        'src/models/state.rs',
        'src/handlers/mod.rs',
        'src/handlers/api.rs',
        'src/utils/mod.rs',
        'src/utils/crypto.rs',
        'tests/integration.rs',
        'benches/benchmark.rs',
      ],
    },
    Unknown: {
      dirs: ['src', 'docs', 'config', 'scripts'],
      files: [
        'README.md',
        '.gitignore',
        'Makefile',
        'src/main.txt',
        'docs/GUIDE.md',
        'config/settings.json',
        'scripts/build.sh',
      ],
    },
  };

/**
 * Generates a deterministic file tree for a repository.
 */
export class SceneLoader {
  public static generateFileTree(repo: RepositoryDomainModel): FileNode {
    const rng = seededRandom(repo.id + repo.name);
    const lang = repo.primaryLanguage || 'Unknown';
    const template = LANGUAGE_TEMPLATES[lang] || LANGUAGE_TEMPLATES.Unknown;

    // Scale file count based on repo size
    const sizeMultiplier = Math.max(1, Math.floor(Math.sqrt(repo.size / 500)));
    const extraFileCount = Math.min(sizeMultiplier * 8, 200);

    const root: FileNode = {
      id: `${repo.id}-root`,
      name: repo.name,
      path: '',
      type: 'directory',
      extension: '',
      sizeBytes: 0,
      children: [],
      depth: 0,
    };

    // Create directories
    const dirMap = new Map<string, FileNode>();
    dirMap.set('', root);

    for (const dirPath of template.dirs) {
      SceneLoader.ensureDir(dirMap, dirPath, repo.id);
    }

    // Create template files
    for (const filePath of template.files) {
      const parts = filePath.split('/');
      const fileName = parts.pop()!;
      const parentPath = parts.join('/');
      const parent = SceneLoader.ensureDir(dirMap, parentPath, repo.id);

      const ext = fileName.includes('.') ? fileName.split('.').pop()! : '';
      const fileNode: FileNode = {
        id: `${repo.id}-${filePath}`,
        name: fileName,
        path: filePath,
        type: 'file',
        extension: ext,
        sizeBytes: Math.floor(rng() * 10000) + 200,
        children: [],
        depth: parts.length + 1,
      };
      parent.children.push(fileNode);
    }

    // Generate extra files based on repo size
    const extensions = SceneLoader.getExtensionsForLanguage(lang);
    for (let i = 0; i < extraFileCount; i++) {
      const dirKeys = Array.from(dirMap.keys()).filter((k) => k.length > 0);
      if (dirKeys.length === 0) break;
      const parentPath = dirKeys[Math.floor(rng() * dirKeys.length)];
      const parent = dirMap.get(parentPath)!;

      const ext = extensions[Math.floor(rng() * extensions.length)];
      const name = `${SceneLoader.generateFileName(rng)}.${ext}`;
      const fullPath = parentPath ? `${parentPath}/${name}` : name;

      const fileNode: FileNode = {
        id: `${repo.id}-${fullPath}-${i}`,
        name,
        path: fullPath,
        type: 'file',
        extension: ext,
        sizeBytes: Math.floor(rng() * 15000) + 100,
        children: [],
        depth: parent.depth + 1,
      };
      parent.children.push(fileNode);
    }

    // Calculate directory sizes
    SceneLoader.calculateSizes(root);

    return root;
  }

  private static ensureDir(
    dirMap: Map<string, FileNode>,
    path: string,
    repoId: string
  ): FileNode {
    if (!path) return dirMap.get('')!;
    const existing = dirMap.get(path);
    if (existing) return existing;

    const parts = path.split('/');
    const name = parts.pop()!;
    const parentPath = parts.join('/');
    const parent = SceneLoader.ensureDir(dirMap, parentPath, repoId);

    const node: FileNode = {
      id: `${repoId}-dir-${path}`,
      name,
      path,
      type: 'directory',
      extension: '',
      sizeBytes: 0,
      children: [],
      depth: parts.length + 1,
    };
    parent.children.push(node);
    dirMap.set(path, node);
    return node;
  }

  private static calculateSizes(node: FileNode): number {
    if (node.type === 'file') return node.sizeBytes;
    let total = 0;
    for (const child of node.children) {
      total += SceneLoader.calculateSizes(child);
    }
    node.sizeBytes = total;
    return total;
  }

  private static getExtensionsForLanguage(lang: string): string[] {
    switch (lang) {
      case 'TypeScript':
        return ['ts', 'tsx', 'json', 'md', 'css', 'yaml'];
      case 'JavaScript':
        return ['js', 'jsx', 'json', 'md', 'css', 'html'];
      case 'Python':
        return ['py', 'json', 'md', 'yaml', 'txt', 'cfg'];
      case 'Rust':
        return ['rs', 'toml', 'md', 'yaml'];
      default:
        return ['txt', 'md', 'json', 'yaml', 'sh'];
    }
  }

  private static generateFileName(rng: () => number): string {
    const prefixes = [
      'handler',
      'service',
      'util',
      'model',
      'view',
      'controller',
      'provider',
      'factory',
      'adapter',
      'parser',
      'validator',
      'transformer',
      'mapper',
      'config',
      'middleware',
      'plugin',
    ];
    const suffixes = ['', '_v2', '_new', '_alt'];
    return (
      prefixes[Math.floor(rng() * prefixes.length)] +
      suffixes[Math.floor(rng() * suffixes.length)]
    );
  }
}
