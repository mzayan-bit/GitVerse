export interface QueueModel {
  id: string;
  providerId: string;
  name: string;
  type: 'rabbitmq' | 'kafka' | 'sqs' | 'pubsub' | string;
  messageCount?: number;
}
