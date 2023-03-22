import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { AppKeep } from '../models/AppKeep';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';

@Component({
  selector: 'ak-monthly-appkeeps-card',
  templateUrl: 'monthly-appkeeps-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthlyAppkeepsCardComponent {

  categories$: Observable<Category[]>;
  monthlyAppkeepsTotal$: Observable<number>;
  monthlyAppKeeps$: Observable<AppKeep[]>;

  constructor(store: StoreService<AppKeepState>, actions: AppActions) {
    this.categories$ = store.get(['categories']);
    this.monthlyAppkeepsTotal$ = store.get(['monthlyAppKeeps'], monthlyAppkeeps => monthlyAppkeeps.reduce((partial, appKeep) => partial + appKeep.amount, 0));
    this.monthlyAppKeeps$ = store.get(['monthlyAppKeeps']);
    store.dispatch(actions.loadMonthlyAppKeeps());
  }
}
