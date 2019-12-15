import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryAmount } from '../models/CategoryAmount';
import { Listen } from '../../redux/listen.decorator';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';

@Component({
  selector: 'ak-categories-card',
  templateUrl: 'categories-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesCardComponent implements OnChanges {

  @Listen(['categories'])
  categories$: Observable<Category[]>;

  @Input()
  title: string;
  @Input()
  outCategories: CategoryAmount[];
  @Input()
  inCategories: CategoryAmount[];

  outTotal: number;
  inTotal: number;
  appKeepHighest: number;
  incomeHighest: number;

  ngOnChanges(changes: SimpleChanges): void {
    this.outTotal = this.updateCategories(this.outCategories);
    this.inTotal = this.updateCategories(this.inCategories);
    this.appKeepHighest = this.outCategories.length ?
      this.outCategories[0].total : 0;
    this.incomeHighest = this.inCategories.length ?
      this.inCategories[this.inCategories.length - 1].total : 0;
  }

  appKeepPercentage(category: CategoryAmount) {
    return this.percentageAsNumber(category, this.appKeepHighest) + '%';
  }

  incomePercentage(category: CategoryAmount) {
    return this.percentageAsNumber(category, this.incomeHighest) + '%';
  }

  appKeepRelativePercentage(category: CategoryAmount) {
    return this.percentageAsNumber(category, this.outTotal) + '%';
  }

  incomeRelativePercentage(category: CategoryAmount) {
    return this.percentageAsNumber(category, this.inTotal) + '%';
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
