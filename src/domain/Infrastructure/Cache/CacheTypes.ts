export interface CacheModel {
  id: string;
  providerId: string;
  name: string;
  engine: 'redis' | 'memcached' | string;
  hitRate?: number;
}
