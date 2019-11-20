import { Statistics } from './models/Statistics';
import { MonthStatistics } from './models/MonthStatistic';
import { YearStatistics } from './models/YearStatistics';

export class StatisticsFactory {
  create(statisticsRaw: any): Statistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const lastMonth = date.getMonth();
    return {
      lastMonth: this.findMonthStatistics(statisticsRaw[0], lastMonth),
      thisMonth: this.findMonthStatistics(statisticsRaw[0], thisMonth),
      year: this.findYearStatistics(statisticsRaw[1])
    };
  }

  private findMonthStatistics(statisticsRaw: any[], thisMonth: number): MonthStatistics {
    const monthStatisticsRaw: any = statisticsRaw.find(item => item._id.month === thisMonth);
    return monthStatisticsRaw === undefined ? {categories: []} : {categories: monthStatisticsRaw.categories};
  }

  private findYearStatistics(statisticsRaw: any[]): YearStatistics {
    return statisticsRaw.reduce((result, current) => {
      result.months.push({
        total: current.total,
        label: current._id.month
      });
      return result;
    }, {months: []});
  }
}
