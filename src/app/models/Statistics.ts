import { MonthStatistics } from './MonthStatistic';
import { YearStatistics } from './YearStatistics';
import { OverallStatistics } from './OverallStatistics';

export interface Statistics {
  thisMonth: MonthStatistics;
  thisYear: YearStatistics;
  overall: OverallStatistics;
}
