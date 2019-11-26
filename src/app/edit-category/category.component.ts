import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { Category } from '../models/Category';
import { map } from 'rxjs/operators';
import { AppActions } from '../app.actions';
import { Observable } from 'rxjs';
import { Listen } from '../../redux/listen.decorator';
import { YearStatistics } from '../models/YearStatistics';
import { AppKeep } from '../models/AppKeep';
import { Location } from '@angular/common';

@Component({
  selector: 'ak-category',
  templateUrl: 'category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  @Listen(['categoryStatistics', 'year'])
  yearStatistics$: Observable<YearStatistics>;
  @Listen(['categoryStatistics', 'thisMonthAppKeeps'])
  thisMonthAppKeeps$: Observable<AppKeep[]>;
  @Listen(['categoryStatistics', 'thisMonthAppKeeps'], appKeeps => appKeeps.reduce((previous, current) => previous + current.amount, 0))
  thisMonthTotal$: Observable<number>;
  @Listen(['categoryStatistics', 'lastMonthAppKeeps'])
  lastMonthAppKeeps$: Observable<AppKeep[]>;
  @Listen(['categoryStatistics', 'lastMonthAppKeeps'], appKeeps => appKeeps.reduce((previous, current) => previous + current.amount, 0))
  lastMonthTotal$: Observable<number>;

  category: Category;

  constructor(private activatedRoute: ActivatedRoute,
              private store: StoreService<AppKeepState>,
              private location: Location,
              private actions: AppActions) {
    this.activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('category'))).subscribe(category => {
      this.category = {
        ...this.store.snapshot<Category>(['categories'], categories => categories.find(item => item.category === category))
      };
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
}
