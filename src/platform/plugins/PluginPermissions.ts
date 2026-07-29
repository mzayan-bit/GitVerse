import { PluginPermission } from './PluginManifest';

export class PluginPermissions {
  private grantedPermissions: Set<PluginPermission>;

  constructor(initial: PluginPermission[] = []) {
    this.grantedPermissions = new Set(initial);
  }

  public hasPermission(permission: PluginPermission): boolean {
    return this.grantedPermissions.has(permission);
  }

  public grant(permission: PluginPermission): void {
    this.grantedPermissions.add(permission);
  }

  public revoke(permission: PluginPermission): void {
    this.grantedPermissions.delete(permission);
  }

  public getAll(): PluginPermission[] {
    return Array.from(this.grantedPermissions);
  }
}
