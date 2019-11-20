import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { YearStatistics } from '../models/YearStatistics';
import { Month } from '../models/Month';
import { CategoryStatistics } from '../models/CategoryStatistics';

@Component({
  selector: 'ak-year-card',
  templateUrl: 'year-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearCardComponent {
  @Input()
  year: string;
  @Input()
  yearStatistics: YearStatistics;

  getTotal() {
    return this.yearStatistics.months.reduce((sum, current) => sum + current.total, 0);
  }

  getPercentage(month: Month) {
    return this.percentageAsNumber(month) + '%';
  }

  percentageAsNumber(month: Month) {
    return (month.total / this.getTotal() * 100).toFixed(0);
  }
}
