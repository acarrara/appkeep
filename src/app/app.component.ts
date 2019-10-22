import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppKeep } from './models/AppKeep';

@Component({
  selector: 'ak-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit {

  appKeeps$: Observable<AppKeep[]>;

  appKeeps: any[] = [];

  @ViewChild('amount', {static: true})
  amount: ElementRef;

  constructor(private http: HttpClient) {
    this.appKeeps$ = this.http.get<AppKeep[]>('/api/appkeeps');
  }

  ngAfterViewInit(): void {
    this.amount.nativeElement.focus();
  }

  add(appKeep: any) {
    this.appKeeps.unshift(appKeep);
  }

  remove(appKeep: any) {
    this.appKeeps.splice(this.appKeeps.indexOf(appKeep), 1);
  }

  todayTotal() {
    return this.appKeeps.reduce((previous, current) => previous + current.amount, 0);
  }
}
