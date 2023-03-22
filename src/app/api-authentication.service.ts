import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, flatMap, map } from 'rxjs/operators';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { AppKeepState } from './models/AppKeepState';
import { StoreService } from '../redux/store.service';
import { AppActions } from './app.actions';
import { UserInfo } from './models/UserInfo';
import { Router } from '@angular/router';

@Injectable()
export class ApiAuthenticationService {

  private apiTokenSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  loggedIn$: Observable<boolean> = this.apiTokenSubject$.pipe(map(token => !!token));
  apiToken$: Observable<string> = this.apiTokenSubject$.asObservable();

  constructor(private http: HttpClient,
              private auth: SocialAuthService,
              private store: StoreService<AppKeepState>,
              private actions: AppActions,
              private router: Router) {
    this.auth.authState.subscribe(social => {
      if (social !== null) {
        this.getApiToken(social.idToken).subscribe(({user, apiToken}) => {
          this.store.dispatch(this.actions.login({social, info: user}));
          this.apiTokenSubject$.next(apiToken);
          this.router.navigate(['/home']);
        });
      }
    });
  }

  signIn() {
    if (this.apiTokenSubject$.getValue()) {
      return;
    }
    this.auth.authState.subscribe(social => {
      if (social !== null) {
        this.getApiToken(social.idToken).subscribe(({user, apiToken}) => {
          this.store.dispatch(this.actions.login({social, info: user}));
          this.apiTokenSubject$.next(apiToken);
        });
      }
    });
  }

  getApiToken(idToken: string): Observable<{ user: UserInfo, apiToken: string }> {
    return this.http.post<{ user: UserInfo, apiToken: string }>('/auth', {token: idToken}).pipe(first());
  }

  silentSignIn(): Observable<boolean> {
    if (this.apiTokenSubject$.getValue()) {
      return of(true);
    }
    return this.auth.authState.pipe(
      flatMap(social => {
        if (!social) {
          this.apiTokenSubject$.next(undefined);
          return of(false);
        } else {
          return this.getApiToken(social.idToken).pipe(
            map(({user, apiToken}) => {
              this.apiTokenSubject$.next(apiToken);
              this.store.dispatch(this.actions.login({social, info: user}));
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
