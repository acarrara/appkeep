import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { AppKeep } from './models/AppKeep';
import { Observable } from 'rxjs';
import { Listen } from '../redux/listen.decorator';
import { MonthStatistics } from './models/MonthStatistic';
import { YearStatistics } from './models/YearStatistics';
import { SwUpdate } from '@angular/service-worker';

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
  availableVersion: boolean;

  constructor(private swUpdate: SwUpdate, cdr: ChangeDetectorRef) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.availableVersion = true;
        cdr.markForCheck();
      });
    }
  }

  @HostListener('window:online')
  sendMessage() {
    navigator.serviceWorker.controller.postMessage({type: 'online'});
  }

  hue(i: number) {
    return i % 8 + 1;
  }

  reload() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    }
  }
}
