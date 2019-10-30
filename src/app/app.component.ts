import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppKeep } from './models/AppKeep';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'ak-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit {

  appKeeps: any[] = [];

  @ViewChild('amount', {static: true})
  amount: ElementRef;

  thisMonthTotal$: Observable<number>;
  lastMonthTotal$: Observable<number>;

  constructor(private http: HttpClient) {
    this.http.get<AppKeep[]>('/api/appkeeps').pipe(first()).subscribe(appKeeps => this.appKeeps = appKeeps);
    this.thisMonthTotal$ = this.getStatistics('/api/appkeeps/statistics/month/this');
    this.lastMonthTotal$ = this.getStatistics('/api/appkeeps/statistics/month/last');
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

  private getStatistics(url = '/api/appkeeps/statistics/month/last') {
    return this.http.get<any>(url).pipe(
      map(statistics => statistics.length ? statistics[0].total : 0)
    );
  }
}
