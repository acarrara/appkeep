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
    const thisYear = date.getFullYear();
    const lastYear = date.getFullYear() - 1;
    return {
      lastMonth: this.findMonthStatistics(statisticsRaw[0], lastMonth),
      thisMonth: this.findMonthStatistics(statisticsRaw[0], thisMonth),
      thisYear: this.findYearStatistics(statisticsRaw[1], thisYear),
      lastYear: this.findYearStatistics(statisticsRaw[1], lastYear)
    };
  }

  createCategoryStatistics(statisticsRaw: any): CategoryStatistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const lastMonth = date.getMonth();
    const thisYear = date.getFullYear();
    const lastYear = date.getFullYear() - 1;
    return {
      lastMonthAppKeeps: this.findMonthCategoryAppkeeps(statisticsRaw[0], lastMonth),
      thisMonthAppKeeps: this.findMonthCategoryAppkeeps(statisticsRaw[0], thisMonth),
      lastYear: this.findYearStatistics(statisticsRaw[1], lastYear),
      thisYear: this.findYearStatistics(statisticsRaw[1], thisYear)
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

  private findYearStatistics(statisticsRaw: any[], year: number): YearStatistics {
    const yearStatisticsRaw = statisticsRaw.find(item => item._id === year);
    const value = {months: []};
    if (yearStatisticsRaw && yearStatisticsRaw.months) {
      return yearStatisticsRaw.months.reduce((result, current) => {
        result.months.push({
          appKeepTotal: -current.appKeepTotal,
          incomeTotal: current.incomeTotal,
          label: current.month
        });
        return result;
      }, value);
    }
    return value;
  }
}
