import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { HttpClient } from '@angular/common/http';
import { AppActions } from '../app.actions';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { OptionableComponent } from '../optionable.component';
import { Option } from '../models/Option';

@Component({
  selector: 'ak-form',
  templateUrl: 'form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent extends OptionableComponent implements AfterViewInit {

  @ViewChild('amount', {static: false})
  amount: ElementRef;

  constructor(private http: HttpClient, actions: AppActions, store: StoreService<AppKeepState>) {
    super(store, actions);
  }

  ngAfterViewInit(): void {
    this.amount.nativeElement.focus();
    if (navigator || navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', event => {
        // this.appKeep.emit(event.data);
      });
    }
  }

  add(appKeep: AppKeep, options: Option[]) {
    appKeep.category = appKeep.category || appKeep.title;
    appKeep.date = Date.now();
    appKeep.amount = appKeep.amount || 0;
    appKeep.user = this.store.snapshot<string>(['user'], user => user.email);
    this.store.dispatch(this.actions.addAppKeep(appKeep));
    this.updateOptions(appKeep.title, appKeep.category, options);
  }

  onChange(appKeep: AppKeep, options: Option[]) {
    const option: Option = this.optionFromList(appKeep.title, options);
    appKeep.category = option ? option.category : appKeep.category;
  }
}