import { AppKeep } from './AppKeep';
import { Statistics } from './Statistics';
import { SocialUser } from 'angularx-social-login';
import { Option } from './Option';
import { User } from './User';

export interface AppKeepState {
  appKeeps: AppKeep[];
  options: Option[];
  statistics: Statistics;
  user: SocialUser;
  users: User[];
}
