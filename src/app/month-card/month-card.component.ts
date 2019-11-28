import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MonthStatistics } from '../models/MonthStatistic';
import { CategoryAmount } from '../models/CategoryAmount';
import { Listen } from '../../redux/listen.decorator';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';

@Component({
  selector: 'ak-month-card',
  templateUrl: 'month-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthCardComponent implements OnChanges {

  @Listen(['categories'])
  categories$: Observable<Category[]>;

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

  percentage(category: CategoryAmount) {
    return this.percentageAsNumber(category) + '%';
  }

  percentageAsNumber(category: CategoryAmount) {
    return (category.total / this.total * 100).toFixed(0);
  }
}
