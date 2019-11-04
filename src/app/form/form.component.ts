import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { HttpClient } from '@angular/common/http';
import { AppActions } from '../app.actions';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';

@Component({
  selector: 'ak-form',
  templateUrl: 'form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements AfterViewInit {

  @ViewChild('amount', {static: true})
  amount: ElementRef;

  constructor(private http: HttpClient, private actions: AppActions, private store: StoreService<AppKeepState>) {
  }

  ngAfterViewInit(): void {
    this.amount.nativeElement.focus();
    if (navigator || navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', event => {
        // this.appKeep.emit(event.data);
      });
    }
  }

  add(appKeep: AppKeep) {
    appKeep.type = appKeep.title;
    appKeep.date = Date.now();
    appKeep.amount = appKeep.amount || 0;
    this.store.dispatch(this.actions.addAppKeep(appKeep));
  }
}
