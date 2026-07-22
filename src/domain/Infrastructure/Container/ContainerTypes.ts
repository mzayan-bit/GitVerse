export interface ContainerModel {
  id: string;
  serviceId: string;
  name: string;
  image: string;
  tag: string;
  state: 'running' | 'waiting' | 'terminated';
  restartCount: number;
}
