export interface NamespaceModel {
  id: string;
  clusterId: string;
  name: string;
  labels?: Record<string, string>;
}
