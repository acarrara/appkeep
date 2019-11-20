import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MonthStatistics } from '../models/MonthStatistic';
import { CategoryStatistics } from '../models/CategoryStatistics';

@Component({
  selector: 'ak-month-card',
  templateUrl: 'month-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthCardComponent implements OnChanges {

  @Input()
  month: string;
  @Input()
  monthStatistics: MonthStatistics;

  private total: number;

  getTotal() {
    return this.total;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.monthStatistics.categories.sort(((a, b) => b.total - a.total));
    this.total = this.monthStatistics.categories.reduce((previousValue, currentValue) => previousValue + currentValue.total, 0);
  }

  percentage(category: CategoryStatistics) {
    return this.percentageAsNumber(category) + '%';
  }

  percentageAsNumber(category: CategoryStatistics) {
    return (category.total / this.total * 100).toFixed(0);
  }

  hue(i: number) {
    return i % 8 + 1;
  }
}
