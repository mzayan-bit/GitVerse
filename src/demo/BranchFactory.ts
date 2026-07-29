export interface DemoBranch {
  name: string;
  isDefault: boolean;
  aheadBy: number;
  behindBy: number;
}

export class BranchFactory {
  public static getBranches(_repoName: string): DemoBranch[] {
    return [
      { name: 'main', isDefault: true, aheadBy: 0, behindBy: 0 },
      {
        name: 'feature/v2-refactor',
        isDefault: false,
        aheadBy: 12,
        behindBy: 2,
      },
      { name: 'fix/security-patch', isDefault: false, aheadBy: 3, behindBy: 0 },
    ];
  }
}
