import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, flatMap, map } from 'rxjs/operators';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { AppKeepState } from './models/AppKeepState';
import { StoreService } from '../redux/store.service';
import { AppActions } from './app.actions';

@Injectable()
export class ApiAuthenticationService {

  private apiTokenSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  loggedIn$: Observable<boolean> = this.apiTokenSubject$.pipe(map(token => !!token));
  apiToken$: Observable<string> = this.apiTokenSubject$.asObservable();

  constructor(private http: HttpClient,
              private auth: AuthService,
              private store: StoreService<AppKeepState>,
              private actions: AppActions) {
  }

  signIn() {
    if (this.apiTokenSubject$.getValue()) {
      return;
    }
    this.auth.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      if (user !== null) {
        this.store.dispatch(this.actions.login(user));
        this.getApiToken(user.idToken).subscribe(apiToken => this.apiTokenSubject$.next(apiToken));
      }
    });
  }

  getApiToken(idToken: string): Observable<string> {
    return this.http.post<string>('/auth', {token: idToken}).pipe(first());
  }

  silentSignIn(): Observable<boolean> {
    if (this.apiTokenSubject$.getValue()) {
      return of(true);
    }
    return this.auth.authState.pipe(
      flatMap(user => {
        if (!user) {
          this.apiTokenSubject$.next(undefined);
          return of(false);
        } else {
          this.store.dispatch(this.actions.login(user));
          return this.getApiToken(user.idToken).pipe(
            map(apiToken => {
              this.apiTokenSubject$.next(apiToken);
              return true;
            }));
        }
      })
    );
  }

  signOut(): Observable<any> {
    this.apiTokenSubject$.next(undefined);
    return from(this.auth.signOut());
  }
}
