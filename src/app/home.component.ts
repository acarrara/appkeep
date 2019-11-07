import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { AppKeep } from './models/AppKeep';
import { Observable } from 'rxjs';
import { Listen } from '../redux/listen.decorator';

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
  thisMonthTotal$: Observable<number>;
  @Listen(['statistics', 'lastMonth'])
  lastMonthTotal$: Observable<number>;

  @HostListener('window:online')
  sendMessage() {
    navigator.serviceWorker.controller.postMessage({type: 'online'});
  }
}
