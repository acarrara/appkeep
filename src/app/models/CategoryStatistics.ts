import { YearStatistics } from './YearStatistics';
import { AppKeep } from './AppKeep';
import { OverallStatistics } from './OverallStatistics';

export class CategoryStatistics {
  lastMonthAppKeeps: AppKeep[];
  thisMonthAppKeeps: AppKeep[];
  lastYear: YearStatistics;
  thisYear: YearStatistics;
  overall: OverallStatistics;
}
