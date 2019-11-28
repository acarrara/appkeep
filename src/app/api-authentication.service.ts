import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, flatMap, map } from 'rxjs/operators';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { AppKeepState } from './models/AppKeepState';
import { StoreService } from '../redux/store.service';
import { AppActions } from './app.actions';

@Injectable()
export class ApiAuthenticationService {

  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  apiToken: string;
  private user: SocialUser;

  constructor(private http: HttpClient,
              private auth: AuthService,
              private store: StoreService<AppKeepState>,
              private actions: AppActions) {
  }

  signIn() {
    if (this.loggedIn$.getValue()) {
      return;
    }
    this.auth.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      if (user !== null) {
        this.user = user;
        this.store.dispatch(this.actions.login(user));
        this.getApiToken(user.idToken).subscribe(apiToken => {
          this.apiToken = apiToken;
          this.loggedIn$.next(true);
        });
      }
    });
  }

  getApiToken(idToken: string): Observable<string> {
    return this.http.post<string>('/auth', {token: idToken}).pipe(first());
  }

  silentSignIn(): Observable<boolean> {
    if (this.loggedIn$.getValue()) {
      return of(true);
    }
    return this.auth.authState.pipe(
      flatMap(user => {
        if (!user) {
          this.loggedIn$.next(false);
          return of(false);
        } else {
          this.user = user;
          this.store.dispatch(this.actions.login(user));
          return this.getApiToken(user.idToken).pipe(
            map(apiToken => {
              this.apiToken = apiToken;
              this.loggedIn$.next(true);
              return true;
            }));
        }
      })
    );
  }

  signOut(): Observable<any> {
    this.apiToken = undefined;
    this.user = undefined;
    this.loggedIn$.next(false);
    return from(this.auth.signOut());
  }
}
