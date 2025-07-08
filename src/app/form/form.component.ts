import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {AppKeep} from '../models/AppKeep';
import {AppActions} from '../app.actions';
import {OptionableComponent} from '../optionable.component';
import {Option} from '../models/Option';
import {NotificationService} from '../notification.service';
import {Category} from '../models/Category';
import {AsyncPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AmountPipe} from '../pipes/amount.pipe';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'ak-form',
  templateUrl: 'form.component.html',
  imports: [
    AsyncPipe,
    FormsModule,
    AmountPipe,
    IconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent extends OptionableComponent implements AfterViewInit {
  private notifications = inject(NotificationService);


  constructor() {
    const actions = inject(AppActions);

    super(actions);
  }

  ngAfterViewInit(): void {
    if (navigator || navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', () => {
        // do nothing
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
