import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAuthenticationService } from './api-authentication.service';
import { map } from 'rxjs/operators';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'ak-app',
  imports: [
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: 'app.component.html'
})
export class AppComponent {
  loading$: Observable<boolean>;

  constructor() {
    const auth = inject(ApiAuthenticationService);

    this.loading$ = auth.loggedIn$.pipe(map(loggedIn => !loggedIn));
  }
}
