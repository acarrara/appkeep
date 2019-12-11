import { Statistics } from './models/Statistics';
import { MonthStatistics } from './models/MonthStatistic';
import { YearStatistics } from './models/YearStatistics';
import { CategoryStatistics } from './models/CategoryStatistics';
import { AppKeep } from './models/AppKeep';
import { OverallStatistics } from './models/OverallStatistics';
import { Recap } from './models/Recap';

export class StatisticsFactory {
  create(statisticsRaw: any): Statistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const thisYear = date.getFullYear();
    return {
      thisMonth: this.findMonthStatistics(statisticsRaw[0], thisMonth),
      thisYear: this.findYearStatistics(statisticsRaw[1], thisYear),
      overall: this.findOverallStatistics(statisticsRaw[2])
    };
  }

  createCategoryStatistics(statisticsRaw: any): CategoryStatistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const thisYear = date.getFullYear();
    return {
      thisMonthAppKeeps: this.findMonthCategoryAppkeeps(statisticsRaw[0], thisMonth),
      thisYear: this.findYearStatistics(statisticsRaw[1], thisYear),
      overall: this.findOverallStatistics(statisticsRaw[2])
    };
  }

  private findMonthStatistics(statisticsRaw: any[], thisMonth: number): MonthStatistics {
    const monthStatisticsRaw: any = statisticsRaw.find(item => item._id.month === thisMonth);
    return monthStatisticsRaw === undefined ? {
      users: [],
      appKeepCategories: [],
      incomeCategories: []
    } : {
      users: monthStatisticsRaw.users.map(current => this.recapFrom(current)),
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

  private findOverallStatistics(statisticsRaw: any[]): OverallStatistics {
    return statisticsRaw.reduce((result, current) => {
      result.years.push(this.recapFrom(current));
      return result;
    }, {years: []});
  }

  private recapFrom(current): Recap {
    return {
      appKeepTotal: -current.appKeepTotal,
      incomeTotal: current.incomeTotal,
      label: current._id
    };
  }
}
