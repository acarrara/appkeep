import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject} from '@angular/core';
import {AppKeep} from '../models/AppKeep';
import {Observable} from 'rxjs';
import {SwUpdate} from '@angular/service-worker';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';
import {AppActions} from '../app.actions';
import {Recap} from '../models/Recap';
import {sumAppKeeps} from '../sumAppKeeps';
import {Details} from '../models/Details';
import {HomeHeaderComponent} from '../home-header/home-header.component';
import {FormComponent} from '../form/form.component';
import {AppkeepsCardComponent} from '../appkeeps-card/appkeeps-card.component';
import {AsyncPipe} from '@angular/common';
import {CategoriesCardComponent} from '../categories-card/categories-card.component';
import {IconComponent} from '../icon/icon.component';
import {RecapCardComponent} from '../recap-card/recap-card.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'ak-home',
  templateUrl: 'home.component.html',
  imports: [
    HomeHeaderComponent,
    FormComponent,
    AppkeepsCardComponent,
    AsyncPipe,
    CategoriesCardComponent,
    IconComponent,
    RecapCardComponent,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private swUpdate = inject(SwUpdate);
  private cdr = inject(ChangeDetectorRef);


  store: StoreService<AppKeepState> = inject(StoreService);

  appKeeps$: Observable<AppKeep[]> = this.store.get(['appKeeps']);
  todayTotal$: Observable<number> = this.store.get(['appKeeps'], sumAppKeeps);
  thisMonthTotal$: Observable<Details> = this.store.get(['statistics', 'thisMonth']);
  thisYearTotal$: Observable<Recap[]> = this.store.get(['statistics', 'thisYear'], statistics => statistics.ranges);
  overallTotal$: Observable<Recap[]> = this.store.get(['statistics', 'overall'], statistics => statistics.ranges);

  availableVersion: boolean;

  constructor() {
    const store = inject<StoreService<AppKeepState>>(StoreService);
    const actions = inject(AppActions);

    this.handleUpdates();

    store.dispatch(actions.loadAppKeeps());
    store.dispatch(actions.loadMonthlyAppKeeps());
    store.dispatch(actions.loadOptions());
    store.dispatch(actions.loadCategories());
    store.dispatch(actions.loadStatistics());
    store.dispatch(actions.loadUsers());
  }

  private handleUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then(() => {
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
