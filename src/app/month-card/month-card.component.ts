import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  appKeepCategories: CategoryAmount[];
  @Input()
  incomeCategories: CategoryAmount[];
  @Input()
  explorable = false;

  appKeepTotal: number;
  incomeTotal: number;
  appKeepHighest: number;
  incomeHighest: number;

  ngOnChanges(changes: SimpleChanges): void {
    this.appKeepTotal = this.updateCategories(this.appKeepCategories);
    this.incomeTotal = this.updateCategories(this.incomeCategories);
    this.appKeepHighest = this.appKeepCategories.length ?
      this.appKeepCategories[0].total : 0;
    this.incomeHighest = this.incomeCategories.length ?
      this.incomeCategories[this.incomeCategories.length - 1].total : 0;
  }

  appKeepPercentage(category: CategoryAmount) {
    return this.percentageAsNumber(category, this.appKeepHighest) + '%';
  }

  incomePercentage(category: CategoryAmount) {
    return this.percentageAsNumber(category, this.incomeHighest) + '%';
  }

  appKeepRelativePercentage(category: CategoryAmount) {
    return this.percentageAsNumber(category, this.appKeepTotal) + '%';
  }

  incomeRelativePercentage(category: CategoryAmount) {
    return this.percentageAsNumber(category, this.incomeTotal) + '%';
  }

  private percentageAsNumber(category: CategoryAmount, total: number) {
    return (category.total / total * 100).toFixed(0);
  }

  private updateCategories(categoryAmounts: CategoryAmount[]) {
    categoryAmounts.sort(((a, b) => a.total - b.total));
    return categoryAmounts
      .reduce((previousValue, currentValue) => previousValue + currentValue.total, 0);
  }
}
