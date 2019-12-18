import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAuthenticationService } from './api-authentication.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ak-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  loading$: Observable<boolean>;

  constructor(auth: ApiAuthenticationService) {
    this.loading$ = auth.loggedIn$.pipe(map(loggedIn => !loggedIn));
  }
}
