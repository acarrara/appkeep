import { MonthStatistics } from './MonthStatistic';
import { YearStatistics } from './YearStatistics';

export interface Statistics {
  lastMonth: MonthStatistics;
  thisMonth: MonthStatistics;
  thisYear: YearStatistics;
  lastYear: YearStatistics;
}
