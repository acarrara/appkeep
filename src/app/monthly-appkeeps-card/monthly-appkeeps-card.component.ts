import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {Category} from '../models/Category';
import {AppKeep} from '../models/AppKeep';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';
import {AppActions} from '../app.actions';
import {CardComponent} from '../card/card.component';
import {AsyncPipe, LowerCasePipe, NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {CategoryHuePipe} from '../pipes/category-hue.pipe';
import {AmountPipe} from '../pipes/amount.pipe';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'ak-monthly-appkeeps-card',
  templateUrl: 'monthly-appkeeps-card.component.html',
  imports: [
    CardComponent,
    AsyncPipe,
    NgClass,
    RouterLink,
    LowerCasePipe,
    CategoryHuePipe,
    AmountPipe,
    IconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthlyAppkeepsCardComponent {

  store: StoreService<AppKeepState> = inject(StoreService);

  categories$: Observable<Category[]> = this.store.get(['categories']);
  monthlyAppkeepsTotal$: Observable<number> = this.store.get(
    ['monthlyAppKeeps'], monthlyAppkeeps => monthlyAppkeeps.reduce((partial, appKeep) => partial + appKeep.amount, 0));
  monthlyAppKeeps$: Observable<AppKeep[]> = this.store.get(['monthlyAppKeeps']);

  constructor(store: StoreService<AppKeepState>, actions: AppActions) {
    store.dispatch(actions.loadMonthlyAppKeeps());
  }
}
