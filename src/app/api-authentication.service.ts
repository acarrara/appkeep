import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {filter, first, map, mergeMap, switchMap} from 'rxjs/operators';
import {SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {AppKeepState} from './models/AppKeepState';
import {StoreService} from '../redux/store.service';
import {AppActions} from './app.actions';
import {UserInfo} from './models/UserInfo';

@Injectable()
export class ApiAuthenticationService {
  private http = inject(HttpClient);
  private auth = inject(SocialAuthService);
  private store = inject<StoreService<AppKeepState>>(StoreService);
  private actions = inject(AppActions);


  private apiTokenSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  loggedIn$: Observable<boolean> = this.apiTokenSubject$.pipe(map(token => !!token));
  apiToken$: Observable<string> = this.apiTokenSubject$.asObservable();

  getApiToken(idToken: string): Observable<{ user: UserInfo, apiToken: string }> {
    return this.http.post<{ user: UserInfo, apiToken: string }>('/auth', {token: idToken}).pipe(first());
  }

  silentSignIn(): Observable<boolean> {
    if (this.apiTokenSubject$.getValue()) {
      return of(true);
    }
    return this.auth.initState.pipe(
      first(),
      switchMap(() => this.auth.authState),
      filter((social): social is SocialUser => !!social),
      mergeMap(social => {
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
