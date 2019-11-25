import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { AppKeep } from './models/AppKeep';
import { Observable } from 'rxjs';
import { Listen } from '../redux/listen.decorator';
import { MonthStatistics } from './models/MonthStatistic';
import { YearStatistics } from './models/YearStatistics';
import { SwUpdate } from '@angular/service-worker';
import { NotificationService } from './notification.service';
import { Category } from './models/Category';

@Component({
  selector: 'ak-home',
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  @Listen(['appKeeps'])
  appKeeps$: Observable<AppKeep[]>;
  @Listen(['appKeeps'], appKeeps => appKeeps.reduce((previous, current) => previous + current.amount, 0))
  todayTotal$: Observable<number>;
  @Listen(['statistics', 'thisMonth'])
  thisMonthTotal$: Observable<MonthStatistics>;
  @Listen(['statistics', 'lastMonth'])
  lastMonthTotal$: Observable<MonthStatistics>;
  @Listen(['statistics', 'year'])
  lastYearTotal$: Observable<YearStatistics>;
  @Listen(['categories'])
  categories$: Observable<Category[]>;
  availableVersion: boolean;

  constructor(private swUpdate: SwUpdate,
              notificationService: NotificationService,
              private cdr: ChangeDetectorRef) {
    this.handleUpdates();
    notificationService.handlePushNotifications();
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
