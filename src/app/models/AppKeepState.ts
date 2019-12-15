import { AppKeep } from './AppKeep';
import { Statistics } from './Statistics';
import { Option } from './Option';
import { UserInfo } from './UserInfo';
import { Category } from './Category';
import { CategoryStatistics } from './CategoryStatistics';
import { User } from './User';
import { Details } from './Details';

export interface AppKeepState {
  appKeeps: AppKeep[];
  monthlyAppKeeps: AppKeep[];
  options: Option[];
  categories: Category[];
  statistics: Statistics;
  monthStatistics: Details;
  yearStatistics: Details;
  categoryStatistics: CategoryStatistics;
  user: User;
  users: UserInfo[];
}
