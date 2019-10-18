import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  hues: number[] = [90, 240, 300];
  shades: number[] = [48, 54, 60, 66, 72, 78, 84, 90, 96];
  value = 0;

  constructor(private http: HttpClient) {
    this.appKeeps$ = this.http.get<AppKeep[]>('/api/appkeeps');
  }

  format(appKeep: AppKeep) {
    return `[${appKeep.type}] ${appKeep.title} (${new Date(appKeep.date)}) - ${appKeep.amount}`;
  }
}
