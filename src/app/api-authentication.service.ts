import {Injectable, inject} from '@angular/core';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AppKeepState} from './models/AppKeepState';
import {StoreService} from '../redux/store.service';
import {AppActions} from './app.actions';
import {AuthStrategy} from './auth-strategy';
import {UserInfo} from './models/UserInfo';

@Injectable()
export class ApiAuthenticationService {
  private store = inject<StoreService<AppKeepState>>(StoreService);
  private actions = inject(AppActions);
  private authStrategy = inject(AuthStrategy);

  private apiTokenSubject$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  loggedIn$: Observable<boolean> = this.apiTokenSubject$.pipe(map(token => !!token));
  apiToken$: Observable<string | undefined> = this.apiTokenSubject$.asObservable();

  silentSignIn(): Observable<boolean> {
    if (this.apiTokenSubject$.getValue()) {
      return of(true);
    }
    return this.authStrategy.signIn().pipe(
      map(({apiToken, user, social}) => {
        this.apiTokenSubject$.next(apiToken);
        this.store.dispatch(this.actions.login({social, info: user as UserInfo}));
        return true;
      })
    );
  }

  signOut(): Observable<any> {
    this.apiTokenSubject$.next(undefined);
    return this.authStrategy.signOut();
  }
}