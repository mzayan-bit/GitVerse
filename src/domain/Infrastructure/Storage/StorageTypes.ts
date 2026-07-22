export interface StorageModel {
  id: string;
  providerId: string;
  name: string;
  type: 's3' | 'blob' | 'volume' | 'nfs';
  sizeGb?: number;
  usedGb?: number;
}
