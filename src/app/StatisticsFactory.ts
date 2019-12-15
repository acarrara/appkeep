import { Statistics } from './models/Statistics';
import { CategoryStatistics } from './models/CategoryStatistics';
import { AppKeep } from './models/AppKeep';
import { Recap } from './models/Recap';
import { Details } from './models/Details';

export class StatisticsFactory {
  create(statisticsRaw: any): Statistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const thisYear = date.getFullYear();
    return {
      thisMonth: this.createMonthStatistics(statisticsRaw[0], thisMonth),
      thisYear: this.createYearStatistics(statisticsRaw[1], thisYear),
      overall: this.createOverallStatistics(statisticsRaw[2])
    };
  }

  createCategoryStatistics(statisticsRaw: any): CategoryStatistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const thisYear = date.getFullYear();
    return {
      thisMonthAppKeeps: this.findMonthCategoryAppkeeps(statisticsRaw[0], thisMonth),
      months: statisticsRaw[1][0].ranges.map(current => this.recapFrom(current, thisYear)),
      years: statisticsRaw[2].map(current => this.recapFrom(current, ''))
    };
  }

  createMonthStatistics(statisticsRaw: any[], month: number): Details {
    const monthStatisticsRaw: any = statisticsRaw.find(item => item._id.month === month);
    return monthStatisticsRaw === undefined ? {
      users: [],
      outCategories: [],
      inCategories: []
    } : {
      users: monthStatisticsRaw.users.map(current => this.recapFrom(current, month)),
      outCategories: monthStatisticsRaw.categories.filter(category => category.total < 0),
      inCategories: monthStatisticsRaw.categories.filter(category => category.total >= 0)
    };
  }

  private findMonthCategoryAppkeeps(statisticsRaw: any[], thisMonth: number): AppKeep[] {
    const monthStatisticsRaw: any = statisticsRaw.find(item => item._id.month === thisMonth);
    return monthStatisticsRaw === undefined ? [] : monthStatisticsRaw.appKeeps;
  }

  public createYearStatistics(statisticsRaw: any[], year: number): Details {
    const yearStatisticsRaw = statisticsRaw.find(item => item._id === year);
    const value = {
      ranges: [],
      users: [],
      outCategories: [],
      inCategories: []
    };
    if (yearStatisticsRaw && yearStatisticsRaw.users) {
      value.users = yearStatisticsRaw.users.map(current => this.recapFrom(current, year));
      value.outCategories = yearStatisticsRaw.categories.filter(category => category.total < 0);
      value.inCategories = yearStatisticsRaw.categories.filter(category => category.total >= 0);
    }
    if (yearStatisticsRaw && yearStatisticsRaw.ranges) {
      return yearStatisticsRaw.ranges.reduce((result, current) => {
        result.ranges.push({
          outTotal: -current.outTotal,
          inTotal: current.inTotal,
          label: current.month,
          scope: year
        });
        return result;
      }, value);
    }
    return value;
  }

  private createOverallStatistics(statisticsRaw: any): Details {
    return {
      ranges: statisticsRaw.statistics.map(stat => this.recapFrom(stat, '')),
      users: statisticsRaw.users.map(current => this.recapFrom(current, '')),
      outCategories: statisticsRaw.categories.filter(category => category.total < 0),
      inCategories: statisticsRaw.categories.filter(category => category.total >= 0)
    };
  }

  private recapFrom(current, scope): Recap {
    return {
      outTotal: -current.outTotal,
      inTotal: current.inTotal,
      label: current.month || current._id,
      scope
    };
  }
}
