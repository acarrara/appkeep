import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { Category } from '../models/Category';
import { AppActions } from '../app.actions';
import { Observable } from 'rxjs';
import { AppKeep } from '../models/AppKeep';
import { Location } from '@angular/common';
import { Recap } from '../models/Recap';
import { sumAppKeeps } from '../sumAppKeeps';

@Component({
  selector: 'ak-category',
  templateUrl: 'category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  thisYearStatistics$: Observable<Recap[]>;
  overallStatistics$: Observable<Recap[]>;
  thisMonthAppKeeps$: Observable<AppKeep[]>;
  thisMonthTotal$: Observable<number>;

  category: Category;

  year = '';
  month = '';

  private originalCategory: string;

  constructor(private activatedRoute: ActivatedRoute,
              private store: StoreService<AppKeepState>,
              private location: Location,
              private actions: AppActions) {
    this.thisYearStatistics$ = this.store.get(['categoryStatistics', 'months']);
    this.overallStatistics$ = this.store.get(['categoryStatistics', 'years']);
    this.thisMonthAppKeeps$ = this.store.get(['categoryStatistics', 'thisMonthAppKeeps']);
    this.thisMonthTotal$ = this.store.get(['categoryStatistics', 'thisMonthAppKeeps'], sumAppKeeps);

    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.originalCategory = paramMap.get('category');
      this.lookupCategory();
      this.year = paramMap.get('year');
      this.month = paramMap.get('month');
      this.store.dispatch(this.actions.loadCategoryStatistics(this.category.category, this.year, this.month));
    });
  }

  close() {
    this.location.back();
  }

  edit() {
    this.store.dispatch(this.actions.editCategory(this.category));
    this.close();
  }

  reset() {
    this.lookupCategory();
  }

  private lookupCategory() {
    this.category = {
      ...this.store.snapshot<Category>(['categories'], categories => categories.find(item => item.category === this.originalCategory))
    };
  }
}
