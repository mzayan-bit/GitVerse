export type PluginPermission =
  | 'read:graph'
  | 'write:workspace'
  | 'execute:ai'
  | 'network:fetch'
  | 'render:3d'
  | 'storage:local';

export interface PluginAuthor {
  name: string;
  email?: string;
  url?: string;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: PluginAuthor;
  icon?: string;
  category:
    'AI' | 'Providers' | 'Rendering' | 'Workspace' | 'Themes' | 'Metrics';
  permissions: PluginPermission[];
  entryPoint: string;
  minHostVersion?: string;
  dependencies?: Record<string, string>;
  homepage?: string;
}
