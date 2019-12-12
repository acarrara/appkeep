import { AppKeep } from './AppKeep';
import { Statistics } from './Statistics';
import { Option } from './Option';
import { UserInfo } from './UserInfo';
import { Category } from './Category';
import { CategoryStatistics } from './CategoryStatistics';
import { User } from './User';
import { MonthStatistics } from './MonthStatistic';
import { YearStatistics } from './YearStatistics';

export interface AppKeepState {
  appKeeps: AppKeep[];
  monthlyAppKeeps: AppKeep[];
  options: Option[];
  categories: Category[];
  statistics: Statistics;
  monthStatistics: MonthStatistics;
  yearStatistics: YearStatistics;
  categoryStatistics: CategoryStatistics;
  user: User;
  users: UserInfo[];
}
