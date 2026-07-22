export interface PipelineModel {
  id: string;
  repositoryId: string;
  name: string;
  provider: 'github-actions' | 'gitlab-ci' | 'jenkins' | 'circleci';
  lastRunStatus: 'success' | 'failed' | 'running';
  lastRunTime?: number;
}
