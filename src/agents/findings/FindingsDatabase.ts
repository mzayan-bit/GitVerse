import { Finding, Severity } from './FindingsModel';

export class FindingsDatabase {
  private static instance: FindingsDatabase;
  private findings: Map<string, Finding> = new Map();

  private constructor() {}

  public static getInstance(): FindingsDatabase {
    if (!FindingsDatabase.instance) {
      FindingsDatabase.instance = new FindingsDatabase();
    }
    return FindingsDatabase.instance;
  }

  public store(finding: Finding) {
    this.findings.set(finding.id, finding);
  }

  public storeMultiple(findings: Finding[]) {
    findings.forEach((f) => this.store(f));
  }

  public get(id: string): Finding | undefined {
    return this.findings.get(id);
  }

  public getAll(): Finding[] {
    return Array.from(this.findings.values());
  }

  public getBySeverity(severity: Severity): Finding[] {
    return this.getAll().filter((f) => f.severity === severity);
  }

  public getByRepository(repoId: string): Finding[] {
    return this.getAll().filter((f) => f.repositoryId === repoId);
  }
}
