export interface DatabaseModel {
  id: string;
  providerId: string;
  name: string;
  engine: 'postgres' | 'mysql' | 'mongodb' | 'redis' | 'cassandra' | string;
  version: string;
  sizeGb?: number;
  status: 'available' | 'creating' | 'backing-up';
}
