import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Details} from '../models/Details';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';
import {AppActions} from '../app.actions';
import {take} from 'rxjs/operators';

@Injectable()
export class MonthResolveGuard implements Resolve<Details> {
  private store = inject<StoreService<AppKeepState>>(StoreService);
  private actions = inject(AppActions);


  resolve(route: ActivatedRouteSnapshot): Observable<Details> | Details {
    const params = route.paramMap;
    if (!params.has('year') || !params.has('month')) {
      return this.store.snapshot<Details>(['statistics', 'thisMonth']);
    } else {
      const year = params.get('year');
      const month = params.get('month');
      this.store.dispatch(this.actions.loadMonthStatistics(year, month));
      return this.store.get<Details>(['monthStatistics']).pipe(
        take(2)
      );
    }
  }
}
