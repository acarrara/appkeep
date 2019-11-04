import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppKeep } from './models/AppKeep';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppActions } from './app.actions';
import { Listen } from '../redux/listen.decorator';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';

@Component({
  selector: 'ak-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {

  @Listen(['appKeeps'])
  appKeeps$: Observable<AppKeep[]>;
  @Listen(['appKeeps'], appKeeps => appKeeps.reduce((previous, current) => previous + current.amount, 0))
  todayTotal$: Observable<number>;

  thisMonthTotal$: Observable<number>;
  lastMonthTotal$: Observable<number>;

  constructor(private http: HttpClient, private actions: AppActions, private store: StoreService<AppKeepState>) {
    this.store.dispatch(this.actions.loadAppKeeps());
    this.thisMonthTotal$ = this.getStatistics('/api/appkeeps/statistics/month/this');
    this.lastMonthTotal$ = this.getStatistics('/api/appkeeps/statistics/month/last');
  }

  remove(appKeep: AppKeep) {
    this.store.dispatch(this.actions.deleteAppKeep(appKeep));
  }

  private getStatistics(url = '/api/appkeeps/statistics/month/last') {
    return this.http.get<any>(url).pipe(
      map(statistics => statistics.length ? statistics[0].total : 0)
    );
  }

  @HostListener('window:online')
  sendMessage() {
    navigator.serviceWorker.controller.postMessage({type: 'online'});
  }
}
