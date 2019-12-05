import { Statistics } from './models/Statistics';
import { MonthStatistics } from './models/MonthStatistic';
import { YearStatistics } from './models/YearStatistics';
import { CategoryStatistics } from './models/CategoryStatistics';
import { AppKeep } from './models/AppKeep';

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

  createCategoryStatistics(statisticsRaw: any): CategoryStatistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const lastMonth = date.getMonth();
    return {
      lastMonthAppKeeps: this.findMonthCategoryAppkeeps(statisticsRaw[0], lastMonth),
      thisMonthAppKeeps: this.findMonthCategoryAppkeeps(statisticsRaw[0], thisMonth),
      year: this.findYearStatistics(statisticsRaw[1])
    };
  }

  private findMonthStatistics(statisticsRaw: any[], thisMonth: number): MonthStatistics {
    const monthStatisticsRaw: any = statisticsRaw.find(item => item._id.month === thisMonth);
    return monthStatisticsRaw === undefined ? {
      appKeepCategories: [],
      incomeCategories: []
    } : {
      appKeepCategories: monthStatisticsRaw.categories.filter(category => category.total < 0),
      incomeCategories: monthStatisticsRaw.categories.filter(category => category.total >= 0)
    };
  }

  private findMonthCategoryAppkeeps(statisticsRaw: any[], thisMonth: number): AppKeep[] {
    const monthStatisticsRaw: any = statisticsRaw.find(item => item._id.month === thisMonth);
    return monthStatisticsRaw === undefined ? [] : monthStatisticsRaw.appKeeps;
  }

  private findYearStatistics(statisticsRaw: any[]): YearStatistics {
    return statisticsRaw.reduce((result, current) => {
      result.months.push({
        appKeepTotal: -current.appKeepTotal,
        incomeTotal: current.incomeTotal,
        label: current._id.month
      });
      return result;
    }, {months: []});
  }
}
