import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { HttpClient } from '@angular/common/http';
import { AppActions } from '../app.actions';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { OptionableComponent } from '../optionable.component';
import { Option } from '../models/Option';
import { NotificationService } from '../notification.service';
import { Category } from '../models/Category';

@Component({
  selector: 'ak-form',
  templateUrl: 'form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent extends OptionableComponent implements AfterViewInit {

  constructor(private http: HttpClient,
              private notifications: NotificationService,
              actions: AppActions,
              store: StoreService<AppKeepState>) {
    super(store, actions);
  }

  ngAfterViewInit(): void {
    if (navigator || navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', event => {
        // this.appKeep.emit(event.data);
      });
    }
  }

  add(appKeep: AppKeep, options: Option[], categories: Category[]) {
    appKeep.category = appKeep.category || appKeep.title.toLowerCase();
    appKeep.date = Date.now();
    appKeep.amount = appKeep.amount || 0;
    appKeep.user = this.store.snapshot<string>(['user', 'info'], user => user.email);
    this.store.dispatch(this.actions.addAppKeep(appKeep));
    this.updateOptions(appKeep.title, appKeep.category, options, categories);
    this.store.dispatch(this.actions.loadStatistics());
    this.notifications.sendNotification(appKeep);
  }
}
