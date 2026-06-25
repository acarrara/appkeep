import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthStrategy, SignInResult} from './auth-strategy';
import {UserInfo} from './models/UserInfo';

@Injectable()
export class E2eAuthStrategy extends AuthStrategy {
  private http = inject(HttpClient);

  signIn(): Observable<SignInResult> {
    return this.http.post<{apiToken: string, user: UserInfo}>('/auth', {}).pipe(
      first(),
      map(({apiToken, user}) => ({apiToken, user, social: null}))
    );
  }
}