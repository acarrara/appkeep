import { MonthStatistics } from './MonthStatistic';
import { YearStatistics } from './YearStatistics';
import { OverallStatistics } from './OverallStatistics';

export interface Statistics {
  lastMonth: MonthStatistics;
  thisMonth: MonthStatistics;
  thisYear: YearStatistics;
  lastYear: YearStatistics;
  overall: OverallStatistics;
}
