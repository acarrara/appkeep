import { RestResource } from './RestResource';

export interface AppKeep extends RestResource {
  title: string;
  category: string;
  amount: number;
  user: string;
}
