import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';
import {Category} from '../models/Category';
import {AppActions} from '../app.actions';
import {Observable} from 'rxjs';
import {AppKeep} from '../models/AppKeep';
import {AsyncPipe, Location} from '@angular/common';
import {Recap} from '../models/Recap';
import {sumAppKeeps} from '../sumAppKeeps';
import {NavigationHeaderComponent} from '../navigation-header/navigation-header.component';
import {MonthNamePipe} from '../pipes/month-name.pipe';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../icon/icon.component';
import {AppkeepsCardComponent} from '../appkeeps-card/appkeeps-card.component';
import {CategoryRecapCardComponent} from '../category-recap-card/category-recap-card.component';

@Component({
  selector: 'ak-category',
  templateUrl: 'category.component.html',
  imports: [
    NavigationHeaderComponent,
    MonthNamePipe,
    FormsModule,
    IconComponent,
    AppkeepsCardComponent,
    CategoryRecapCardComponent,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  store: StoreService<AppKeepState> = inject(StoreService);

  thisYearStatistics$: Observable<Recap[]> = this.store.get(['categoryStatistics', 'months']);
  overallStatistics$: Observable<Recap[]> = this.store.get(['categoryStatistics', 'years']);
  thisMonthAppKeeps$: Observable<AppKeep[]> = this.store.get(['categoryStatistics', 'thisMonthAppKeeps']);
  thisMonthTotal$: Observable<number> = this.store.get(['categoryStatistics', 'thisMonthAppKeeps'], sumAppKeeps);

  category: Category;

  year = '';
  month = '';

  private originalCategory: string;

  constructor(private activatedRoute: ActivatedRoute,
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
