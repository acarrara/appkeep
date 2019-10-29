import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppKeep } from './models/AppKeep';
import { first } from 'rxjs/operators';

@Component({
  selector: 'ak-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit {

  appKeeps: any[] = [];

  @ViewChild('amount', {static: true})
  amount: ElementRef;
  monthTotal: number;

  constructor(private http: HttpClient) {
    this.http.get<AppKeep[]>('/api/appkeeps').pipe(first()).subscribe(appKeeps => this.appKeeps = appKeeps);
    this.http.get<any>('/api/appkeeps/statistics').pipe(first()).subscribe(statistics => this.monthTotal = statistics[0].total);
  }

  ngAfterViewInit(): void {
    this.amount.nativeElement.focus();
  }

  add(appKeep: AppKeep) {
    appKeep.type = appKeep.title;
    appKeep.date = Date.now();
    this.http.post<AppKeep>('/api/appkeeps', appKeep).pipe(first()).subscribe(storedAppKeep => this.appKeeps.unshift(storedAppKeep));
  }

  remove(appKeep: any) {
    this.appKeeps.splice(this.appKeeps.indexOf(appKeep), 1);
  }

  todayTotal() {
    return this.appKeeps.reduce((previous, current) => previous + current.amount, 0);
  }
}
