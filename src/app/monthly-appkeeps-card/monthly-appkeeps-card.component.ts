import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Listen } from '../../redux/listen.decorator';
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

  @Listen(['categories'])
  categories$: Observable<Category[]>;
  @Listen(['monthlyAppKeeps'], monthlyAppkeeps => monthlyAppkeeps.reduce((partial, appKeep) => partial + appKeep.amount, 0))
  monthlyAppkeepsTotal$: Observable<number>;
  @Listen(['monthlyAppKeeps'])
  monthlyAppKeeps$: Observable<AppKeep[]>;

  constructor(store: StoreService<AppKeepState>, actions: AppActions) {
    store.dispatch(actions.loadMonthlyAppKeeps());
  }
}
