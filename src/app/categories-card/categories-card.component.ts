import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryAmount } from '../models/CategoryAmount';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';

@Component({
  selector: 'ak-categories-card',
  templateUrl: 'categories-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesCardComponent implements OnChanges {

  categories$: Observable<Category[]>;

  @Input()
  title: string;
  @Input()
  year: string;
  @Input()
  month: string;
  @Input()
  outCategories: CategoryAmount[];
  @Input()
  inCategories: CategoryAmount[];

  outTotal: number;
  inTotal: number;
  appKeepHighest: number;
  incomeHighest: number;

  constructor(private readonly store: StoreService<AppKeepState>) {
    this.categories$ = this.store.get(['categories']);
  }

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

  categoryLink(category: string) {
    const path = ['/category', category];
    if (this.year) {
      path.push(this.year);
      path.push(this.month ? this.month : '1');
    }
    return path;
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
