import { YearStatistics } from './YearStatistics';
import { AppKeep } from './AppKeep';
import { OverallStatistics } from './OverallStatistics';

export class CategoryStatistics {
  thisMonthAppKeeps: AppKeep[];
  thisYear: YearStatistics;
  overall: OverallStatistics;
}
