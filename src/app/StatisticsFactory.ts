import { Statistics } from './models/Statistics';

export class StatisticsFactory {
  create(statisticsRaw: any): Statistics {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const lastMonth = date.getMonth();
    console.log(statisticsRaw, thisMonth, lastMonth)
    return {
      lastMonth: this.findTotal(statisticsRaw, lastMonth),
      thisMonth: this.findTotal(statisticsRaw, thisMonth)
    };
  }

  private findTotal(statisticsRaw: any[], thisMonth: number) {
    const totalRaw = statisticsRaw.find(item => item._id.month === thisMonth);
    return totalRaw === undefined ? 0 : totalRaw.total;
  }
}
