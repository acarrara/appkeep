import { Statistics } from './models/Statistics';
import { MonthStatistics } from './models/MonthStatistic';

export class StatisticsFactory {
  create(statisticsRaw: any): Statistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const lastMonth = date.getMonth();
    return {
      lastMonth: this.findMonthStatistics(statisticsRaw, lastMonth),
      thisMonth: this.findMonthStatistics(statisticsRaw, thisMonth)
    };
  }

  private findMonthStatistics(statisticsRaw: any[], thisMonth: number): MonthStatistics {
    const monthStatisticsRaw: any = statisticsRaw.find(item => item._id.month === thisMonth);
    return monthStatisticsRaw === undefined ? {categories: []} : {categories: monthStatisticsRaw.categories};
  }
}
