export interface DemoCommit {
  hash: string;
  author: string;
  message: string;
  timestamp: string;
}

export class CommitFactory {
  public static getRecentCommits(repoName: string): DemoCommit[] {
    return [
      {
        hash: 'a1b2c3d',
        author: 'Sarah Chen',
        message: `feat(${repoName}): optimize memory allocation in buffer pool`,
        timestamp: '10m ago',
      },
      {
        hash: 'e4f5g6h',
        author: 'Alex Rivera',
        message: `fix(${repoName}): resolve race condition in connection pool`,
        timestamp: '45m ago',
      },
    ];
  }
}
