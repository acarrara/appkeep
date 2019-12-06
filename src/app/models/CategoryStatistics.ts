import { YearStatistics } from './YearStatistics';
import { AppKeep } from './AppKeep';

export class CategoryStatistics {
  lastMonthAppKeeps: AppKeep[];
  thisMonthAppKeeps: AppKeep[];
  lastYear: YearStatistics;
  thisYear: YearStatistics;
}
