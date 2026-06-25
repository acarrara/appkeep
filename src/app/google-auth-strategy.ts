import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import {filter, first, map, mergeMap, switchMap} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {AuthStrategy, SignInResult} from './auth-strategy';
import {UserInfo} from './models/UserInfo';

@Injectable()
export class GoogleAuthStrategy extends AuthStrategy {
  private http = inject(HttpClient);
  private auth = inject(SocialAuthService);

  signIn(): Observable<SignInResult> {
    return this.auth.initState.pipe(
      first(),
      switchMap(() => this.auth.authState),
      filter((social): social is SocialUser => !!social),
      mergeMap(social =>
        this.http.post<{user: UserInfo, apiToken: string}>('/auth', {token: social.idToken}).pipe(
          first(),
          map(({user, apiToken}) => ({apiToken, user, social}))
        )
      )
    );
  }

  override signOut(): Observable<any> {
    return from(this.auth.signOut());
  }
}