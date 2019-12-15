import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { AppKeep } from './models/AppKeep';
import { Observable } from 'rxjs';
import { Listen } from '../redux/listen.decorator';
import { SwUpdate } from '@angular/service-worker';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';
import { AppActions } from './app.actions';
import { Recap } from './models/Recap';
import { sumAppKeeps } from './sumAppKeeps';
import { Details } from './models/Details';

@Component({
  selector: 'ak-home',
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  @Listen(['appKeeps'])
  appKeeps$: Observable<AppKeep[]>;
  @Listen(['appKeeps'], sumAppKeeps)
  todayTotal$: Observable<number>;
  @Listen(['statistics', 'thisMonth'])
  thisMonthTotal$: Observable<Details>;
  @Listen(['statistics', 'thisYear'], statistics => statistics.ranges)
  thisYearTotal$: Observable<Recap[]>;
  @Listen(['statistics', 'overall'], statistics => statistics.ranges)
  overallTotal$: Observable<Recap[]>;
  availableVersion: boolean;

  constructor(private swUpdate: SwUpdate,
              private cdr: ChangeDetectorRef,
              store: StoreService<AppKeepState>,
              actions: AppActions) {
    this.handleUpdates();

    store.dispatch(actions.loadAppKeeps());
    store.dispatch(actions.loadOptions());
    store.dispatch(actions.loadCategories());
    store.dispatch(actions.loadStatistics());
    store.dispatch(actions.loadUsers());
  }

  private handleUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.availableVersion = true;
        this.cdr.markForCheck();
      });
    }
  }

  @HostListener('window:online')
  sendMessage() {
    navigator.serviceWorker.controller.postMessage({type: 'online'});
  }

  reload() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    }
  }
}
