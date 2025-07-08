import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Details} from '../models/Details';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';
import {AppActions} from '../app.actions';
import {take} from 'rxjs/operators';

@Injectable()
export class YearResolveGuard implements Resolve<Details>{
  private store = inject<StoreService<AppKeepState>>(StoreService);
  private actions = inject(AppActions);


  resolve(route: ActivatedRouteSnapshot): Observable<Details> | Details {
    const params = route.paramMap;
    if (!params.has('year')) {
      return this.store.snapshot<Details>(['statistics', 'thisYear']);
    } else {
      const year = params.get('year');
      this.store.dispatch(this.actions.loadYearStatistics(year));
      return this.store.get<Details>(['yearStatistics']).pipe(
        take(2)
      );
    }
  }
}
