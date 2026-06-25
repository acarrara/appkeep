import {Observable, of} from 'rxjs';
import {SocialUser} from '@abacritt/angularx-social-login';
import {UserInfo} from './models/UserInfo';

export interface SignInResult {
  apiToken: string;
  user: UserInfo;
  social: SocialUser | null;
}

export abstract class AuthStrategy {
  abstract signIn(): Observable<SignInResult>;

  signOut(): Observable<any> {
    return of(null);
  }
}