import { AppKeep } from './AppKeep';
import { Statistics } from './Statistics';
import { SocialUser } from 'angularx-social-login';
import { Option } from './Option';
import { User } from './User';
import { Category } from './Category';

export interface AppKeepState {
  appKeeps: AppKeep[];
  options: Option[];
  categories: Category[];
  statistics: Statistics;
  user: SocialUser;
  users: User[];
}
