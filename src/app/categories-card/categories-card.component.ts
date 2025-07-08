import {ChangeDetectionStrategy, Component, inject, Input, OnChanges} from '@angular/core';
import {CategoryAmount} from '../models/CategoryAmount';
import {Observable} from 'rxjs';
import {Category} from '../models/Category';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';
import {AsyncPipe, LowerCasePipe} from '@angular/common';
import {CardComponent} from '../card/card.component';
import {RouterLink} from '@angular/router';
import {CategoryHuePipe} from '../pipes/category-hue.pipe';
import {AmountPipe} from '../pipes/amount.pipe';
import {IncomeIndicatorComponent} from '../income-indicator/income-indicator.component';

@Component({
  selector: 'ak-categories-card',
  templateUrl: 'categories-card.component.html',
  imports: [
    AsyncPipe,
    CardComponent,
    RouterLink,
    CategoryHuePipe,
    LowerCasePipe,
    AmountPipe,
    IncomeIndicatorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesCardComponent implements OnChanges {

  store: StoreService<AppKeepState> = inject(StoreService);

  categories$: Observable<Category[]> = this.store.get(['categories']);

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

  ngOnChanges(): void {
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
