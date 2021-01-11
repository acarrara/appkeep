import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { Category } from '../models/Category';
import { AppActions } from '../app.actions';
import { Observable } from 'rxjs';
import { Listen } from '../../redux/listen.decorator';
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

  @Listen(['categoryStatistics', 'months'])
  thisYearStatistics$: Observable<Recap[]>;
  @Listen(['categoryStatistics', 'years'])
  overallStatistics$: Observable<Recap[]>;
  @Listen(['categoryStatistics', 'thisMonthAppKeeps'])
  thisMonthAppKeeps$: Observable<AppKeep[]>;
  @Listen(['categoryStatistics', 'thisMonthAppKeeps'], sumAppKeeps)
  thisMonthTotal$: Observable<number>;

  category: Category;

  year = '';
  month = '';

  private originalCategory: string;

  constructor(private activatedRoute: ActivatedRoute,
              private store: StoreService<AppKeepState>,
              private location: Location,
              private actions: AppActions) {
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
