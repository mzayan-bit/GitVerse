import { PluginManifest } from '../PluginManifest';

export class PluginScaffold {
  public static generateBoilerplate(
    id: string,
    name: string
  ): {
    manifest: PluginManifest;
    indexJs: string;
    readmeMd: string;
  } {
    const manifest: PluginManifest = {
      id,
      name,
      version: '1.0.0',
      description: `A custom GitVerse extension for ${name}`,
      author: { name: 'Third Party Developer' },
      category: 'Workspace',
      permissions: ['read:graph', 'write:workspace'],
      entryPoint: 'index.js',
    };

    const indexJs = `
// GitVerse Plugin Entry Point: ${name}
export default function activate(context) {
  console.log("Plugin activated:", context.manifest.name);
  
  context.events.on("universe:select", (node) => {
    console.log("Selected 3D node:", node);
  });
}

export function deactivate() {
  console.log("Plugin deactivated.");
}
`;

    const readmeMd = `# ${name}

A custom extension built using the GitVerse Enterprise Plugin SDK.

## Capabilities
- Listens to 3D Universe selection events
- Interacts with Workspace and AI APIs
`;

    return { manifest, indexJs, readmeMd };
  }
}
