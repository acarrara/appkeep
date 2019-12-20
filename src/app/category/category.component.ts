import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { Category } from '../models/Category';
import { map } from 'rxjs/operators';
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

  private originalCategory: string;

  constructor(private activatedRoute: ActivatedRoute,
              private store: StoreService<AppKeepState>,
              private location: Location,
              private actions: AppActions) {
    this.activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('category'))).subscribe(category => {
      this.originalCategory = category;
      this.lookupCategory(category);
    });
    this.store.dispatch(this.actions.loadCategoryStatistics(this.category.category));
  }

  close() {
    this.location.back();
  }

  edit() {
    this.store.dispatch(this.actions.editCategory(this.category));
    this.close();
  }

  reset() {
    this.lookupCategory(this.originalCategory);
  }

  private lookupCategory(category: string) {
    this.category = {
      ...this.store.snapshot<Category>(['categories'], categories => categories.find(item => item.category === category))
    };
  }
}
