import { AppKeep } from './AppKeep';
import { Statistics } from './Statistics';
import { Option } from './Option';
import { UserInfo } from './UserInfo';
import { Category } from './Category';
import { CategoryStatistics } from './CategoryStatistics';
import { User } from './User';

export interface AppKeepState {
  appKeeps: AppKeep[];
  monthlyAppKeeps: AppKeep[];
  options: Option[];
  categories: Category[];
  statistics: Statistics;
  categoryStatistics: CategoryStatistics;
  user: User;
  users: UserInfo[];
}
