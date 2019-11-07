import { AppKeep } from './AppKeep';
import { Statistics } from './Statistics';
import { SocialUser } from 'angularx-social-login';

export interface AppKeepState {
  appKeeps: AppKeep[];
  statistics: Statistics;
  user: SocialUser;
}
