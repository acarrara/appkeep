import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'ak-login',
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private store: StoreService<AppKeepState>,
              private actions: AppActions,
              private router: Router) {
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnInit(): void {
    this.authService.authState.subscribe(user => {
      if (user !== null) {
        this.store.dispatch(this.actions.login(user));
        this.router.navigate(['/home']);
      }
    });
  }

}
