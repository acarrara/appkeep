import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppKeep } from './models/AppKeep';
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
  @Listen(['statistics', 'thisMonth'])
  thisMonthTotal$: Observable<number>;
  @Listen(['statistics', 'lastMonth'])
  lastMonthTotal$: Observable<number>;

  constructor(private http: HttpClient, private actions: AppActions, private store: StoreService<AppKeepState>) {
  }

  remove(appKeep: AppKeep) {
    this.store.dispatch(this.actions.deleteAppKeep(appKeep));
  }

  @HostListener('window:online')
  sendMessage() {
    navigator.serviceWorker.controller.postMessage({type: 'online'});
  }
}
