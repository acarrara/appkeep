import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppKeep } from './models/AppKeep';

@Component({
  selector: 'ak-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  title = 'appkeep';
  appKeeps$: Observable<AppKeep[]>;

  constructor(private http: HttpClient) {
    this.appKeeps$ = this.http.get<AppKeep[]>('/api/appkeeps');
  }

  format(appKeep: AppKeep) {
    return `[${appKeep.type}] ${appKeep.title} (${new Date(appKeep.date)}) - ${appKeep.amount}`;
  }
}
