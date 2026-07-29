import { PluginManifest } from '../PluginManifest';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class PluginValidator {
  public static validateManifest(
    manifest: Partial<PluginManifest>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!manifest.id) errors.push('Manifest missing required field: id');
    if (!manifest.name) errors.push('Manifest missing required field: name');
    if (!manifest.version)
      errors.push('Manifest missing required field: version');
    if (!manifest.entryPoint)
      errors.push('Manifest missing required field: entryPoint');

    if (manifest.id && !/^[a-z0-9-]+$/.test(manifest.id)) {
      errors.push(
        'Plugin ID must contain only lowercase alphanumeric characters and hyphens.'
      );
    }

    if (manifest.permissions && manifest.permissions.includes('render:3d')) {
      warnings.push(
        'Plugin requests 3D rendering permission. Ensure frame rate budget (16ms) is respected.'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
