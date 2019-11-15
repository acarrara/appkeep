import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ak-login',
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private store: StoreService<AppKeepState>,
              private actions: AppActions,
              private router: Router,
              private http: HttpClient) {
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnInit(): void {
    this.authService.authState.subscribe(user => {
      if (user !== null) {
        this.http.post<boolean>(`/api/users/authorized`, {email: user.email}).subscribe(authorized => {
          if (authorized) {
            this.store.dispatch(this.actions.login(user));
            this.router.navigate(['/home']);
          } else {
            this.authService.signOut();
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
}
