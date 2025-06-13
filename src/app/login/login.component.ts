import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiAuthenticationService } from '../api-authentication.service';

@Component({
    selector: 'ak-login',
    templateUrl: 'login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  constructor(private router: Router,
              private apiAuth: ApiAuthenticationService) {
  }

  signInWithGoogle() {
    this.apiAuth.signIn();
    this.apiAuth.loggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }
}
