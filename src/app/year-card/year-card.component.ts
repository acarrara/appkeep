import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { YearStatistics } from '../models/YearStatistics';
import { Month } from '../models/Month';

@Component({
  selector: 'ak-year-card',
  templateUrl: 'year-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearCardComponent implements OnChanges {
  @Input()
  year: string;
  @Input()
  hue = 0;
  @Input()
  yearStatistics: YearStatistics;

  total: number;
  topTotal: number;

  ngOnChanges(changes: SimpleChanges): void {
    this.total = this.yearStatistics.months
      .reduce((partial, currentMonth) => partial + currentMonth.incomeTotal + currentMonth.appKeepTotal, 0);
    this.topTotal = this.yearStatistics.months.reduce(((partial, currentMonth) => this.biggest(partial, currentMonth)), 0);
  }

  getIncomePercentage(month: Month) {
    return this.getPercentage(month.incomeTotal);
  }

  getAppKeepPercentage(month: Month) {
    return this.getPercentage(month.appKeepTotal);
  }

  private getPercentage(appKeepTotal: number) {
    return appKeepTotal ? Math.abs((appKeepTotal / this.topTotal * 100)).toFixed(0) + '%' : '0%';
  }

  private biggest(partial: number, currentMonth: Month) {
    return Math.max(partial, Math.abs(currentMonth.incomeTotal), Math.abs(currentMonth.appKeepTotal));
  }
}
