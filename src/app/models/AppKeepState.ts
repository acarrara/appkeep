import { AppKeep } from './AppKeep';
import { Statistics } from './Statistics';
import { SocialUser } from 'angularx-social-login';
import { Option } from './Option';
import { User } from './User';
import { Category } from './Category';
import { CategoryStatistics } from './CategoryStatistics';

export interface AppKeepState {
  appKeeps: AppKeep[];
  options: Option[];
  categories: Category[];
  statistics: Statistics;
  categoryStatistics: CategoryStatistics;
  user: SocialUser;
  users: User[];
}
