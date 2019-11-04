import { AppKeep } from './AppKeep';
import { Statistics } from './Statistics';

export interface AppKeepState {
  appKeeps: AppKeep[];
  statistics: Statistics;
}
